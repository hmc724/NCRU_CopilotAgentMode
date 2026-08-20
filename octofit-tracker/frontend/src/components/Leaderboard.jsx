import { useEffect, useState } from 'react'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const API_BASE_URL = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        let response

        if (codespaceName) {
          response = await fetch(`https://${codespaceName}-8000.app.github.dev/api/leaderboard/`)
          if (!response.ok) {
            throw new Error(`Unable to load https://${codespaceName}-8000.app.github.dev/api/leaderboard/ (${response.status})`)
          }
        }
        else {
          response = await fetch(`${API_BASE_URL}/api/leaderboard/`)
          if (!response.ok) {
            throw new Error(`Unable to load ${API_BASE_URL}/api/leaderboard/ (${response.status})`)
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

        setEntries(collection)
      } catch (requestError) {
        setError(requestError.message)
      }
    }

    loadLeaderboard()
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
