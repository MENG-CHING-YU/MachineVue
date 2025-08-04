<script setup>
import { ref } from 'vue'
import MaintenanceList from '@/components/maintenance/admin/AdminMaintenanceList.vue'
import MaintenanceSearch from '@/components/maintenance/admin/AdminMaintenanceSearch.vue'

const isSearching = ref(false)      // 是否顯示搜尋結果
const searchResults = ref([])       // 搜尋結果

// 搜尋元件觸發：傳回搜尋結果，切換顯示搜尋元件
function onSearchComplete(results) {
  searchResults.value = results
  isSearching.value = true
}

// 搜尋元件清除搜尋，顯示列表
function onSearchClear() {
  searchResults.value = []
  isSearching.value = false
}
</script>

<template>
  <div class="maintenance-admin">
    <h1>保養管理系統</h1>

    <!-- 搜尋元件 -->
    <MaintenanceSearch
      @search-complete="onSearchComplete"
      @search-clear="onSearchClear"
    />

    <!-- 顯示搜尋結果列表 -->
    <div v-if="isSearching">
      <h3>搜尋結果</h3>
      <MaintenanceList :maintenances="searchResults" />
      <button @click="onSearchClear" class="clear-search-btn">清除搜尋，回列表</button>
    </div>

    <!-- 顯示完整列表 -->
    <div v-else>
      <h3>保養列表</h3>
      <MaintenanceList />
    </div>
  </div>
</template>

<style scoped>
.maintenance-admin {
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
