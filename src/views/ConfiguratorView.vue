<template>
    <div>
            <h1>Lays Chips Configurator</h1>
        
            <ColorPicker
            :colors="colors"
            @select="(color) => {
                config.color = color
                sendColorToThree(color)
            }"
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
            <hr />

        <h3>3D Preview</h3>

        <iframe
        ref="threeFrame"
        src="http://localhost:5174"
        style="width: 100%; height: 400px; border: none;"
        ></iframe>
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

const threeFrame = ref(null)

function sendColorToThree(color) {
  if (!threeFrame.value) return

  threeFrame.value.contentWindow.postMessage(
    {
      type: 'SET_COLOR',
      color: color.value
    },
    '*'
  )
}

onMounted(async () => {
  colors.value = await getColors()
  fonts.value = await getFonts()
})
  </script>