import express, { json, urlencoded } from "express"
import morgan from "morgan"
import cors from "cors"
import connectDatabase from "./db/connection"
// Importing Routes
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"

const app = express()

// Config
app.set("port", process.env.PORT || 3000)

// Middlewares
app.use(morgan("dev"))
app.use(cors())
app.use(urlencoded({ extended: false }))
app.use(json())

// Database connection
connectDatabase()

// Is alive route
app.get("/ping", (req, res) => {
    res.send("pong")
})

// Routes
app.use("/auth", authRoutes)
app.use("/users", userRoutes)

export default app