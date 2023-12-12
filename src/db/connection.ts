import { Sequelize } from "sequelize-typescript"
import User from "../models/user.model";

export const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST || "localhost",
    username: process.env.DB_USER || "root" ,
    password: process.env.DB_PASS || "" ,
    database: process.env.DB_NAME || "mevn_challenge",
    logging: false,
    models: [
        User
    ]
})

export async function connectDatabase() {
    const maxRetries = 10;
    const retryInterval = 5000; // 5 seconds

    for (let i = 0; i < maxRetries; i++) {
        try {
            await sequelize.sync()

            // Create an initial admin user if it doesn't exist
            const [adminUser, created] = await User.findOrCreate({
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
            console.log(`Attempt ${i + 1} failed. Retrying in ${retryInterval / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryInterval));
        }
    }

    console.log('Failed to connect to the database after ' + maxRetries + ' attempts.');
}

export default connectDatabase;