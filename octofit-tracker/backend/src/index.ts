import express from 'express'

const app = express()
const port = Number(process.env.PORT ?? 8000)

app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({
    service: 'octofit-tracker-backend',
    status: 'ok',
    mongodb: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/octofit_db',
  })
})

app.listen(port, () => {
  console.log(`OctoFit API listening on http://localhost:${port}`)
})