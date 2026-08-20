import { useEffect, useState } from 'react'


const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const API_BASE_URL = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000'

function Activities() {
  const [activities, setActivities] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadActivities() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/activities/`)
        if (!response.ok) {
          throw new Error(`Unable to load /api/activities/ (${response.status})`)
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

        setActivities(collection)
      } catch (requestError) {
        setError(requestError.message)
      }
    }

    loadActivities()
  }, [])

  return (
    <section>
      <div className="section-heading"><div><p className="eyebrow">Move well</p><h1>Activities</h1></div><span className="count-badge">{activities.length} logged</span></div>
      {error && <p className="alert alert-danger">{error}</p>}
      <div className="table-responsive data-card p-0">
        <table className="table align-middle mb-0"><thead><tr><th>Athlete</th><th>Activity</th><th>Duration</th><th>Completed</th></tr></thead><tbody>
          {activities.map((activity) => <tr key={activity._id ?? activity.id}><td>{activity.user?.name ?? activity.user?.username ?? 'Unknown athlete'}</td><td><span className="activity-type">{activity.type}</span></td><td>{activity.durationMinutes} min</td><td>{activity.completedAt ? new Date(activity.completedAt).toLocaleDateString() : 'Not recorded'}</td></tr>)}
        </tbody></table>
      </div>
      {!error && activities.length === 0 && <p className="empty-state">No activities found yet.</p>}
    </section>
  )
}

export default Activities
