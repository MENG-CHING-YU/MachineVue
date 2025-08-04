<script setup>
import { ref } from 'vue'
import UserFileSearch from '@/components/files/user/UserFileSearch.vue'
import UserFiles from '@/components/files/user/UserFiles.vue'

const showOriginalList = ref(true)
const searchResults = ref([])

function handleSearchComplete(results) {
  searchResults.value = results
  showOriginalList.value = false
}
function handleSearchClear() {
  searchResults.value = []
  showOriginalList.value = true
}
</script>

<template>
  <div class="files-user">
    <h1>檔案查詢</h1>
    <UserFileSearch
      @search-complete="handleSearchComplete"
      @search-clear="handleSearchClear"
    />
    <UserFiles v-if="showOriginalList" />
    <UserFiles v-else :files="searchResults" />
  </div>
</template>

<style scoped>
.files-user {
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
