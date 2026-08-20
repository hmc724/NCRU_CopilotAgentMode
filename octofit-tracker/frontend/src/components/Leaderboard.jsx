import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCollection('leaderboard').then(setEntries).catch((requestError) => setError(requestError.message))
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
