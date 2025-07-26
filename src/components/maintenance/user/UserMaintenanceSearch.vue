<script setup>
import { ref } from 'vue';

const statusOptions = ['待排程', '已排程', '進行中', '已完成', '已取消'];
const selectedStatus = ref('');
const searchText = ref('');
const maintenanceList = ref([]);
const searching = ref(false);
const showResults = ref(false);
const error = ref(null);

// 狀態對應樣式
function getStatusClass(status) {
  switch (status) {
    case '待排程': return 'status-pending';
    case '已排程': return 'status-scheduled';
    case '進行中': return 'status-in-progress';
    case '已完成': return 'status-completed';
    case '已取消': return 'status-cancelled';
    default: return 'status-unknown';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case '待排程': return '🕓';
    case '已排程': return '📅';
    case '進行中': return '🔧';
    case '已完成': return '✅';
    case '已取消': return '❌';
    default: return '❓';
  }
}

// 查詢功能
async function handleSearch() {
  const params = new URLSearchParams();
  if (selectedStatus.value) params.append('status', selectedStatus.value);
  if (searchText.value.trim()) params.append('keyword', searchText.value.trim());

  if (!params.toString()) {
    alert('請至少選擇狀態或輸入關鍵字！');
    return;
  }

  try {
    searching.value = true;
    error.value = null;
    const res = await fetch(`/api/repair/search?${params.toString()}`);
    if (!res.ok) throw new Error('查詢失敗');
    maintenanceList.value = await res.json();
    showResults.value = true;
  } catch (err) {
    console.error(err);
    error.value = `查詢失敗：${err.message}`;
    showResults.value = false;
  } finally {
    searching.value = false;
  }
}

// 清除
function handleClear() {
  selectedStatus.value = '';
  searchText.value = '';
  maintenanceList.value = [];
  showResults.value = false;
  error.value = null;
}
</script>

<template>
  <div class="repair-search">
    <!-- 查詢表單 -->
    <div class="search-box">
      <div class="form-row">
        <div class="form-group">
          <label>狀態：</label>
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
            placeholder="保養描述、機台編號..." 
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

    <!-- 錯誤提示 -->
    <div v-if="error" class="error">
      ❌ {{ error }}
    </div>

    <!-- 查詢結果 -->
    <div v-if="showResults" class="table-container">
      <div class="result-info">
        <h3>🔎 查詢結果：共 {{ maintenanceList.length }} 筆</h3>
        <p class="search-conditions">
          <span v-if="selectedStatus">狀態：{{ selectedStatus }}</span>
          <span v-if="selectedStatus && searchText"> + </span>
          <span v-if="searchText">關鍵字：{{ searchText }}</span>
        </p>
      </div>

      <div v-if="maintenanceList.length === 0" class="no-data">
        📭 沒有符合的保養紀錄
      </div>

      <table v-else class="repair-table">
        <thead>
          <tr>
            <th>保養單編號</th>
            <th>機台編號</th>
            <th>保養人員編號</th>
            <th>保養描述</th>
            <th>保養狀態</th>
            <th>預計保養日期</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in maintenanceList" :key="m.maintenanceId">
            <td><strong>#{{ m.maintenanceId }}</strong></td>
            <td>{{ m.machineId }}</td>
            <td>👤 {{ m.employeeId }}</td>
            <td class="description">{{ m.description }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(m.status)">
                {{ getStatusIcon(m.status) }} {{ m.status }}
              </span>
            </td>
            <td>🕒 {{ new Date(m.reportedAt).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.repair-search {
  margin-top: 20px;
}

/* 表單區 */
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
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group label {
  font-weight: bold;
  min-width: 60px;
  color: #2c3e50;
}

input, select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

input:disabled, select:disabled {
  background-color: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:first-child {
  background-color: #3498db;
  color: white;
}

button:first-child:hover:not(:disabled) {
  background-color: #2980b9;
}

button:last-child {
  background-color: #95a5a6;
  color: white;
}

button:last-child:hover:not(:disabled) {
  background-color: #7f8c8d;
}

button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

/* 結果區 */
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
  color: #155724;
  font-size: 14px;
  font-weight: 500;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
  font-size: 18px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

/* 表格樣式 */
.table-container {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.repair-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  min-width: 800px;
}

.repair-table th {
  background: #34495e;
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: bold;
  font-size: 14px;
}

.repair-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  vertical-align: middle;
}

.repair-table tr:hover {
  background-color: #f8f9fa;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  white-space: nowrap;
}

/* 狀態樣式 */
.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-scheduled {
  background: #d1ecf1;
  color: #0c5460;
}

.status-in-progress {
  background: #cce5ff;
  color: #004085;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.status-unknown {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px dashed #dee2e6;
}

.description {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .form-group {
    flex-direction: column;
    align-items: stretch;
  }

  .description {
    max-width: 150px;
  }
}
</style>
