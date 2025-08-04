<script setup>
const props = defineProps({
  file: Object
})
const emit = defineEmits(['close', 'deleted'])

async function confirmDelete() {
  await fetch(`/api/files/${props.file.fileId}`, { method: 'DELETE' })
  emit('deleted')
  emit('close')
}
function cancelDelete() {
  emit('close')
}
</script>

<template>
  <div class="files-modal-overlay">
    <div class="files-modal-content">
      <h3>刪除檔案</h3>
      <div class="files-modal-body">
        確定要刪除檔案 <strong>#{{ props.file.fileId }}</strong> 嗎？
      </div>
      <div class="files-modal-footer">
        <button class="danger" @click="confirmDelete">刪除</button>
        <button @click="cancelDelete">取消</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.files-modal-overlay {
  position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.files-modal-content {
  background: #fff; border-radius: 8px; padding: 30px; min-width: 320px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.files-modal-body { margin-bottom: 20px; }
.files-modal-footer { display: flex; justify-content: flex-end; gap: 10px; }
button { padding: 8px 18px; border: none; border-radius: 4px; background: #3498db; color: #fff; cursor: pointer; }
button.danger { background: #e74c3c; }
button:hover { background: #2980b9; }
button.danger:hover { background: #c0392b; }
</style>
