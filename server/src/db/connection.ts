import { Sequelize } from "sequelize-typescript"
import User from "../models/user.model";

export const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST || "localhost",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "mevn_challenge",
    logging: false,
    models: [
        User
    ]
})

export async function connectDatabase() {
    try {
        await sequelize.sync()

        // Create an initial admin user if it doesn't exist
        await User.findOrCreate({
            where: { username: 'admin' },
            defaults: {
                username: 'admin',
                password: '$2b$10$So7IZIhOQPvh5yiyglKe2.gBXD2w5G8nYVuzbtVHRbslCqm5O6mCi',
                isAdmin: true
            } as User
        });

        console.log('Database connected successfully')
        return;
    } catch (error) {
        console.log(`Database connection error: ${error}`)
    }
}

export default connectDatabase;