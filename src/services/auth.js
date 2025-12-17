const API_URL = 'https://lays-api-dh74.onrender.com/'

export async function register(firstname, lastname , email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstname, lastname, email, password })
  })

  if (!res.ok) {
    throw new Error('Register failed')
  }

  return await res.json()
  
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  if (!res.ok) {
    throw new Error('Login failed')
  }

  return await res.json()
}