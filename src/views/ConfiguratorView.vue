
  <template>
    <div>

        <router-link to="/designs">
    View all designs
  </router-link>
  
        
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
  
      <!-- STEP 1 -->
      <div v-if="currentStep === 1" class="step">
        <h2>Choose a color</h2>
  
        <input type="color" v-model="config.color" />
  
        <button
          class="next"
          :disabled="!config.color"
          @click="nextStep"
        >
          Next
        </button>
      </div>
  
      <!-- STEP 2 -->
      <div v-if="currentStep === 2" class="step">
        <h2>Name your flavor</h2>
  
        <input
          type="text"
          placeholder="e.g. Sweet Chili"
          v-model="config.title"
        />
  
        <div class="nav">
          <button @click="prevStep">Back</button>
          <button class="reset" @click="resetConfigurator">
            Start over
        </button>
          <button
            :disabled="!config.title"
            @click="nextStep"
          >
            Next
          </button>
        </div>
      </div>
  
      <!-- STEP 3 -->
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
          <button @click="prevStep">Back</button>        <button class="reset" @click="resetConfigurator">
            Start over
        </button>
          <button
            :disabled="!config.font"
            @click="nextStep"
          >
            Next
          </button>
        </div>
      </div>
  
      <!-- STEP 4 -->
      <div v-if="currentStep === 4" class="step">
        <h2>Your design</h2>
  
        <p><strong>Color:</strong> {{ config.color }}</p>
        <p><strong>Title:</strong> {{ config.title }}</p>
        <p><strong>Font:</strong> {{ config.font.name }}</p>
  
        <div class="nav">
        <button @click="prevStep">Back</button>

        <button class="reset" @click="resetConfigurator">
            Start over
        </button>

        <button class="save" @click="saveDesign">
            Save design
        </button>
        </div>
      </div>
  
      <!-- PREVIEW -->
      <h3>3D Preview</h3>
  
      <iframe
        ref="threeFrame"
        src="http://localhost:5174"
        style="width: 100%; height: 400px; border: none;"
      ></iframe>

      
    </div>
    
  </template>
  
  <script setup>
import { ref, watch, onMounted } from 'vue'
import { getColors, getFonts } from '../services/api'


const currentStep = ref(1)

function nextStep() {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function resetConfigurator() {
  // terug naar stap 1
  currentStep.value = 1

  // config resetten
  config.value = {
    color: null,
    title: '',
    font: null
  }

  // Three.js resetten
  if (threeFrame.value) {
    threeFrame.value.contentWindow.postMessage(
      { type: 'RESET' },
      '*'
    )
  }
}

const colors = ref([])
const fonts = ref([])

const config = ref({
  color: null,
  font: null,
  title: ''
})

const threeFrame = ref(null)

watch(
  () => config.value.color,
  (newColor) => {
    if (!threeFrame.value || !newColor) return

    threeFrame.value.contentWindow.postMessage(
      { type: 'SET_COLOR', color: newColor },
      '*'
    )
  }
)

watch(
  () => config.value.title,
  (newTitle) => {
    if (!threeFrame.value || !newTitle) return

    threeFrame.value.contentWindow.postMessage(
      { type: 'SET_TITLE', title: newTitle },
      '*'
    )
  }
)

watch(
  () => config.value.font,
  (newFont) => {
    if (!threeFrame.value || !newFont) return

    threeFrame.value.contentWindow.postMessage(
      { type: 'SET_FONT', font: newFont.name },
      '*'
    )
  }
)




async function saveDesign() {
  const payload = {
    title: config.value.title,
    color: typeof config.value.color === 'object'
      ? config.value.color.value
      : config.value.color,
    font: typeof config.value.font === 'object'
      ? config.value.font.name
      : config.value.font
  }

  console.log('SENDING TO API:', payload)

  const response = await fetch('http://localhost:3000/designs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const data = await response.json()
  console.log('Saved design:', data)
}

onMounted(async () => {
  colors.value = await getColors()
  fonts.value = await getFonts()
})
  </script>

