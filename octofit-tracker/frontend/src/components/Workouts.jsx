import { useEffect, useState } from 'react'

const WORKOUTS_ENDPOINT = '/api/workouts/'
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

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCollection(WORKOUTS_ENDPOINT).then(setWorkouts).catch((requestError) => setError(requestError.message))
  }, [])

  return (
    <section>
      <div className="section-heading"><div><p className="eyebrow">Your next session</p><h1>Workouts</h1></div><span className="count-badge">{workouts.length} plans</span></div>
      {error && <p className="alert alert-danger">{error}</p>}
      <div className="row g-3">
        {workouts.map((workout) => <div className="col-lg-6" key={workout._id ?? workout.id ?? workout.name}><article className="data-card h-100"><div className="d-flex justify-content-between gap-3"><h2>{workout.name}</h2><span className="difficulty">{workout.difficulty}</span></div><p className="workout-meta">{workout.durationMinutes} minutes · {workout.exercises?.length ?? 0} exercises</p><ul className="exercise-list">{workout.exercises?.map((exercise) => <li key={exercise}>{exercise}</li>)}</ul></article></div>)}
      </div>
      {!error && workouts.length === 0 && <p className="empty-state">No workouts found yet.</p>}
    </section>
  )
}

export default Workouts
