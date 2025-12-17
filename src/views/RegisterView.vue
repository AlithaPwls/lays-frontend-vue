<template>
    <div class="auth-wrapper">
      <div class="auth-card">
        <h1>Create account</h1>
        <p class="auth-subtitle">
          Create an account to save your designs
        </p>

        <input type="text" placeholder="First name" v-model="firstname">
        <input type="text" placeholder="Last name" v-model="lastname">
  
        <input
          type="email"
          placeholder="Email address"
          v-model="email"
        />
  
        <input
          type="password"
          placeholder="Password"
          v-model="password"
        />
  
        <button class="primary" @click="handleRegister">
          Create account
        </button>
  
        <p class="auth-switch">
          Already have an account?
          <router-link to="/login">Log in</router-link>
        </p>
      </div>
    </div>
  </template>


  <script setup>
  import { ref } from 'vue'
  import { register } from '../services/auth'
  import { useRouter } from 'vue-router'
  
  const firstname = ref('')
  const lastname = ref('')
  const email = ref('')
  const password = ref('')

  const router = useRouter()
  
  async function handleRegister() {
  try {
    await register(firstname.value, lastname.value, email.value, password.value)
    router.push('/login')
  } catch (err) {
    alert('Register failed')
  }
}
  </script>