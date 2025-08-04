<script setup>
import { ref, onMounted } from 'vue'
import FilesEditModal from './FilesEditModal.vue'
import FilesDeleteModal from './FilesDeleteModal.vue'

const fileList = ref([])
const loading = ref(true)
const error = ref(null)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedFile = ref(null)

// 搜尋相關
const keyword = ref('')
const machineId = ref('')
const searching = ref(false)
const searchResults = ref([])
const isSearchMode = ref(false)

// 取得檔案列表
async function fetchFiles() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('http://localhost:8080/api/files')
    if (!res.ok) throw new Error('載入失敗')
    fileList.value = await res.json()
  } catch (e) {
    error.value = e.message || '網路錯誤'
  } finally {
    loading.value = false
  }
}

onMounted(fetchFiles)

// 搜尋功能
async function handleSearch() {
  searching.value = true
  try {
    const params = new URLSearchParams()
    if (keyword.value) params.append('keyword', keyword.value)
    if (machineId.value) params.append('machineId', machineId.value)
    const res = await fetch(`http://localhost:8080/api/files/search?${params}`)
    if (!res.ok) throw new Error('搜尋失敗')
    searchResults.value = await res.json()
    isSearchMode.value = true
  } catch (e) {
    error.value = e.message || '搜尋錯誤'
  } finally {
    searching.value = false
  }
}

function handleClear() {
  keyword.value = ''
  machineId.value = ''
  searchResults.value = []
  isSearchMode.value = false
  error.value = null
}

// 編輯/刪除 Modal
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
    <h1>🗂️ 機台檔案管理系統</h1>
    <p>雲端檔案儲存與管理平台</p>

    <!-- 訊息顯示 -->
    <div v-if="error" class="message error">❌ {{ error }}</div>

    <!-- 搜尋表單 -->
    <div class="search-area">
      <input v-model="keyword" placeholder="搜尋關鍵字..." />
      <input v-model="machineId" placeholder="機台ID" />
      <button @click="handleSearch" :disabled="searching">搜尋</button>
      <button @click="handleClear" :disabled="searching">清除</button>
    </div>

    <!-- 檔案列表 -->
    <h3>
      📋 檔案列表 ({{ isSearchMode ? searchResults.length : fileList.length }} 筆)
      <span v-if="isSearchMode && keyword"> - 搜尋：「{{ keyword }}」</span>
      <span v-if="isSearchMode && machineId"> - 機台 ID：{{ machineId }}</span>
    </h3>

    <div v-if="loading" class="loading">📡 資料載入中...</div>
    <div v-else-if="(isSearchMode ? searchResults.length : fileList.length) === 0" class="empty-message">
      📂 沒有符合條件的檔案<br /><small>請調整搜尋條件或新增檔案</small>
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
          <tr v-for="file in isSearchMode ? searchResults : fileList" :key="file.fileId">
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

    <!-- 新增檔案按鈕 -->
    <div class="admin-controls">
      <button class="btn btn-success">➕ 新增檔案</button>
    </div>

    <!-- 編輯/刪除 Modal（可自行實作） -->
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
.files-list {
  margin-top: 20px;
}
h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}
.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
}
.search-area {
  margin-bottom: 18px;
  display: flex;
  gap: 10px;
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
.admin-controls {
  margin-top: 18px;
  text-align: right;
}
.btn.btn-success {
  background: #27ae60;
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
}
.btn.btn-success:hover {
  background: #219150;
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
