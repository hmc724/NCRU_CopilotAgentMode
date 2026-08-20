import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

function Users() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCollection('/api/users/').then(setUsers).catch((requestError) => setError(requestError.message))
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
