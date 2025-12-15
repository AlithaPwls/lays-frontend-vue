<template>
    <div>
            <h1>Lays Chips Configurator</h1>
        
            <ColorPicker
                :colors="colors"
                @select="config.color = $event"
            />
        
            <p v-if="config.color">
                Selected color: {{ config.color.name }}
            </p>
        
            <FontPicker
                :fonts="fonts"
                @select="config.font = $event"
            />
        
            <p v-if="config.font">
                Selected font: {{ config.font.name }}
            </p>

            <h3>Title</h3>

            <input
            type="text"
            placeholder="Type your flavor name"
            v-model="config.title"
            />

            <p v-if="config.title">
            Title: {{ config.title }}
            </p>

            <hr />

            <h3>Current config (debug)</h3>
            <pre>{{ config }}</pre>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { getColors, getFonts } from '../services/api'

import ColorPicker from '../components/ColorPicker.vue'
import FontPicker from '../components/FontPicker.vue'

const colors = ref([])
const fonts = ref([])

const config = ref({
  color: null,
  font: null,
  title: ''
})

onMounted(async () => {
  colors.value = await getColors()
  fonts.value = await getFonts()
})
  </script>