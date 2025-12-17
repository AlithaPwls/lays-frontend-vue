<template>
    <div class="fullconfig">
  
      <!-- HEADER -->
      <header class="config-header">
        <router-link to="/designs" class="top-link">
          View all designs
        </router-link>
  
        <h1 class="config-title">Lays Chips Configurator</h1>
      </header>
  
      <!-- PROGRESS (LOS) -->
      <div class="progress-wrapper">
        <div class="progress">
          <div
            v-for="step in 4"
            :key="step"
            class="progress-step"
            :class="{ active: currentStep >= step }"
          >
            {{ step }}
          </div>
        </div>
      </div>
  
      <!-- MAIN CONTENT -->
      <div class="config-content">
  
        <!-- LEFT -->
        <div class="preview-column">
          <iframe
            ref="threeFrame"
            src="https://lays-configurator-tjs.vercel.app/"
            class="preview-iframe"
            @load="iframeReady = true"
          ></iframe>
        </div>
  
        <!-- RIGHT -->
        <div class="inputs-column">
  
          <div v-if="currentStep === 1" class="step">
            <h2>Choose a color</h2>
            <input type="color" v-model="config.color" />
            <button :disabled="!config.color" @click="nextStep">
              Next
            </button>
          </div>
  
          <div v-if="currentStep === 2" class="step">
            <h2>Name your Title</h2>
            <input type="text" v-model="config.title" />
  

            <h2>Name your flavor</h2>
            <input type="text" v-model="config.flavor" />

           
            <div class="nav">
              <button @click="prevStep">← Back</button>
              <button :disabled="!config.title" @click="nextStep">Next →</button>
              <button @click="resetConfigurator">Reset ↺</button>
            </div>
          </div>
  
          <div v-if="currentStep === 3" class="step">
            <h2>Pick a font</h2>
  
            <div class="fonts">
              <button
                v-for="font in fonts"
                :key="font._id"
                @click="config.font = font"
                :style="{ fontFamily: font.name }"
                :class="{ active: config.font === font }"
              >
                {{ font.name }}
              </button>
            </div>
  
            <div class="nav">
              <button @click="prevStep">← Back</button>
              <button :disabled="!config.title" @click="nextStep">Next →</button>
              <button @click="resetConfigurator">Reset ↺</button>
            </div>
          </div>
  
          <div v-if="currentStep === 4" class="step">
            <h2>Your design</h2>
  
            <p><strong>Color:</strong> {{ config.color }}</p>
            <p><strong>Title:</strong> {{ config.title }}</p>
            <p><strong>Font:</strong> {{ config.font.name }}</p>
  
            <div class="nav">
                <button @click="prevStep">← Back</button>
                <button @click="resetConfigurator">Reset ↺</button>
              <button @click="saveDesign">Save design ✓</button>
            </div>
          </div>
  
        </div>
      </div>
  
    </div>
  </template>


  <script setup>
  import { ref, watch, onMounted } from 'vue'
  import { getFonts } from '../services/api'


  const showAuthModal = ref(false)
  const currentStep = ref(1)
  const fonts = ref([])
  const threeFrame = ref(null)
  const iframeReady = ref(false)
  const screenshot = ref(null)
  const pendingSave = ref(false)
  
  const config = ref({
    color: null,
    title: '',
    flavor: '',
    font: null
  })
  
  function nextStep() {
    if (currentStep.value < 4) currentStep.value++
  }
  
  function prevStep() {
    if (currentStep.value > 1) currentStep.value--
  }
  
  function resetConfigurator() {
    currentStep.value = 1
    config.value = { color: null, title: '', font: null }
    screenshot.value = null
    pendingSave.value = false
  
    if (threeFrame.value) {
      threeFrame.value.contentWindow.postMessage({ type: 'RESET' }, '*')
    }
  }
  
  watch(
    () => config.value.color,
    (val) => {
      if (iframeReady.value && val) {
        threeFrame.value.contentWindow.postMessage(
          { type: 'SET_COLOR', color: val },
          '*'
        )
      }
    }
  )
  
  watch(
    () => config.value.title,
    (val) => {
      if (iframeReady.value && val) {
        threeFrame.value.contentWindow.postMessage(
          { type: 'SET_TITLE', title: val },
          '*'
        )
      }
    }
  )

  watch(
  () => config.value.flavor,
  (val) => {
    if (iframeReady.value && val) {
      threeFrame.value.contentWindow.postMessage(
        { type: 'SET_FLAVOR', flavor: val },
        '*'
      )
    }
  }
)
  
  watch(
    () => config.value.font,
    (val) => {
      if (iframeReady.value && val) {
        threeFrame.value.contentWindow.postMessage(
          { type: 'SET_FONT', font: val.name },
          '*'
        )
      }
    }
  )
  
  function saveDesign() {
  const token = localStorage.getItem('token')

  if (!token) {
    showAuthModal.value = true
    return
  }

  if (!iframeReady.value || !threeFrame.value) return

  pendingSave.value = true
  screenshot.value = null

  threeFrame.value.contentWindow.postMessage(
    { type: 'GET_SCREENSHOT' },
    '*'
  )
}
  
window.addEventListener('message', async (event) => {
  if (event.data?.type !== 'SCREENSHOT_RESULT') return
  if (!pendingSave.value) return

  pendingSave.value = false
  screenshot.value = event.data.image

  const token = localStorage.getItem('token')

  const payload = {
  title: config.value.title,
  flavor: config.value.flavor,
  color: config.value.color,
  font: config.value.font.name,
  image: screenshot.value
}

  const res = await fetch('https://lays-api-dh74.onrender.com/designs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
  const errorText = await res.text()
  console.error('SAVE FAILED:', res.status, errorText)
  alert(`Saving failed. Please login or register to save your design. (${res.status})`)
  window.location.href = '/login'
  return
}

  await res.json()
  alert('Design saved!')
  window.location.href = '/designs'
})
  
  onMounted(async () => {
    fonts.value = await getFonts()
  })
  </script>