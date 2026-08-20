import { useEffect, useState } from 'react'

const TEAMS_ENDPOINT = '/api/teams/'
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

function Teams() {
  const [teams, setTeams] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCollection(TEAMS_ENDPOINT).then(setTeams).catch((requestError) => setError(requestError.message))
  }, [])

  return (
    <section>
      <div className="section-heading"><div><p className="eyebrow">Train together</p><h1>Teams</h1></div><span className="count-badge">{teams.length} teams</span></div>
      {error && <p className="alert alert-danger">{error}</p>}
      <div className="row g-3">
        {teams.map((team) => <div className="col-md-6" key={team._id ?? team.id ?? team.name}><article className="data-card h-100"><div className="team-mark">{team.name?.charAt(0) ?? 'T'}</div><h2>{team.name}</h2><p>{team.members?.length ?? 0} members</p><div className="member-stack">{team.members?.slice(0, 5).map((member) => <span key={member._id ?? member.id} title={member.name}>{member.name?.charAt(0) ?? '?'}</span>)}</div></article></div>)}
      </div>
      {!error && teams.length === 0 && <p className="empty-state">No teams found yet.</p>}
    </section>
  )
}

export default Teams
