import { AppDataSource, connectToDatabase } from './database/connection.js'
import { Customer } from './database/entity/Customer.js'
import { Order } from './database/entity/Order.js'
import { Product } from './database/entity/Product.js'

import {
    createUser,
    initializeStore,
} from './database/services/StoreService.js'

const customerRepo = AppDataSource.getRepository(Customer)
const productRepo = AppDataSource.getRepository(Product)
const orderRepo = AppDataSource.getRepository(Order)

class Store {
    static #instance: Store

    private constructor() {}

    static get instance() {
        if (!Store.#instance) {
            Store.#instance = new Store()
        }
        return Store.#instance
    }

    // Connects to DB, fetches and inserts products from provided API
    async openStore() {
        await initializeStore()
    }

    async addNewCustomer(
        name: string,
        email: string,
        balance: number,
        isPremiumMember: boolean,
    ) {
        await createUser(name, email, balance, isPremiumMember)
    }

    async addProductToCart(product: Product, customer: Customer) {
        await customer.modifyCart('addToCart', product)
    }

    async removeProductFromCart(product: Product, customer: Customer) {
        await customer.modifyCart('removeFromCart', product)
    }

    async placeOrder(customer: Customer) {
        await customer.modifyOrder('placeOrder')
    }

    async payAllUserOrders(customer: Customer) {
        await customer.modifyOrder('payAllOrders')
    }
}

const store = Store.instance
await store.openStore()

export { customerRepo, productRepo, orderRepo }
