import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCollection('workouts').then(setWorkouts).catch((requestError) => setError(requestError.message))
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
