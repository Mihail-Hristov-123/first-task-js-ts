import 'dotenv/config'
import { DataSource } from 'typeorm'
import { Order } from './entity/Order.js'
import { Customer } from './entity/Customer.js'
import { Product } from './entity/Product.js'

const DB_CONNECTION_STRING = process.env.DB_PASS

if (!DB_CONNECTION_STRING) {
    throw new Error('Env credentials missing')
}

const AppDataSource = new DataSource({
    type: 'postgres',
    url: DB_CONNECTION_STRING,
    ssl: true,
    synchronize: true,
    entities: [Product, Customer, Order],
})

const customerRepo = AppDataSource.getRepository(Customer)
const productRepo = AppDataSource.getRepository(Product)
const orderRepo = AppDataSource.getRepository(Order)

const connectToDatabase = async () => {
    try {
        await AppDataSource.initialize()
        console.log(`Successfully connected to DB`)
    } catch (error) {
        throw new Error(`Failed to connect to the database: ${error}`)
    }
}

export { customerRepo, productRepo, orderRepo, connectToDatabase }
