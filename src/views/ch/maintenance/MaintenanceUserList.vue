<script setup>
import { ref } from 'vue'
import MaintenanceList from '@/components/maintenance/user/UserMaintenanceList.vue'  // 列表元件
import MaintenanceSearch from '@/components/maintenance/user/UserMaintenanceSearch.vue'  // 搜尋元件

const showOriginalList = ref(true)

function handleSearchComplete() {
  showOriginalList.value = false
}

function handleSearchClear() {
  showOriginalList.value = true
}
</script>

<template>
  <div class="maintenance-admin">
    <h1>維修記錄管理系統</h1>
    
    <!-- 搜尋元件：永遠顯示 -->
    <MaintenanceSearch
      @search-complete="handleSearchComplete"
      @search-clear="handleSearchClear"
    />

    <!-- 維修記錄列表 -->
    <MaintenanceList v-if="showOriginalList" />
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
</style>
