import { AppDataSource } from './connection.js'
import { Product } from './entity/Product.js'

export const productRepo = AppDataSource.getRepository(Product)
