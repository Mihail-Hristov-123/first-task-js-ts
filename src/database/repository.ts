import { AppDataSource } from './connection.js'
import { Customer, Product } from './entity/index.js'

const product = AppDataSource.getRepository(Product)
const customer = AppDataSource.getRepository(Customer)
export const repository = { product, customer }
