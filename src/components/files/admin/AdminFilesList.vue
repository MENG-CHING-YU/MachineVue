<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import FilesEditModal from './FilesEditModal.vue'
import FilesDeleteModal from './FilesDeleteModal.vue'

const props = defineProps({
  files: {
    type: Array,
    default: null
  }
})

const fileList = ref([])
const loading = ref(true)
const error = ref(null)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedFile = ref(null)

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const displayFiles = computed(() => {
  const arr = props.files && Array.isArray(props.files) ? props.files : fileList.value
  return arr.map(f => ({
    ...f,
    formattedUploadTime: f.formattedUploadTime || formatDate(f.uploadTime)
  }))
})

async function fetchFiles() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('/api/files')
    if (!res.ok) throw new Error('載入失敗')
    fileList.value = await res.json()
  } catch (e) {
    error.value = e.message || '網路錯誤'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!props.files) fetchFiles()
})
watch(() => props.files, (val) => {
  if (val) loading.value = false
})

function openEditModal(file) {
  selectedFile.value = { ...file }
  showEditModal.value = true
}
function openDeleteModal(file) {
  selectedFile.value = { ...file }
  showDeleteModal.value = true
}
async function handleUpdated() {
  showEditModal.value = false
  await fetchFiles()
}
async function handleDeleted() {
  showDeleteModal.value = false
  await fetchFiles()
}
</script>

<template>
  <div class="files-list">
    <div v-if="error" class="message error">❌ {{ error }}</div>
    <div v-if="loading" class="loading">📡 資料載入中...</div>
    <div v-else-if="displayFiles.length === 0" class="empty-message">
      📂 沒有檔案
    </div>
    <div v-else class="files-table-container">
      <table class="files-table">
        <thead>
          <tr>
            <th>檔案 ID</th>
            <th>機台 ID</th>
            <th>檔案名稱</th>
            <th>檔案路徑</th>
            <th>上傳時間</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in displayFiles" :key="file.fileId">
            <td>#{{ file.fileId }}</td>
            <td>{{ file.machineId }}</td>
            <td>{{ file.fileName }}</td>
            <td>
              <a :href="file.filePath" target="_blank" rel="noopener noreferrer" :title="file.filePath">
                {{ file.filePath.length > 50 ? file.filePath.slice(0, 50) + '...' : file.filePath }}
              </a>
            </td>
            <td>{{ file.formattedUploadTime }}</td>
            <td class="action-links">
              <button @click="openEditModal(file)">✏️ 編輯</button>
              <button @click="openDeleteModal(file)">🗑️ 刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <FilesEditModal
      v-if="showEditModal"
      :file="selectedFile"
      @close="() => (showEditModal.value = false)"
      @updated="handleUpdated"
    />
    <FilesDeleteModal
      v-if="showDeleteModal"
      :file="selectedFile"
      @close="() => (showDeleteModal.value = false)"
      @deleted="handleDeleted"
    />
  </div>
</template>

<style scoped>
.files-list { margin-top: 20px; }
.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
}
.loading {
  text-align: center;
  padding: 40px 0;
  color: #0c5460;
  font-size: 18px;
}
.empty-message {
  text-align: center;
  padding: 40px 0;
  color: #6c757d;
  font-size: 18px;
}
.files-table-container {
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
button {
  margin: 0 4px;
  padding: 6px 12px;
  border: none;
  background-color: #3498db;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
button:hover {
  background-color: #2980b9;
}
</style>
