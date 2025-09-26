import 'dotenv/config'
import { DataSource } from 'typeorm'

const dbConnectionString = process.env.DB_PASS

if (!dbConnectionString) {
    throw new Error('Env credentials missing')
}

const AppDataSource = new DataSource({
    type: 'postgres',
    url: dbConnectionString,
    ssl: true,
    entities: [
        /*list of entities*/
    ],
})

export const connectToDatabase = async () => {
    try {
        await AppDataSource.initialize()
        console.log('COnnected')
    } catch (error) {
        console.log(error)
    }
}

// to be continued
