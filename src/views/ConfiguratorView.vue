<template>
    <div>
      <router-link to="/designs">View all designs</router-link>
  
      <h1>Lays Chips Configurator</h1>
  
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
  
      <div v-if="currentStep === 1" class="step">
        <h2>Choose a color</h2>
        <input type="color" v-model="config.color" />
        <button :disabled="!config.color" @click="nextStep">Next</button>
      </div>
  
      <div v-if="currentStep === 2" class="step">
        <h2>Name your flavor</h2>
        <input type="text" v-model="config.title" />
        <div class="nav">
          <button @click="prevStep">Back</button>
          <button @click="resetConfigurator">Start over</button>
          <button :disabled="!config.title" @click="nextStep">Next</button>
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
          <button @click="prevStep">Back</button>
          <button @click="resetConfigurator">Start over</button>
          <button :disabled="!config.font" @click="nextStep">Next</button>
        </div>
      </div>
  
      <div v-if="currentStep === 4" class="step">
        <h2>Your design</h2>
        <p><strong>Color:</strong> {{ config.color }}</p>
        <p><strong>Title:</strong> {{ config.title }}</p>
        <p><strong>Font:</strong> {{ config.font.name }}</p>
        <div class="nav">
          <button @click="prevStep">Back</button>
          <button @click="resetConfigurator">Start over</button>
          <button @click="saveDesign">Save design</button>
        </div>
      </div>
  
      <h3>3D Preview</h3>
  
      <iframe
        ref="threeFrame"
        src="http://localhost:5174"
        style="width: 100%; height: 400px; border: none;"
        @load="iframeReady = true"
      ></iframe>

      <div v-if="showAuthModal" class="auth-modal-overlay">
  <div class="auth-modal">
    <h2>Login required</h2>
    <p>To save your design, please log in or register.</p>

    <div class="auth-actions">
      <router-link to="/login" class="btn primary">
        Login
      </router-link>

      <router-link to="/register" class="btn secondary">
        Register
      </router-link>
    </div>

    <button class="close" @click="showAuthModal = false">
      Cancel
    </button>
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
    console.log("saved")
    if (event.data?.type !== 'SCREENSHOT_RESULT') return
    if (!pendingSave.value) return
  
    pendingSave.value = false
    screenshot.value = event.data.image
  
    const payload = {
      title: config.value.title,
      color: config.value.color,
      font: config.value.font.name,
      image: screenshot.value
    }
  
    const res = await fetch('http://localhost:3000/designs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  
    await res.json()
    window.alert('Design saved!')
    window.location.href = '/designs';
  })
  
  onMounted(async () => {
    fonts.value = await getFonts()
  })
  </script>