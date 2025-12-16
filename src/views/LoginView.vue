<template>
    <div>
      <h1>Login</h1>
  
      <input
        type="email"
        placeholder="Email"
        v-model="email"
      />
  
      <input
        type="password"
        placeholder="Password"
        v-model="password"
      />
  
      <button @click="login">Login</button>
  
      <p v-if="error">{{ error }}</p>
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
      const res = await fetch('http://localhost:3000/auth/login', {
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
  
      router.push('/')
    } catch (err) {
      error.value = 'Login failed'
    }
  }
  </script>