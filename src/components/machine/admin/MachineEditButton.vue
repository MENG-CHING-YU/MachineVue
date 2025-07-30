<script setup>
import { ref } from 'vue'

const props = defineProps(['machine'])

// 控制視窗顯示
const showModal = ref(false)

// 表單資料
const formData = ref({})

// 載入狀態
const loading = ref(false)

// 開啟編輯視窗
function openEdit() {
  formData.value = { ...props.machine } // 複製機台資料
  showModal.value = true
}

// 儲存修改
async function saveEdit() {
  if (!formData.value.machineName || !formData.value.machineLocation) {
    alert('請填寫必填欄位！')
    return
  }

  loading.value = true

  try {
    const response = await fetch(`http://localhost:8080/api/machines/${props.machine.machineId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        machineId: formData.value.machineId, // ✅ 補上 ID
        machineName: formData.value.machineName,
        serialNumber: formData.value.serialNumber, // ✅ 補上出廠編號
        mstatus: formData.value.mstatus,
        machineLocation: formData.value.machineLocation,
      }),
    })

    if (response.ok) {
      alert('修改成功！')
      showModal.value = false
      location.reload()
    } else {
      alert('修改失敗！')
    }
  } catch (error) {
    alert('網路錯誤！')
  } finally {
    loading.value = false
  }
}

// 關閉視窗
function closeModal() {
  showModal.value = false
}
</script>

<template>
  <!-- 編輯按鈕 -->
  <a @click="openEdit" class="edit">✏️ 編輯</a>

  <!-- 編輯視窗 -->
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>編輯機台 #{{ formData.machineId }}</h3>
        <button @click="closeModal" class="close-btn">✕</button>
      </div>

      <div class="modal-body">
        <!-- 機台ID (不可修改) -->
        <div class="form-group">
          <label>機台ID：</label>
          <input :value="formData.machineId" readonly class="readonly" />
        </div>

        <!-- 出廠編號 (不可修改) -->
        <div class="form-group">
          <label>出廠編號：</label>
          <input :value="formData.serialNumber" readonly class="readonly" />
        </div>

        <!-- 機台名稱 (可修改) -->
        <div class="form-group">
          <label>機台名稱：*</label>
          <input v-model="formData.machineName" placeholder="請輸入機台名稱" />
        </div>

        <!-- 運行狀態 (可修改) -->
        <div class="form-group">
          <label>運行狀態：</label>
          <select v-model="formData.mstatus">
            <option value="運行中">🟢 運行中</option>
            <option value="維護中">🟡 維護中</option>
            <option value="停機">🔴 停機</option>
          </select>
        </div>

        <!-- 機台位置 (可修改) -->
        <div class="form-group">
          <label>機台位置：*</label>
          <input v-model="formData.machineLocation" placeholder="請輸入機台位置" />
        </div>
      </div>

      <!-- 按鈕 -->
      <div class="modal-footer">
        <button @click="closeModal" :disabled="loading">取消</button>
        <button @click="saveEdit" :disabled="loading">
          {{ loading ? '儲存中...' : '確定' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit {
  color: #3498db;
  text-decoration: none;
  margin-right: 15px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
}

.edit:hover {
  color: #f39c12;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.readonly {
  background-color: #f5f5f5;
  color: #666;
  cursor: not-allowed;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-footer button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-footer button:first-child {
  background: #ccc;
  color: white;
}

.modal-footer button:last-child {
  background: #27ae60;
  color: white;
}

.modal-footer button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
