<script setup>
import { onMounted, ref } from 'vue'

const maintenanceList = ref([])
const loading = ref(true)
const error = ref(null)

function getStatusClass(status) {
  switch (status) {
    case '待處理':
      return 'status-pending'
    case '進行中':
      return 'status-in-progress'
    case '已完成':
      return 'status-completed'
    default:
      return 'status-unknown'
  }
}

function getStatusIcon(status) {
  switch (status) {
    case '待處理':
      return '⏳'
    case '進行中':
      return '🔧'
    case '已完成':
      return '✅'
    default:
      return '❓'
  }
}

onMounted(async () => {
  try {
    loading.value = true
    const response = await fetch('http://localhost:8080/api/maintenance')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    maintenanceList.value = await response.json()
  } catch (err) {
    console.error('Fetch error:', err)
    error.value = `載入資料失敗：${err.message}`
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="repair-list">
    <!-- 載入中狀態 -->
    <div v-if="loading" class="loading">📡 資料載入中...</div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="error">❌ {{ error }}</div>

    <!-- 無資料狀態 -->
    <div v-else-if="maintenanceList.length === 0" class="no-data">📭 目前沒有維修記錄</div>

    <!-- 資料表格 -->
    <div v-else class="table-container">
      <table class="repair-table">
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
          <tr v-for="maintenance in maintenanceList" :key="maintenance.maintenanceId">
            <td>
              <strong>#{{ maintenance.maintenanceId }}</strong>
            </td>
            <td>{{ maintenance.machineId }}</td>
            <td>👤 {{ maintenance.employeeId }}</td>
            <td class="description">{{ maintenance.description }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(maintenance.status)">
                {{ getStatusIcon(maintenance.status) }} {{ maintenance.status }}
              </span>
            </td>
            <td>🕒 {{ new Date(maintenance.reportedAt).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.repair-list {
  margin-top: 20px;
}

.loading,
.error,
.no-data {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  border-radius: 8px;
  margin: 20px 0;
}

.loading {
  background: #e8f4fd;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.no-data {
  background: #f8f9fa;
  color: #6c757d;
  border: 2px dashed #dee2e6;
}

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
  position: sticky;
  top: 0;
  z-index: 1;
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

.repair-table tr:last-child td {
  border-bottom: none;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  white-space: nowrap;
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
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .repair-table {
    font-size: 12px;
    min-width: 600px;
  }

  .repair-table th,
  .repair-table td {
    padding: 8px;
  }

  .description {
    max-width: 150px;
  }

  .loading,
  .error,
  .no-data {
    font-size: 16px;
    padding: 40px 15px;
  }
}
</style>
