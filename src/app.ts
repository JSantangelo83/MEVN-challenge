import express, { json, urlencoded } from "express"
import morgan from "morgan"
import cors from "cors"
import connectDatabase from "./config/database"

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

// Routes 

// Is alive route
app.get("/ping", (req, res) => {
    res.send("pong")
})

// Users routes

export default app