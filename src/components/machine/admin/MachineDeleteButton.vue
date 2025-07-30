<script setup>
const props = defineProps(['machineId', 'machineName'])

async function handleDelete() {
  // 顯示確認對話框
  const confirmDelete = confirm(`確認要刪除 #${props.machineId} 嗎？`)

  if (confirmDelete === false) {
    alert('刪除失敗')
    return
  }

  if (confirmDelete === true) {
    try {
      const response = await fetch(`http://localhost:8080/api/machines/${props.machineId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('刪除成功！')
        location.reload() // 重新載入頁面
      } else {
        alert('刪除失敗！')
      }
    } catch (error) {
      console.error('API 刪除失敗:', error)
      alert('刪除失敗！')
    }
  }
}
</script>

<template>
  <a @click="handleDelete" class="delete">🗑️ 刪除</a>
</template>

<style scoped>
.delete {
  color: #3498db;
  text-decoration: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  transition: color 0.3s ease;
}

.delete:hover {
  color: #e74c3c;
}
</style>
