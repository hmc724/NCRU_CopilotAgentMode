import { useEffect, useState } from 'react'

const LEADERBOARD_ENDPOINT = '/api/leaderboard/'
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

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCollection(LEADERBOARD_ENDPOINT).then(setEntries).catch((requestError) => setError(requestError.message))
  }, [])

  return (
    <section>
      <div className="section-heading"><div><p className="eyebrow">Friendly competition</p><h1>Leaderboard</h1></div><span className="count-badge">{entries.length} ranked</span></div>
      {error && <p className="alert alert-danger">{error}</p>}
      <div className="leaderboard-list">
        {entries.map((entry, index) => <article className="data-card leaderboard-row" key={entry._id ?? entry.id}><strong className="rank">{entry.rank ?? index + 1}</strong><div className="flex-grow-1"><h2>{entry.user?.name ?? entry.user?.username ?? 'Unknown athlete'}</h2><p>Current standing</p></div><strong className="points">{entry.points ?? 0}<small> pts</small></strong></article>)}
      </div>
      {!error && entries.length === 0 && <p className="empty-state">No leaderboard entries yet.</p>}
    </section>
  )
}

export default Leaderboard
