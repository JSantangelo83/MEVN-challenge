import { Sequelize } from "sequelize-typescript"

export const database = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST || "localhost",
    username: process.env.DB_USER || "root" ,
    password: process.env.DB_PASS || "" ,
    database: process.env.DB_NAME || "mevn_challenge",
    logging: false,
    models: [
        // 
    ]
})

async function connectDatabase() {
    try {
        await database.sync()
    } catch (error) {
        console.log(error)
    }
}

export default connectDatabase;