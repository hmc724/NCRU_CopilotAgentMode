import { useEffect, useState } from 'react'

const USERS_ENDPOINT = '/api/users/'
const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const API_BASE_URL = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000'

function collectionFromResponse(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.items)) return payload.items
  if (payload?.data && typeof payload.data === 'object') return collectionFromResponse(payload.data)
  return []
}

async function fetchCollection(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`)
  if (!response.ok) {
    throw new Error(`Unable to load ${endpoint} (${response.status})`)
  }
  return collectionFromResponse(await response.json())
}

function Users() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCollection(USERS_ENDPOINT).then(setUsers).catch((requestError) => setError(requestError.message))
  }, [])

  return (
    <section>
      <div className="section-heading">
        <div><p className="eyebrow">Community</p><h1>Users</h1></div>
        <span className="count-badge">{users.length} athletes</span>
      </div>
      {error && <p className="alert alert-danger">{error}</p>}
      <div className="row g-3">
        {users.map((user) => (
          <div className="col-md-6" key={user._id ?? user.id ?? user.username}>
            <article className="data-card h-100"><span className="avatar">{user.name?.charAt(0) ?? '?'}</span><div><h2>{user.name ?? user.username}</h2><p>@{user.username} · {user.email}</p></div></article>
          </div>
        ))}
      </div>
      {!error && users.length === 0 && <p className="empty-state">No users found yet.</p>}
    </section>
  )
}

export default Users
