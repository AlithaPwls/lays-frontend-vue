<template>
    <div>
      <h1>Saved designs</h1>
  
      <router-link to="/">← Back</router-link>
  
      <div v-for="design in designs" :key="design._id">
        {{ design.title }} – {{ design.font.name }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const designs = ref([])
  
  onMounted(async () => {
    const res = await fetch('http://localhost:3000/designs')
    designs.value = await res.json()
  })
  </script>