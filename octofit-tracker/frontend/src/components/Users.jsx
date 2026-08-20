import { useEffect, useState } from 'react'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const API_BASE_URL = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000'

function Users() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadUsers() {
      try {
        let response

        if (codespaceName) {
          response = await fetch(`https://${codespaceName}-8000.app.github.dev/api/users/`)
          if (!response.ok) {
            throw new Error(`Unable to load https://${codespaceName}-8000.app.github.dev/api/users/ (${response.status})`)
          }
        }
        else {
          response = await fetch(`${API_BASE_URL}/api/users/`)
          if (!response.ok) {
            throw new Error(`Unable to load ${API_BASE_URL}/api/users/ (${response.status})`)
          }
        }

        const payload = await response.json()
        let collection = []

        if (Array.isArray(payload)) collection = payload
        else if (Array.isArray(payload?.data)) collection = payload.data
        else if (Array.isArray(payload?.results)) collection = payload.results
        else if (Array.isArray(payload?.items)) collection = payload.items
        else if (payload?.data && typeof payload.data === 'object') {
          if (Array.isArray(payload.data.data)) collection = payload.data.data
          else if (Array.isArray(payload.data.results)) collection = payload.data.results
          else if (Array.isArray(payload.data.items)) collection = payload.data.items
        }

        setUsers(collection)
      } catch (requestError) {
        setError(requestError.message)
      }
    }

    loadUsers()
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
