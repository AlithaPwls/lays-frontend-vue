<template>
    <div>
      <h3>Choose a font</h3>
  
      <ul>
        <li
          v-for="font in fonts"
          :key="font._id"
          @click="selectFont(font)"
          :style="{ cursor: 'pointer' }"
        >
          {{ font.name }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    fonts: Array
  })
  
  const emit = defineEmits(['select'])
  
  function selectFont(font) {
    emit('select', font)
  }
  </script>