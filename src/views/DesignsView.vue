<template>
    <div class="designs-page">
      <router-link to="/" class="back-link">
        ← Back to configurator
      </router-link>
  
      <h1>All designs</h1>
  
      <div v-if="loading" class="status">
        Loading designs…
      </div>
  
      <div v-else-if="designs.length === 0" class="status">
        No designs yet
      </div>
  
      <div v-else class="designs-grid">
        <div
          v-for="design in designs"
          :key="design._id"
          class="design-card"
        >
        <div class="design-image-wrapper">
        <img
            v-if="design.image"
            :src="design.image"
            class="design-image"
        />
        </div>
            
          <h3
            class="design-title"
            :style="{ fontFamily: design.font }"
          >
            {{ design.title }}
          </h3>
  
          <p class="design-font">
            {{ design.font }}
          </p>
        </div>
      </div>
    </div>
  </template>

<script setup>
    import { ref, onMounted } from 'vue'
    
    const designs = ref([])     // 👈 BELANGRIJK
    const loading = ref(true)
    
    onMounted(async () => {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      window.location.href = '/login'
      return
    }

    const res = await fetch('http://localhost:3000/designs', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (res.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      return
    }

    designs.value = await res.json()
  } catch (error) {
    console.error('Error loading designs:', error)
  } finally {
    loading.value = false
  }
})
    </script>