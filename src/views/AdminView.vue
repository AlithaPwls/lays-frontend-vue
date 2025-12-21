<template>
    <div class="admin-page">
      <h1>Admin panel</h1>
      <p>Only ADMINS can see this page.</p>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  onMounted(() => {
    const user = localStorage.getItem('user')
  
    if (!user || !JSON.parse(user).isAdmin) {
      router.push('/designs')
    }
  })
  </script>