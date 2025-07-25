<script setup>
import { ref } from 'vue';
import RepairList from '@/components/repair/admin/AdminRepairList.vue';
import RepairSearch from '@/components/repair/admin/AdminRepairSearch.vue';

const isSearching = ref(false);      // 是否顯示搜尋結果
const searchResults = ref([]);       // 搜尋結果

// 搜尋元件觸發：傳回搜尋結果，切換顯示搜尋元件
function onSearchComplete(results) {
  searchResults.value = results;
  isSearching.value = true;
}

// 搜尋元件清除搜尋，顯示列表
function onSearchClear() {
  searchResults.value = [];
  isSearching.value = false;
}
</script>

<template>
  <div>
    <!-- 搜尋元件 -->
    <RepairSearch @search-complete="onSearchComplete" @search-clear="onSearchClear" />

    <!-- 顯示搜尋結果列表 -->
    <div v-if="isSearching">
      <h3>搜尋結果</h3>
      <RepairList :repairs="searchResults" />
      <button @click="onSearchClear">清除搜尋，回列表</button>
    </div>

    <!-- 顯示完整列表 -->
    <div v-else>
      <h3>維修列表</h3>
      <RepairList />
    </div>
  </div>
</template>
