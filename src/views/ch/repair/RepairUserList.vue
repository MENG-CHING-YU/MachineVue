<script setup>
import { ref } from 'vue';
import RepairList from '@/components/repair/user/UserRepairList.vue';
import RepairSearch from '@/components/repair/user/UserRepairSearch.vue';

// 控制顯示狀態：true=顯示原本列表，false=顯示搜尋結果
const showOriginalList = ref(true);

// 當搜尋完成時
function handleSearchComplete() {
  showOriginalList.value = false;  
}

// 當清除搜尋時
function handleSearchClear() {
  showOriginalList.value = true;   // 顯示原本列表
}
</script>

<template>
  <div class="repair-admin">
    <h1>維修記錄管理系統</h1>
    
    <!-- 搜尋組件：永遠顯示 -->
    <RepairSearch 
      @search-complete="handleSearchComplete"
      @search-clear="handleSearchClear"
    />
    
    <!-- 原本的維修記錄列表：只有在沒有搜尋時才顯示 -->
    <RepairList v-if="showOriginalList" />
  </div>
</template>

<style scoped>
.repair-admin {
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