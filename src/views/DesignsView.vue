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
          <div
            class="color-preview"
            :style="{ backgroundColor: design.color }"
          ></div>
  
          <h3
            class="design-title"
            :style="{ fontFamily: design.font }"
          >
            {{ design.title }}
          </h3>
  
          <p class="design-font">
            {{ design.font }}
          </p>
        </div>
      </div>
    </div>
  </template>