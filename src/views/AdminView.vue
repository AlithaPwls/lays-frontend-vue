<template>
  <div class="admin-page">
    <h1>Admin panel</h1>

    <p v-if="loading">Loading users…</p>

    <table v-else class="users-table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Role</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>{{ user.email }}</td>
          <td>{{ user.firstname }} {{ user.lastname }}</td>
          <td>
            <span v-if="user.isAdmin">ADMIN</span>
            <span v-else>USER</span>
          </td>
          <td>
            <button
              v-if="!user.isAdmin"
              @click="deleteUser(user._id)"
              class="delete-btn"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const users = ref([])
const loading = ref(true)
const router = useRouter()

const API_URL = 'https://lays-api-dh74.onrender.com'

function getCurrentUser() {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

onMounted(async () => {
  const token = localStorage.getItem('token')
  const currentUser = getCurrentUser()

  // 🔐 extra veiligheid
  if (!token || !currentUser?.isAdmin) {
    router.push('/designs')
    return
  }

  try {
    const res = await fetch(`${API_URL}/auth/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    users.value = await res.json()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

async function deleteUser(userId) {
  const token = localStorage.getItem('token')
  if (!token) return

  const confirmed = confirm('Delete this user?')
  if (!confirmed) return

  const res = await fetch(
    `${API_URL}/auth/users/${userId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  if (!res.ok) {
    alert('Delete failed')
    return
  }

  users.value = users.value.filter(u => u._id !== userId)
}
</script>

<style scoped>
.admin-page {
  padding: 40px;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.users-table th,
.users-table td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.delete-btn {
  background: #e53935;
  color: white;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
}
</style>