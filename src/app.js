import express from 'express'
import morgan from 'morgan'
import globalErrorHandler from './middleware/errorMiddleware.js'

const app = express()

app.use(express.json()) 
app.use(morgan('dev'))

// routes (example)
app.get('/', (req, res) => {
  res.send('Server running ')
})

// ALWAYS BE THE LAST
app.use(globalErrorHandler)

export default app

