const API_URL = 'http://localhost:3000'

export async function getColors() {
  const response = await fetch(`${API_URL}/colors`)
  return response.json()
}

export async function getFonts() {
  const response = await fetch(`${API_URL}/fonts`)
  return response.json()
}