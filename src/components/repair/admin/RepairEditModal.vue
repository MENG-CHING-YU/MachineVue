<script setup>
import { ref, onMounted } from 'vue'
import RepairEditModal from './RepairEditModal.vue'

const repairList = ref([])
const loading = ref(true)
const error = ref(null)

const showEditModal = ref(false)
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
    const res = await fetch('/api/repair/list')
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
  selectedRepair.value = { ...repair } // 複製避免直接修改
  showEditModal.value = true
}

// 當編輯 Modal 完成更新後呼叫
async function handleUpdated() {
  showEditModal.value = false
  await fetchRepairs()
}

// 關閉 Modal
function handleClose() {
  showEditModal.value = false
}
</script>

<template>
  <div class="repair-list">
    <div v-if="loading" class="loading">📡 載入中...</div>
    <div v-else-if="error" class="error">❌ {{ error }}</div>
    <div v-else-if="repairList.length === 0" class="no-data">📭 無維修記錄</div>
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
            <td>{{ repair.repairId }}</td>
            <td>{{ repair.machineId }}</td>
            <td>{{ repair.machineName }}</td>
            <td>{{ repair.reportEmployeeId }}</td>
            <td>
              <span :class="['status-badge', getStatusClass(repair.status)]">
                {{ getStatusIcon(repair.status) }} {{ repair.status }}
              </span>
            </td>
            <td>{{ new Date(repair.reportedAt).toLocaleString() }}</td>
            <td class="description">{{ repair.description }}</td>
            <td>
              <button @click="openEditModal(repair)">編輯</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 編輯 Modal，只有一個 -->
    <RepairEditModal
      v-if="showEditModal"
      :repair="selectedRepair"
      @close="handleClose"
      @updated="handleUpdated"
    />
  </div>
</template>

<style scoped>
/* 你的樣式，和你之前的差不多 */
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
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
