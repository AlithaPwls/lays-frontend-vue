<template>
    <div class="auth-wrapper">
      <div class="auth-card">
        <h1>Welcome back</h1>
        <p class="auth-subtitle">
          Log in to save and manage your designs
        </p>
  
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
  
        <button class="primary" @click="login">
          Log in
        </button>
  
        <p v-if="error" class="auth-error">
          {{ error }}
        </p>
  
        <p class="auth-switch">
          Don’t have an account?
          <router-link to="/register">Create one</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const email = ref('')
  const password = ref('')
  const error = ref('')
  const router = useRouter()
  
  async function login() {
    try {
      const res = await fetch('https://lays-api-dh74.onrender.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.value,
          password: password.value
        })
      })
  
      const data = await res.json()
  
      if (!res.ok) {
        error.value = data.message
        return
      }
  
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
  
      router.push('/configurator')
    } catch (err) {
      error.value = 'Login failed'
    }
  }
  </script>