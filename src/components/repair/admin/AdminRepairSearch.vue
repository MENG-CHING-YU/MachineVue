<script setup>
import { ref } from 'vue'
import RepairEditModal from './RepairEditModal.vue'
import RepairDeleteModal from './RepairDeleteModal.vue'

const emit = defineEmits(['search-complete', 'search-clear'])

const statusOptions = ['待處理', '進行中', '已完成']
const selectedStatus = ref('')
const searchText = ref('')
const searching = ref(false)
const searchResults = ref([])
const showResults = ref(false)

const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedRepair = ref(null)

function getStatusClass(status) {
  switch (status) {
    case '待處理': return 'status-pending';
    case '進行中': return 'status-in-progress';
    case '已完成': return 'status-completed';
    default: return 'status-unknown';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case '待處理': return '⏳';
    case '進行中': return '🔧';
    case '已完成': return '✅';
    default: return '❓';
  }
}

async function handleSearch() {
  const params = new URLSearchParams()
  if (selectedStatus.value) params.append('status', selectedStatus.value)
  if (searchText.value.trim()) params.append('keyword', searchText.value.trim())

  if (!params.toString()) {
    alert('請至少選擇狀態或輸入關鍵字！')
    return
  }

  try {
    searching.value = true
    const res = await fetch(`/api/repair/search?${params.toString()}`)
    if (!res.ok) throw new Error('查詢失敗')
    const data = await res.json()
    searchResults.value = data
    showResults.value = true

    emit('search-complete')
  } catch (err) {
    console.error(err)
    alert('查詢失敗，請稍後再試')
  } finally {
    searching.value = false
  }
}

function handleClear() {
  selectedStatus.value = ''
  searchText.value = ''
  searchResults.value = []
  showResults.value = false
  emit('search-clear')
}

function openEditModal(repair) {
  selectedRepair.value = { ...repair }
  showEditModal.value = true
}

function openDeleteModal(repair) {
  selectedRepair.value = { ...repair }
  showDeleteModal.value = true
}

function handleUpdated() {
  showEditModal.value = false
  handleSearch()
}

function handleDeleted() {
  showDeleteModal.value = false
  handleSearch()
}

function handleCloseEdit() {
  showEditModal.value = false
}

function handleCloseDelete() {
  showDeleteModal.value = false
}
</script>

<template>
  <div class="repair-search">
    <div class="search-box">
      <div class="form-row">
        <div class="form-group">
          <label>處理狀態：</label>
          <select v-model="selectedStatus" :disabled="searching">
            <option value="">-- 不限制 --</option>
            <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>關鍵字：</label>
          <input
            type="text"
            v-model="searchText"
            placeholder="報修編號、機台編號、報修人員..."
            :disabled="searching"
            @keyup.enter="handleSearch"
          />
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
    </div>

    <div v-if="showResults" class="search-results">
      <div class="result-info">
        <h3>🔎 查詢結果：共 {{ searchResults.length }} 筆</h3>
        <p class="search-conditions">
          <span v-if="selectedStatus">狀態：{{ selectedStatus }}</span>
          <span v-if="selectedStatus && searchText"> + </span>
          <span v-if="searchText">關鍵字：{{ searchText }}</span>
        </p>
      </div>

      <div v-if="searchResults.length === 0" class="no-results">
        📭 沒有符合的維修記錄
      </div>

      <table v-else class="results-table">
        <thead>
          <tr>
            <th>報修編號</th>
            <th>機台編號</th>
            <th>機台名稱</th>
            <th>報修人員</th>
            <th>處理狀態</th>
            <th>報修時間</th>
            <th>問題描述</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="repair in searchResults" :key="repair.repairId">
            <td><strong>#{{ repair.repairId }}</strong></td>
            <td>{{ repair.machineId }}</td>
            <td>{{ repair.machineName }}</td>
            <td>👤 {{ repair.reportedBy }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(repair.status)">
                {{ getStatusIcon(repair.status) }} {{ repair.status }}
              </span>
            </td>
            <td>🕒 {{ new Date(repair.reportedAt).toLocaleString() }}</td>
            <td class="description">{{ repair.description }}</td>
            <td>
              <button @click="openEditModal(repair)">編輯</button>
              <button @click="openDeleteModal(repair)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <RepairEditModal
      v-if="showEditModal"
      :repair="selectedRepair"
      @close="handleCloseEdit"
      @updated="handleUpdated"
    />

    <RepairDeleteModal
      v-if="showDeleteModal"
      :repair="selectedRepair"
      @close="handleCloseDelete"
      @deleted="handleDeleted"
    />
  </div>
</template>
