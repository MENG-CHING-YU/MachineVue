<script setup>
import { ref } from 'vue'

const form = ref({
  machineId: '',
  file: null
})
const errors = ref({
  machineId: '',
  file: ''
})
const message = ref('')
const loading = ref(false)

function validateForm() {
  errors.value.machineId = ''
  errors.value.file = ''
  let valid = true
  if (!form.value.machineId.trim()) {
    errors.value.machineId = '請輸入機台ID'
    valid = false
  }
  if (!form.value.file) {
    errors.value.file = '請選擇檔案'
    valid = false
  }
  return valid
}

async function handleSubmit() {
  if (!validateForm()) return
  loading.value = true
  message.value = ''
  try {
    const fd = new FormData()
    fd.append('machineId', form.value.machineId)
    fd.append('file', form.value.file)
    const res = await fetch('http://localhost:8080/api/files', {
      method: 'POST',
      body: fd
    })
    if (!res.ok) throw new Error('上傳失敗')
    message.value = '✅ 檔案上傳成功'
    form.value.machineId = ''
    form.value.file = null
    // 可加上自動刷新列表
  } catch (e) {
    message.value = '❌ ' + (e.message || '上傳失敗')
  } finally {
    loading.value = false
  }
}
function handleFileChange(e) {
  form.value.file = e.target.files[0]
}
</script>

<template>
  <div class="file-form">
    <h2>新增檔案</h2>
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div class="form-group">
        <label>機台ID：</label>
        <input v-model="form.machineId" type="text" :class="{ error: errors.machineId }" />
        <div v-if="errors.machineId" class="error-text">{{ errors.machineId }}</div>
      </div>
      <div class="form-group">
        <label>選擇檔案：</label>
        <input type="file" @change="handleFileChange" :class="{ error: errors.file }" />
        <div v-if="errors.file" class="error-text">{{ errors.file }}</div>
      </div>
      <div class="form-actions">
        <button type="submit" :disabled="loading">{{ loading ? '上傳中...' : '上傳' }}</button>
      </div>
      <div v-if="message" class="message">{{ message }}</div>
    </form>
  </div>
</template>

<style scoped>
.file-form {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem 2.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}
h2 {
  font-size: 1.6rem;
  color: #2c3e50;
  margin-bottom: 1.2rem;
  text-align: center;
}
.form-group {
  margin-bottom: 1.2rem;
}
label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  display: block;
}
input[type="text"], input[type="file"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  background-color: #fcfcfc;
  box-sizing: border-box;
  font-family: inherit;
}
input.error {
  border-color: #dc3545;
}
.error-text {
  color: #dc3545;
  font-size: 0.95em;
  margin-top: 0.25rem;
}
.form-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
}
button {
  padding: 10px 28px;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background-color: #28a745;
  color: white;
  transition: all 0.3s;
}
button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
.message {
  margin-top: 1rem;
  text-align: center;
  color: #155724;
}
</style>
