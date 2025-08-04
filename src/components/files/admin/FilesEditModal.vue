<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  file: Object
})
const emit = defineEmits(['close', 'updated'])

const form = ref({
  fileName: '',
  machineId: '',
  // 你可依需求擴充欄位
})

watch(
  () => props.file,
  (val) => {
    if (val) {
      form.value.fileName = val.fileName
      form.value.machineId = val.machineId
    }
  },
  { immediate: true }
)

function close() {
  emit('close')
}

async function save() {
  // 這裡請依實際API調整
  await fetch(`/api/files/${props.file.fileId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  })
  emit('updated')
  close()
}
</script>

<template>
  <div class="files-modal-overlay">
    <div class="files-modal-content">
      <h3>編輯檔案</h3>
      <div class="files-form-group">
        <label>檔案名稱</label>
        <input v-model="form.fileName" />
      </div>
      <div class="files-form-group">
        <label>機台 ID</label>
        <input v-model="form.machineId" />
      </div>
      <div class="files-modal-footer">
        <button @click="save">儲存</button>
        <button @click="close">取消</button>
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
.files-form-group { margin-bottom: 16px; }
.files-form-group label { display: block; margin-bottom: 6px; font-weight: bold; }
input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.files-modal-footer { display: flex; justify-content: flex-end; gap: 10px; }
button { padding: 8px 18px; border: none; border-radius: 4px; background: #3498db; color: #fff; cursor: pointer; }
button:hover { background: #2980b9; }
</style>
