<!-- RepairDeleteModal.vue -->
<script setup>
import { ref } from 'vue';

const props = defineProps({
  repair: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'deleted']);
const loading = ref(false);

async function confirmDelete() {
  if (!props.repair || !props.repair.repairId) return;

  loading.value = true;
  try {
    const res = await fetch(`/api/repair/${props.repair.repairId}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      alert('刪除失敗！');
      return;
    }

    alert('刪除成功！');
    emit('deleted'); // 通知父元件刷新
  } catch (err) {
    alert('網路錯誤或伺服器錯誤');
  } finally {
    loading.value = false;
    emit('close'); // 關閉視窗
  }
}

function cancelDelete() {
  emit('close');
}
</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>❗ 確認刪除</h3>
        <button class="close-btn" @click="cancelDelete">✕</button>
      </div>
      <div class="modal-body">
        <p>你確定要刪除維修單 <strong>#{{ repair.repairId }}</strong> 嗎？</p>
        <p style="font-size: 13px; color: gray;">此操作無法復原。</p>
      </div>
      <div class="modal-footer">
        <button @click="cancelDelete" :disabled="loading">取消</button>
        <button @click="confirmDelete" :disabled="loading" class="danger">
          {{ loading ? '刪除中...' : '確定刪除' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.modal-body {
  margin-bottom: 20px;
  font-size: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

button.danger {
  background-color: #e74c3c;
  color: white;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.close-btn {
  font-size: 18px;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
