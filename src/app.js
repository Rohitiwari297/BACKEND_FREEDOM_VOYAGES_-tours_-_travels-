import express from 'express'
import morgan from 'morgan'
import globalErrorHandler from './middleware/errorMiddleware.js'
import connectDB from './Config/database.js'
import cookieParser from "cookie-parser";
import authRoute from "./modules/auth/auth.routes.js"
import userRoute from "./modules/user/user.routes.js"
import categoryRoute from './modules/category/category.routes.js'
import primaryRoute from './modules/primaryMenu/primaryMenu.routes.js';
import subCategoryRoute from './modules/sub-category/subcategory.routes.js';
import packagesRoute from './modules/trip_Package/package.routes.js';
import cors from 'cors'
import path from 'path'


const app = express()
connectDB();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}))

app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser());

// routes (example)
app.get('/', (req, res) => {
  res.send('Server running... ')
})

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/category', categoryRoute)
app.use('/api/primary-menu', primaryRoute)
app.use('/api/sub-category', subCategoryRoute)
app.use('/api/package', packagesRoute)
app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

// ALWAYS BE THE LAST
app.use(globalErrorHandler)

export default app

