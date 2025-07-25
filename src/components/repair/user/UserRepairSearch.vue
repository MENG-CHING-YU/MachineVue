<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search-complete', 'search-clear'])

const statusOptions = ['待處理', '進行中', '已完成']
const selectedStatus = ref('')
const searchText = ref('')
const searching = ref(false)
const searchResults = ref([])
const showResults = ref(false)

// 取得狀態樣式
function getStatusClass(status) {
    switch (status) {
        case '待處理': return 'status-pending';
        case '進行中': return 'status-in-progress';
        case '已完成': return 'status-completed';
        default: return 'status-unknown';
    }
}

// 取得狀態圖示
function getStatusIcon(status) {
    switch (status) {
        case '待處理': return '⏳';
        case '進行中': return '🔧';
        case '已完成': return '✅';
        default: return '❓';
    }
}

async function handleSearch() {
  const params = new URLSearchParams()
  if (selectedStatus.value) params.append('status', selectedStatus.value)
  if (searchText.value.trim()) params.append('keyword', searchText.value.trim())
  
  if (!params.toString()) {
    alert('請至少選擇狀態或輸入關鍵字！')
    return
  }
  
  try {
    searching.value = true
    const res = await fetch(`/api/repair/search?${params.toString()}`)
    if (!res.ok) throw new Error('查詢失敗')
    const data = await res.json()
    searchResults.value = data
    showResults.value = true
    
    // 通知父組件：搜尋完成，隱藏原本列表
    emit('search-complete')
    
  } catch (err) {
    console.error(err)
    alert('查詢失敗，請稍後再試')
  } finally {
    searching.value = false
  }
}

function handleClear() {
  // 清空所有搜尋條件和結果
  selectedStatus.value = ''
  searchText.value = ''
  searchResults.value = []
  showResults.value = false
  
  // 通知父組件：清除搜尋，顯示原本列表
  emit('search-clear')
}
</script>

<template>
  <div class="repair-search">
    <!-- 搜尋表單：永遠顯示 -->
    <div class="search-box">
      <div class="form-row">
        <div class="form-group">
          <label>處理狀態：</label>
          <select v-model="selectedStatus" :disabled="searching">
            <option value="">-- 不限制 --</option>
            <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>關鍵字：</label>
          <input 
            type="text" 
            v-model="searchText" 
            placeholder="報修編號、機台編號、報修人員..." 
            :disabled="searching"
            @keyup.enter="handleSearch"
          />
        </div>
      </div>
      
      <div class="button-group">
        <button @click="handleSearch" :disabled="searching">
          {{ searching ? '查詢中...' : '🔍 查詢' }}
        </button>
        <button @click="handleClear" :disabled="searching">
          🧹 清除
        </button>
      </div>
    </div>

    <!-- 搜尋結果：只有搜尋後才顯示 -->
    <div v-if="showResults" class="search-results">
      <div class="result-info">
        <h3>🔎 查詢結果：共 {{ searchResults.length }} 筆</h3>
        <p class="search-conditions">
          <span v-if="selectedStatus">狀態：{{ selectedStatus }}</span>
          <span v-if="selectedStatus && searchText"> + </span>
          <span v-if="searchText">關鍵字：{{ searchText }}</span>
        </p>
      </div>
      
      <!-- 沒有結果 -->
      <div v-if="searchResults.length === 0" class="no-results">
        📭 沒有符合的維修記錄
      </div>
      
      <!-- 搜尋結果表格 -->
      <table v-else class="results-table">
        <thead>
          <tr>
            <th>報修編號</th>
            <th>機台編號</th>
            <th>機台名稱</th>
            <th>報修人員</th>
            <th>處理狀態</th>
            <th>報修時間</th>
            <th>問題描述</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="repair in searchResults" :key="repair.repairId">
            <td><strong>#{{ repair.repairId }}</strong></td>
            <td>{{ repair.machineId }}</td>
            <td>{{ repair.machineName }}</td>
            <td>👤 {{ repair.reportedBy }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(repair.status)">
                {{ getStatusIcon(repair.status) }} {{ repair.status }}
              </span>
            </td>
            <td>🕒 {{ new Date(repair.reportedAt).toLocaleString() }}</td>
            <td class="description">{{ repair.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.repair-search {
  margin-bottom: 20px;
}

.search-box {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f8f9fa;
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group label {
  font-weight: bold;
  color: #2c3e50;
  min-width: 80px;
}

input, select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

select {
  min-width: 120px;
  background-color: white;
}

input {
  min-width: 250px;
  background-color: white;
}

input:focus, select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

input:disabled, select:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
  color: #6c757d;
}

.button-group {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s ease;
}

button:first-child {
  background: #3498db;
  color: white;
}

button:first-child:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-1px);
}

button:last-child {
  background: #95a5a6;
  color: white;
}

button:last-child:hover:not(:disabled) {
  background: #7f8c8d;
  transform: translateY(-1px);
}

button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

.search-results {
  animation: fadeIn 0.3s ease-in-out;
}

.result-info {
  background: #e8f4fd;
  border: 1px solid #bee5eb;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.result-info h3 {
  margin: 0 0 8px 0;
  color: #0c5460;
  font-size: 18px;
}

.search-conditions {
  margin: 0;
  color: #155724;
  font-size: 14px;
  font-weight: 500;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
  font-size: 18px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.results-table th {
  background: #34495e;
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: bold;
  font-size: 14px;
}

.results-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.results-table tr:hover {
  background-color: #f8f9fa;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-in-progress {
  background: #cce5ff;
  color: #004085;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.status-unknown {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px dashed #dee2e6;
}

.description {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 15px;
  }
  
  .form-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .form-group label {
    min-width: auto;
    margin-bottom: 5px;
  }
  
  input {
    min-width: auto;
  }
  
  .button-group {
    justify-content: center;
  }
  
  .results-table {
    font-size: 12px;
  }
  
  .results-table th,
  .results-table td {
    padding: 8px;
  }
  
  .description {
    max-width: 100px;
  }
}
</style>