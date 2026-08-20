import express from 'express'
import { connectDatabase } from './config/database.js'
import { Activity, Leaderboard, Team, User, Workout } from './models.js'

const app = express()
const port = 8000
const baseUrl = process.env.CODESPACE_NAME ? `https://${process.env.CODESPACE_NAME}-8000.app.github.dev` : 'http://localhost:8000'

app.use(express.json())

app.get('/api/users', async (_request, response) => {
  response.json(await User.find())
})

app.get('/api/teams/', async (_request, response) => {
  response.json(await Team.find().populate('members'))
})

app.get('/api/activities', async (_request, response) => {
  response.json(await Activity.find().populate('user'))
})

app.get('/api/leaderboard/', async (_request, response) => {
  response.json(await Leaderboard.find().sort({ rank: 1 }).populate('user'))
})

app.get('/api/workouts/', async (_request, response) => {
  response.json(await Workout.find())
})

app.get('/api/health', (_request, response) => {
  response.json({
    service: 'octofit-tracker-backend',
    status: 'ok',
    mongodb: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/octofit_db',
  })
})

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`OctoFit API listening on ${baseUrl}`)
    })
  })
  .catch((error) => {
    console.error('Unable to start OctoFit API:', error)
    process.exit(1)
  })