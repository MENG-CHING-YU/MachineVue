<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search-complete', 'search-clear'])

const keyword = ref('')
const machineId = ref('')
const searching = ref(false)
const searchResults = ref([])
const showResults = ref(false)
const error = ref(null)

async function handleSearch() {
  if (!keyword.value && !machineId.value) {
    error.value = '請輸入關鍵字或機台ID'
    return
  }
  error.value = null
  searching.value = true
  try {
    const params = new URLSearchParams()
    if (keyword.value) params.append('keyword', keyword.value)
    if (machineId.value) params.append('machineId', machineId.value)
    const res = await fetch(`/api/files/search?${params}`)
    if (!res.ok) throw new Error('查詢失敗')
    searchResults.value = await res.json()
    showResults.value = true
    emit('search-complete', searchResults.value)
  } catch (e) {
    error.value = e.message || '查詢失敗'
    showResults.value = false
  } finally {
    searching.value = false
  }
}

function handleClear() {
  keyword.value = ''
  machineId.value = ''
  searchResults.value = []
  showResults.value = false
  error.value = null
  emit('search-clear')
}
</script>

<template>
  <div class="file-search">
    <div class="file-search-box">
      <div class="form-row">
        <div class="form-group">
          <label>關鍵字：</label>
          <input v-model="keyword" placeholder="檔案名稱、ID..." :disabled="searching" @keyup.enter="handleSearch" />
        </div>
        <div class="form-group">
          <label>機台ID：</label>
          <input v-model="machineId" placeholder="機台ID" :disabled="searching" @keyup.enter="handleSearch" />
        </div>
      </div>
      <div class="button-group">
        <button @click="handleSearch" :disabled="searching">
          {{ searching ? '查詢中...' : '🔍 查詢' }}
        </button>
        <button @click="handleClear" :disabled="searching">
          🧹 清除
        </button>
      </div>
      <div v-if="error" class="search-error">{{ error }}</div>
    </div>
  </div>
</template>

<style scoped>
.file-search { margin-top: 20px; }
.file-search-box { padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f8f9fa; margin-bottom: 20px; }
.form-row { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 15px; }
.form-group { display: flex; align-items: center; gap: 8px; }
.form-group label { font-weight: bold; min-width: 60px; color: #2c3e50; }
input { padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
input:disabled { background-color: #e9ecef; color: #6c757d; cursor: not-allowed; }
.button-group { display: flex; gap: 10px; }
button { padding: 10px 20px; font-size: 14px; font-weight: bold; border: none; border-radius: 4px; cursor: pointer; }
button:first-child { background-color: #3498db; color: white; }
button:first-child:hover:not(:disabled) { background-color: #2980b9; }
button:last-child { background-color: #95a5a6; color: white; }
button:last-child:hover:not(:disabled) { background-color: #7f8c8d; }
button:disabled { background: #bdc3c7; cursor: not-allowed; }
.search-error { color: #dc3545; margin-top: 10px; }
@media (max-width: 768px) {
  .form-row { flex-direction: column; }
  .form-group { flex-direction: column; align-items: stretch; }
}
</style>
