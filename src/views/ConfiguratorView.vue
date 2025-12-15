<template>
    <div>
      <h1>Lays Chips Configurator</h1>
  
      <ColorPicker
        :colors="colors"
        @select="selectedColor = $event"
      />
  
      <p v-if="selectedColor">
        Selected color: {{ selectedColor.name }}
      </p>
  
      <FontPicker
        :fonts="fonts"
        @select="selectedFont = $event"
      />
  
      <p v-if="selectedFont">
        Selected font: {{ selectedFont.name }}
      </p>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { getColors, getFonts } from '../services/api'

import ColorPicker from '../components/ColorPicker.vue'
import FontPicker from '../components/FontPicker.vue'

const colors = ref([])
const fonts = ref([])

const selectedColor = ref(null)
const selectedFont = ref(null)

onMounted(async () => {
  colors.value = await getColors()
  fonts.value = await getFonts()
})
  </script>