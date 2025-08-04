<script setup>
import { ref } from 'vue'
import AdminFilesList from '@/components/files/admin/AdminFilesList.vue'
import AdminFileSearch from '@/components/files/admin/AdminFileSearch.vue'

const isSearching = ref(false)
const searchResults = ref([])

function onSearchComplete(results) {
  searchResults.value = results
  isSearching.value = true
}
function onSearchClear() {
  searchResults.value = []
  isSearching.value = false
}
</script>

<template>
  <div class="files-admin">
    <h1>檔案管理系統</h1>
    <AdminFileSearch
      @search-complete="onSearchComplete"
      @search-clear="onSearchClear"
    />
    <div v-if="isSearching">
      <h3>搜尋結果</h3>
      <AdminFilesList :files="searchResults" />
      <button @click="onSearchClear" class="clear-search-btn">清除搜尋，回列表</button>
    </div>
    <div v-else>
      <h3>檔案列表</h3>
      <AdminFilesList />
    </div>
  </div>
</template>

<style scoped>
.files-admin {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}
h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
}
h3 {
  color: #34495e;
  margin-bottom: 20px;
  font-size: 20px;
}
.clear-search-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}
.clear-search-btn:hover {
  background-color: #7f8c8d;
}
</style>
