<script setup>
const props = defineProps({
  maintenance: Object
})
const emit = defineEmits(['close', 'deleted'])

async function confirmDelete() {
  // 這裡請依實際API調整
  await fetch(`/api/maintenance/${props.maintenance.maintenanceId}`, { method: 'DELETE' })
  emit('deleted')
  emit('close')
}
function cancelDelete() {
  emit('close')
}
</script>

<template>
  <div class="maintenance-modal-overlay">
    <div class="maintenance-modal-content">
      <h3>刪除保養單</h3>
      <div class="maintenance-modal-body">
        確定要刪除保養單 <strong>#{{ props.maintenance.maintenanceId }}</strong> 嗎？
      </div>
      <div class="maintenance-modal-footer">
        <button class="danger" @click="confirmDelete">刪除</button>
        <button @click="cancelDelete">取消</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.maintenance-modal-overlay {
  position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.maintenance-modal-content {
  background: #fff; border-radius: 8px; padding: 30px; min-width: 320px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.maintenance-modal-body { margin-bottom: 20px; }
.maintenance-modal-footer { display: flex; justify-content: flex-end; gap: 10px; }
button { padding: 8px 18px; border: none; border-radius: 4px; background: #3498db; color: #fff; cursor: pointer; }
button.danger { background: #e74c3c; }
button:hover { background: #2980b9; }
button.danger:hover { background: #c0392b; }
</style>
