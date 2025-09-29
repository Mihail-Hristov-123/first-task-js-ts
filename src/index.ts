import { connectToDatabase } from './database/connection.js'
import { fetchProducts } from './database/population.js'

await connectToDatabase()

await fetchProducts()
