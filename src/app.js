import express from 'express'
import morgan from 'morgan'
import globalErrorHandler from './middleware/errorMiddleware.js'
import connectDB from './Config/database.js'
import cookieParser from "cookie-parser";
import authRoute from "./modules/auth/auth.routes.js"
import userRoute from "./modules/user/user.routes.js"
import categoryRoute from './modules/category/category.routes.js'


const app = express()
connectDB();

app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser());

// routes (example)
app.get('/', (req, res) => {
  res.send('Server running ')
})

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/category', categoryRoute)

// ALWAYS BE THE LAST
app.use(globalErrorHandler)

export default app

