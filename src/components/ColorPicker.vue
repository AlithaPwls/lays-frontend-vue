<template>
    <div>
      <h3>Choose a color</h3>
  
      <ul>
        <li
          v-for="color in colors"
          :key="color._id"
          @click="selectColor(color)"
          :style="{ cursor: 'pointer' }"
        >
          {{ color.name }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    colors: Array
  })
  
  const emit = defineEmits(['select'])
  
  function selectColor(color) {
    emit('select', color)
  }
  </script>