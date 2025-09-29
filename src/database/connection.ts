import 'dotenv/config'
import { DataSource } from 'typeorm'

const DB_CONNECTION_STRING = process.env.DB_PASS

if (!DB_CONNECTION_STRING) {
    throw new Error('Env credentials missing')
}

const AppDataSource = new DataSource({
    type: 'postgres',
    url: DB_CONNECTION_STRING,
    ssl: true,
    synchronize: true,
    logging: true,
    entities: [],
})

export const connectToDatabase = async () => {
    try {
        await AppDataSource.initialize()
        console.log(`Successfully connected to DB`)
    } catch (error) {
        console.error(`Failed to connect to the database: ${error}`)
    }
}
