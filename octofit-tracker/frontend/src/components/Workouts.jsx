import { useEffect, useState } from 'react'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const API_BASE_URL = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadWorkouts() {
      try {
        let response

        if (codespaceName) {
          response = await fetch(`https://${codespaceName}-8000.app.github.dev/api/workouts/`)
          if (!response.ok) {
            throw new Error(`Unable to load https://${codespaceName}-8000.app.github.dev/api/workouts/ (${response.status})`)
          }
        }
        else {
          response = await fetch(`${API_BASE_URL}/api/workouts/`)
          if (!response.ok) {
            throw new Error(`Unable to load ${API_BASE_URL}/api/workouts/ (${response.status})`)
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

        setWorkouts(collection)
      } catch (requestError) {
        setError(requestError.message)
      }
    }

    loadWorkouts()
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
