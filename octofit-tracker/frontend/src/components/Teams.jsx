import { useEffect, useState } from 'react'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const API_BASE_URL = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000'

function Teams() {
  const [teams, setTeams] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTeams() {
      try {
        let response

        if (codespaceName) {
          response = await fetch(`https://${codespaceName}-8000.app.github.dev/api/teams/`)
          if (!response.ok) {
            throw new Error(`Unable to load https://${codespaceName}-8000.app.github.dev/api/teams/ (${response.status})`)
          }
        }
        else {
          response = await fetch(`${API_BASE_URL}/api/teams/`)
          if (!response.ok) {
            throw new Error(`Unable to load ${API_BASE_URL}/api/teams/ (${response.status})`)
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

        setTeams(collection)
      } catch (requestError) {
        setError(requestError.message)
      }
    }

    loadTeams()
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
