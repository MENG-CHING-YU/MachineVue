<script setup>
import { ref } from 'vue'
import MaintenanceList from '@/components/maintenance/admin/AdminMaintenanceList.vue'
import MaintenanceSearch from '@/components/maintenance/admin/AdminMaintenanceSearch.vue'

const isSearching = ref(false)
const searchResults = ref([])

function handleSearchComplete(results) {
  searchResults.value = results
  isSearching.value = true
}

function handleSearchClear() {
  searchResults.value = []
  isSearching.value = false
}
</script>

<template>
  <div class="maintenance-admin">
    <h1>保養管理系統</h1>
    <MaintenanceSearch
      @search-complete="handleSearchComplete"
      @search-clear="handleSearchClear"
    />
    <MaintenanceList v-if="isSearching" :maintenances="searchResults" />
    <MaintenanceList v-else />
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
