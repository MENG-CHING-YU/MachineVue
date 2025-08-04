<script setup>
import { ref, onMounted } from 'vue'

const fileList = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    const res = await fetch('http://localhost:8080/api/files')
    if (!res.ok) throw new Error('載入失敗')
    fileList.value = await res.json()
  } catch (e) {
    error.value = e.message || '網路錯誤'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="files-list">
    <div v-if="loading" class="loading">📡 資料載入中...</div>
    <div v-else-if="error" class="error">❌ {{ error }}</div>
    <div v-else-if="fileList.length === 0" class="no-data">📭 目前沒有檔案</div>
    <div v-else class="table-container">
      <table class="files-table">
        <thead>
          <tr>
            <th>檔案ID</th>
            <th>機台ID</th>
            <th>檔案名稱</th>
            <th>檔案下載</th>
            <th>上傳時間</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in fileList" :key="file.fileId">
            <td>#{{ file.fileId }}</td>
            <td>{{ file.machineId }}</td>
            <td>{{ file.fileName }}</td>
            <td>
              <a :href="file.filePath" target="_blank" rel="noopener noreferrer">
                {{ file.filePath.length > 40 ? file.filePath.slice(0, 40) + '...' : file.filePath }}
              </a>
            </td>
            <td>{{ file.formattedUploadTime }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.files-list {
  margin-top: 20px;
}
.loading,
.error,
.no-data {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  border-radius: 8px;
  margin: 20px 0;
}
.loading {
  background: #e8f4fd;
  color: #0c5460;
  border: 1px solid #bee5eb;
}
.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
.no-data {
  background: #f8f9fa;
  color: #6c757d;
  border: 2px dashed #dee2e6;
}
.table-container {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.files-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  min-width: 800px;
}
.files-table th {
  background: #34495e;
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: bold;
  font-size: 14px;
  position: sticky;
  top: 0;
  z-index: 1;
}
.files-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  vertical-align: middle;
  text-align: center;
}
.files-table tr:hover {
  background-color: #f8f9fa;
}
.files-table tr:last-child td {
  border-bottom: none;
}
</style>
