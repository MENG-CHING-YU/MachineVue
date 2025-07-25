<!-- RepairList.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import RepairEditModal from './RepairEditModal.vue';
import RepairDeleteModal from './RepairDeleteModal.vue';

const repairList = ref([]);
const loading = ref(true);
const error = ref(null);

const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedRepair = ref(null);

function getStatusClass(status) {
  switch (status) {
    case '待處理': return 'status-pending';
    case '進行中': return 'status-in-progress';
    case '已完成': return 'status-completed';
    default: return 'status-unknown';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case '待處理': return '⏳';
    case '進行中': return '🔧';
    case '已完成': return '✅';
    default: return '❓';
  }
}

async function fetchRepairs() {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch('/api/repair/list');
    if (!res.ok) throw new Error('載入失敗');
    repairList.value = await res.json();
  } catch (e) {
    error.value = e.message || '網路錯誤';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchRepairs();
});

function openEditModal(repair) {
  selectedRepair.value = { ...repair };
  showEditModal.value = true;
}

function openDeleteModal(repair) {
  selectedRepair.value = { ...repair };
  showDeleteModal.value = true;
}

async function handleUpdated() {
  showEditModal.value = false;
  await fetchRepairs();
}

async function handleDeleted() {
  showDeleteModal.value = false;
  await fetchRepairs();
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
            <td>#{{ repair.repairId }}</td>
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
      @close="() => showEditModal.value = false"
      @updated="handleUpdated"
    />

    <!-- 刪除 Modal -->
    <RepairDeleteModal
      v-if="showDeleteModal"
      :repair="selectedRepair"
      @close="() => showDeleteModal.value = false"
      @deleted="handleDeleted"
    />
  </div>
</template>

<style scoped>
.loading {
  font-size: 1.2em;
  color: #555;
  padding: 20px;
  text-align: center;
}

.error {
  color: red;
  padding: 20px;
  text-align: center;
}

.no-data {
  color: #888;
  padding: 20px;
  text-align: center;
}

.table-container {
  overflow-x: auto;
}

.repair-table {
  width: 100%;
  border-collapse: collapse;
}

.repair-table th,
.repair-table td {
  border: 1px solid #ccc;
  padding: 8px 12px;
  text-align: center;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-weight: 600;
}

.status-pending {
  background-color: #f39c12;
}

.status-in-progress {
  background-color: #3498db;
}

.status-completed {
  background-color: #2ecc71;
}

.status-unknown {
  background-color: #7f8c8d;
}

.description {
  text-align: left;
  max-width: 200px;
  word-break: break-word;
}

button {
  margin: 0 4px;
  padding: 6px 12px;
  border: none;
  background-color: #3498db;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}
</style>
