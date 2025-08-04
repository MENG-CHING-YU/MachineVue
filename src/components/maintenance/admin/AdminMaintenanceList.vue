<script setup>
import { onMounted, ref } from 'vue'
import MaintenanceEditModal from './MaintenanceEditModal.vue'
import MaintenanceDeleteModal from './MaintenanceDeleteModal.vue'

const maintenanceList = ref([])
const loading = ref(true)
const error = ref(null)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedMaintenance = ref(null)

// 狀態選項
const statusOptions = ['待排程', '已排程', '進行中', '已完成', '已取消']

// 狀態圖示與樣式（物件對應寫法）
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

async function fetchMaintenance() {
  try {
    loading.value = true
    error.value = null
    const response = await fetch('http://localhost:8080/api/maintenance')
    if (!response.ok) throw new Error('Network response was not ok')
    maintenanceList.value = await response.json()
  } catch (err) {
    console.error('Fetch error:', err)
    error.value = `載入資料失敗：${err.message}`
  } finally {
    loading.value = false
  }
}

onMounted(fetchMaintenance)

function openEditModal(maintenance) {
  selectedMaintenance.value = { ...maintenance }
  showEditModal.value = true
}

function openDeleteModal(maintenance) {
  selectedMaintenance.value = { ...maintenance }
  showDeleteModal.value = true
}

async function handleUpdated() {
  showEditModal.value = false
  await fetchMaintenance()
}

async function handleDeleted() {
  showDeleteModal.value = false
  await fetchMaintenance()
}
</script>

<template>
  <div class="maintenance-list">
    <!-- 載入中 -->
    <div v-if="loading" class="maintenance-loading">📡 資料載入中...</div>

    <!-- 錯誤 -->
    <div v-else-if="error" class="maintenance-error">❌ {{ error }}</div>

    <!-- 無資料 -->
    <div v-else-if="maintenanceList.length === 0" class="maintenance-no-data">📭 目前沒有保養記錄</div>

    <!-- 資料表格 -->
    <div v-else class="maintenance-table-container">
      <table class="maintenance-table">
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
          <tr v-for="maintenance in maintenanceList" :key="maintenance.maintenanceId">
            <td><strong>#{{ maintenance.maintenanceId }}</strong></td>
            <td>{{ maintenance.machineId }}</td>
            <td>👤 {{ maintenance.employeeId }}</td>
            <td>
              <span :class="['maintenance-status-badge', getStatusClass(maintenance.status)]">
                {{ getStatusIcon(maintenance.status) }} {{ maintenance.status }}
              </span>
            </td>
            <td>🕒 {{ new Date(maintenance.reportedAt).toLocaleString() }}</td>
            <td class="maintenance-description" :title="maintenance.description">{{ maintenance.description }}</td>
            <td>
              <button @click="openEditModal(maintenance)">編輯</button>
              <button @click="openDeleteModal(maintenance)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 編輯 Modal -->
    <MaintenanceEditModal
      v-if="showEditModal"
      :maintenance="selectedMaintenance"
      :status-options="statusOptions"
      @close="() => (showEditModal.value = false)"
      @updated="handleUpdated"
    />

    <!-- 刪除 Modal -->
    <MaintenanceDeleteModal
      v-if="showDeleteModal"
      :maintenance="selectedMaintenance"
      @close="() => (showDeleteModal.value = false)"
      @deleted="handleDeleted"
    />
  </div>
</template>

<style scoped>
.maintenance-list {
  margin-top: 20px;
}

.maintenance-loading,
.maintenance-error,
.maintenance-no-data {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  border-radius: 8px;
  margin: 20px 0;
}

.maintenance-loading {
  background: #e8f4fd;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.maintenance-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.maintenance-no-data {
  background: #f8f9fa;
  color: #6c757d;
  border: 2px dashed #dee2e6;
}

.maintenance-table-container {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.maintenance-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  min-width: 800px;
}

.maintenance-table th {
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

.maintenance-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  vertical-align: middle;
  text-align: center;
}

.maintenance-table td.maintenance-description {
  text-align: left;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.maintenance-table tr:hover {
  background-color: #f8f9fa;
}

.maintenance-table tr:last-child td {
  border-bottom: none;
}

.maintenance-status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  white-space: nowrap;
  color: inherit;
}

.maintenance-status-pending {
  background: #fff3cd;
  color: #856404;
}

.maintenance-status-scheduled {
  background: #d1e7dd;
  color: #0f5132;
}

.maintenance-status-in-progress {
  background: #cce5ff;
  color: #004085;
}

.maintenance-status-completed {
  background: #d4edda;
  color: #155724;
}

.maintenance-status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.maintenance-status-unknown {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px dashed #dee2e6;
}

button {
  margin: 0 4px;
  padding: 6px 12px;
  border: none;
  background-color: #3498db;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2980b9;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .maintenance-table {
    font-size: 12px;
    min-width: 600px;
  }

  .maintenance-table th,
  .maintenance-table td {
    padding: 8px;
  }

  .maintenance-table td.maintenance-description {
    max-width: 150px;
  }

  .maintenance-loading,
  .maintenance-error,
  .maintenance-no-data {
    font-size: 16px;
    padding: 40px 15px;
  }
}
</style>
