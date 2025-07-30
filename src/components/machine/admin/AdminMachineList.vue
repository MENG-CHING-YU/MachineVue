<script setup>
import { onMounted, ref } from 'vue'
import EditButton from './MachineEditButton.vue'
import DeleteButton from './MachineDeleteButton.vue'

// 機台列表
const machineList = ref(null)

// 狀態樣式
function getStatusClass(status) {
  switch (status) {
    case '運行中':
      return 'running'
    case '維護中':
      return 'maintenance'
    case '停機':
      return 'stopped'
    default:
      return ''
  }
}

// 狀態圖示
function getStatusIcon(status) {
  switch (status) {
    case '運行中':
      return '🟢'
    case '維護中':
      return '🟡'
    case '停機':
      return '🔴'
    default:
      return '❓'
  }
}

// 載入資料
async function fetchMachines() {
  try {
    let response = await fetch('http://localhost:8080/api/machines')
    if (!response.ok) throw new Error('載入失敗')
    machineList.value = await response.json()
  } catch (error) {
    console.error('載入失敗:', error)
    machineList.value = []
  }
}

onMounted(fetchMachines)
</script>

<template>
  <div v-if="machineList === null">📡 資料載入中...</div>
  <div v-else>
    <!-- 新增按鈕 -->

    <!-- 資料表 -->
    <table>
      <thead>
        <tr>
          <th>機台ID</th>
          <th>機台名稱</th>
          <th>出廠編號</th>
          <th>運行狀態</th>
          <th>機台位置</th>
          <th>管理操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="machineList.length === 0">
          <td colspan="6" style="text-align: center; padding: 40px">📂 沒有機台資料</td>
        </tr>
        <tr v-for="machine in machineList" :key="machine.machineId">
          <td>
            <strong>#{{ machine.machineId }}</strong>
          </td>
          <td>{{ machine.machineName }}</td>
          <td>
            <code>{{ machine.serialNumber }}</code>
          </td>
          <td>
            <span :class="['status', getStatusClass(machine.mstatus)]">
              {{ getStatusIcon(machine.mstatus) }} {{ machine.mstatus }}
            </span>
          </td>
          <td>📍 {{ machine.machineLocation }}</td>
          <td class="action-links">
            <EditButton :machine="machine" />
            <DeleteButton :machine-id="machine.machineId" :machine-name="machine.machineName" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

th {
  background: #34495e;
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: bold;
  font-size: 14px;
}

td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

tr:hover {
  background-color: #f8f9fa;
}

.status {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
}

.status.running {
  background: #d4edda;
  color: #155724;
}

.status.maintenance {
  background: #fff3cd;
  color: #856404;
}

.status.stopped {
  background: #f8d7da;
  color: #721c24;
}

.action-links {
  white-space: nowrap;
}

code {
  background: #f1f2f6;
  padding: 3px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  color: #2c3e50;
  font-size: 13px;
}

button {
  background: #3498db;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s ease;
}

button:hover {
  background: #2980b9;
}
</style>
