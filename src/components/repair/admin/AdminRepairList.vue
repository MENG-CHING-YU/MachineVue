<!-- RepairList.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import RepairEditModal from './RepairEditModal.vue'
import RepairDeleteModal from './RepairDeleteModal.vue'

const repairList = ref([])
const loading = ref(true)
const error = ref(null)

const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedRepair = ref(null)

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

async function fetchRepairs() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('http://localhost:8080/api/repair')
    if (!res.ok) throw new Error('載入失敗')
    repairList.value = await res.json()
  } catch (e) {
    error.value = e.message || '網路錯誤'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRepairs()
})

function openEditModal(repair) {
  selectedRepair.value = { ...repair }
  showEditModal.value = true
}

function openDeleteModal(repair) {
  selectedRepair.value = { ...repair }
  showDeleteModal.value = true
}

async function handleUpdated() {
  showEditModal.value = false
  await fetchRepairs()
}

async function handleDeleted() {
  showDeleteModal.value = false
  await fetchRepairs()
}
</script>

<template>
  <div class="repair-list">
    <!-- 載入中 -->
    <div v-if="loading" class="loading">📡 資料載入中...</div>

    <!-- 錯誤 -->
    <div v-else-if="error" class="error">❌ {{ error }}</div>

    <!-- 無資料 -->
    <div v-else-if="repairList.length === 0" class="no-data">📭 無維修記錄</div>

    <!-- 表格資料 -->
    <div v-else class="table-container">
      <table class="repair-table">
        <thead>
          <tr>
            <th>報修編號</th>
            <th>機台編號</th>
            <th>機台名稱</th>
            <th>報修人員</th>
            <th>狀態</th>
            <th>報修時間</th>
            <th>描述</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="repair in repairList" :key="repair.repairId">
            <td>
              <strong>#{{ repair.repairId }}</strong>
            </td>
            <td>{{ repair.machineId }}</td>
            <td>{{ repair.machineName }}</td>
            <td>👤 {{ repair.reportEmployeeId }}</td>
            <td>
              <span :class="['status-badge', getStatusClass(repair.status)]">
                {{ getStatusIcon(repair.status) }} {{ repair.status }}
              </span>
            </td>
            <td>🕒 {{ new Date(repair.reportedAt).toLocaleString() }}</td>
            <td class="description" :title="repair.description">{{ repair.description }}</td>
            <td>
              <button @click="openEditModal(repair)">編輯</button>
              <button @click="openDeleteModal(repair)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 編輯 Modal -->
    <RepairEditModal
      v-if="showEditModal"
      :repair="selectedRepair"
      @close="() => (showEditModal.value = false)"
      @updated="handleUpdated"
    />

    <!-- 刪除 Modal -->
    <RepairDeleteModal
      v-if="showDeleteModal"
      :repair="selectedRepair"
      @close="() => (showDeleteModal.value = false)"
      @deleted="handleDeleted"
    />
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
  text-align: center;
}

.repair-table td.description {
  text-align: left;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  color: inherit;
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
  .repair-table {
    font-size: 12px;
    min-width: 600px;
  }

  .repair-table th,
  .repair-table td {
    padding: 8px;
  }

  .repair-table td.description {
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
