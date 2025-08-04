<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  maintenance: Object,
  statusOptions: Array
})

const emit = defineEmits(['close', 'updated'])

const form = ref({
  description: '',
  status: ''
})

watch(
  () => props.maintenance,
  (val) => {
    if (val) {
      form.value.description = val.description
      form.value.status = val.status
    }
  },
  { immediate: true }
)

function close() {
  emit('close')
}

async function save() {
  // 這裡請依實際API調整
  await fetch(`/api/maintenance/${props.maintenance.maintenanceId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  })
  emit('updated')
  close()
}
</script>

<template>
  <div class="maintenance-modal-overlay">
    <div class="maintenance-modal-content">
      <h3>編輯保養單</h3>
      <div class="maintenance-form-group">
        <label>描述</label>
        <input v-model="form.description" />
      </div>
      <div class="maintenance-form-group">
        <label>狀態</label>
        <select v-model="form.status">
          <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div class="maintenance-modal-footer">
        <button @click="save">儲存</button>
        <button @click="close">取消</button>
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
.maintenance-form-group { margin-bottom: 16px; }
.maintenance-form-group label { display: block; margin-bottom: 6px; font-weight: bold; }
input, select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.maintenance-modal-footer { display: flex; justify-content: flex-end; gap: 10px; }
button { padding: 8px 18px; border: none; border-radius: 4px; background: #3498db; color: #fff; cursor: pointer; }
button:hover { background: #2980b9; }
</style>
