import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

const ACTIVITIES_ENDPOINT = '/api/activities/'

function Activities() {
  const [activities, setActivities] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCollection(ACTIVITIES_ENDPOINT).then(setActivities).catch((requestError) => setError(requestError.message))
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
