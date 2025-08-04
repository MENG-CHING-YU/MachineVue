<script setup>
import { ref } from 'vue'

const emit = defineEmits(['edit', 'delete'])

const statusOptions = ['待排程', '已排程', '進行中', '已完成', '已取消']
const selectedStatus = ref('')
const searchText = ref('')
const searching = ref(false)
const searchResults = ref([])
const showResults = ref(false)

// 狀態圖示與樣式
const statusClassMap = {
  '待排程': 'maintenance-status-pending',
  '已排程': 'maintenance-status-scheduled',
  '進行中': 'maintenance-status-in-progress',
  '已完成': 'maintenance-status-completed',
  '已取消': 'maintenance-status-cancelled'
}
const statusIconMap = {
  '待排程': '🕓',
  '已排程': '📅',
  '進行中': '🔧',
  '已完成': '✅',
  '已取消': '❌'
}
const getStatusClass = (status) => statusClassMap[status] || 'maintenance-status-unknown'
const getStatusIcon = (status) => statusIconMap[status] || '❓'

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
    const res = await fetch(`/api/maintenance/search?${params.toString()}`)
    if (!res.ok) throw new Error('查詢失敗')
    searchResults.value = await res.json()
    showResults.value = true
  } catch (err) {
    alert('查詢失敗，請稍後再試')
    showResults.value = false
  } finally {
    searching.value = false
  }
}

function handleClear() {
  selectedStatus.value = ''
  searchText.value = ''
  searchResults.value = []
  showResults.value = false
}
</script>

<template>
  <div class="maintenance-search">
    <!-- 搜尋表單 -->
    <div class="maintenance-search-box">
      <div class="maintenance-form-row">
        <div class="maintenance-form-group">
          <label>保養狀態：</label>
          <select v-model="selectedStatus" :disabled="searching">
            <option value="">-- 不限制 --</option>
            <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div class="maintenance-form-group">
          <label>關鍵字：</label>
          <input
            type="text"
            v-model="searchText"
            placeholder="保養單編號、機台編號、保養人員..."
            :disabled="searching"
            @keyup.enter="handleSearch"
          />
        </div>
      </div>
      <div class="maintenance-button-group">
        <button @click="handleSearch" :disabled="searching">
          {{ searching ? '查詢中...' : '🔍 查詢' }}
        </button>
        <button @click="handleClear" :disabled="searching">
          🧹 清除
        </button>
      </div>
    </div>

    <!-- 搜尋結果 -->
    <div v-if="showResults" class="maintenance-search-results">
      <div class="maintenance-result-info">
        <h3>🔎 查詢結果：共 {{ searchResults.length }} 筆</h3>
        <p class="maintenance-search-conditions">
          <span v-if="selectedStatus">狀態：{{ selectedStatus }}</span>
          <span v-if="selectedStatus && searchText"> + </span>
          <span v-if="searchText">關鍵字：{{ searchText }}</span>
        </p>
      </div>
      <div v-if="searchResults.length === 0" class="maintenance-no-results">
        📭 沒有符合的保養紀錄
      </div>
      <table v-else class="maintenance-results-table">
        <thead>
          <tr>
            <th>保養單編號</th>
            <th>機台編號</th>
            <th>保養人員編號</th>
            <th>保養狀態</th>
            <th>預計保養日期</th>
            <th>描述</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="maintenance in searchResults" :key="maintenance.maintenanceId">
            <td><strong>#{{ maintenance.maintenanceId }}</strong></td>
            <td>{{ maintenance.machineId }}</td>
            <td>👤 {{ maintenance.employeeId }}</td>
            <td>
              <span class="maintenance-status-badge" :class="getStatusClass(maintenance.status)">
                {{ getStatusIcon(maintenance.status) }} {{ maintenance.status }}
              </span>
            </td>
            <td>🕒 {{ new Date(maintenance.reportedAt).toLocaleString() }}</td>
            <td class="maintenance-description">{{ maintenance.description }}</td>
            <td>
              <button @click="$emit('edit', maintenance)">編輯</button>
              <button @click="$emit('delete', maintenance)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.maintenance-search { margin-top: 20px; }
.maintenance-search-box { padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f8f9fa; margin-bottom: 20px; }
.maintenance-form-row { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 15px; }
.maintenance-form-group { display: flex; align-items: center; gap: 8px; }
.maintenance-form-group label { font-weight: bold; min-width: 60px; color: #2c3e50; }
input, select { padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
input:disabled, select:disabled { background-color: #e9ecef; color: #6c757d; cursor: not-allowed; }
.maintenance-button-group { display: flex; gap: 10px; }
button { padding: 10px 20px; font-size: 14px; font-weight: bold; border: none; border-radius: 4px; cursor: pointer; }
button:first-child { background-color: #3498db; color: white; }
button:first-child:hover:not(:disabled) { background-color: #2980b9; }
button:last-child { background-color: #95a5a6; color: white; }
button:last-child:hover:not(:disabled) { background-color: #7f8c8d; }
button:disabled { background: #bdc3c7; cursor: not-allowed; }
.maintenance-search-results { margin-top: 20px; }
.maintenance-result-info { background: #e8f4fd; border: 1px solid #bee5eb; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
.maintenance-result-info h3 { margin: 0 0 8px 0; color: #0c5460; font-size: 18px; }
.maintenance-search-conditions { color: #155724; font-size: 14px; font-weight: 500; }
.maintenance-no-results { text-align: center; padding: 60px 20px; color: #6c757d; font-size: 18px; background: #f8f9fa; border-radius: 8px; border: 2px dashed #dee2e6; }
.maintenance-results-table { width: 100%; border-collapse: collapse; background: white; min-width: 800px; }
.maintenance-results-table th { background: #34495e; color: white; padding: 15px; text-align: left; font-weight: bold; font-size: 14px; }
.maintenance-results-table td { padding: 12px 15px; border-bottom: 1px solid #eee; font-size: 14px; vertical-align: middle; }
.maintenance-status-badge { padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; white-space: nowrap; }
.maintenance-status-pending { background: #fff3cd; color: #856404; }
.maintenance-status-scheduled { background: #d1e7dd; color: #0f5132; }
.maintenance-status-in-progress { background: #cce5ff; color: #004085; }
.maintenance-status-completed { background: #d4edda; color: #155724; }
.maintenance-status-cancelled { background: #f8d7da; color: #721c24; }
.maintenance-status-unknown { background: #f8f9fa; color: #6c757d; border: 1px dashed #dee2e6; }
.maintenance-description { max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
@media (max-width: 768px) {
  .maintenance-form-row { flex-direction: column; }
  .maintenance-form-group { flex-direction: column; align-items: stretch; }
  .maintenance-description { max-width: 150px; }
}
</style>
