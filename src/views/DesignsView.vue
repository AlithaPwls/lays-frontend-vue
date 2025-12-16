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

          <button
  class="like-button"
  :disabled="isOwnDesign(design) || hasLiked(design)"
  @click="likeDesign(design)"
>
  ❤️ {{ design.likes.length }}
</button>
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

function getCurrentUser() {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

function isOwnDesign(design) {
  const user = getCurrentUser()
  return user && design.userId === user.id
}

function hasLiked(design) {
  const user = getCurrentUser()
  if (!user) return false
  return design.likes.includes(user.id)
}

async function likeDesign(design) {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Login required to like designs')
    return
  }

  const res = await fetch(
    `http://localhost:3000/designs/${design._id}/like`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  if (!res.ok) {
    return
  }

  // frontend state updaten
  design.likes.push('temp') // dummy push om UI te refreshen
}
    </script>