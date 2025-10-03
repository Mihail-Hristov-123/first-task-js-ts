import { connectToDatabase } from './database/connection.js'
import { Customer } from './database/entity/customer.entity.js'
import type { Order } from './database/entity/order.entity.js'
import { Product } from './database/entity/product.entity.js'
import { getSummary } from './database/services/customer.order.service.js'

import {
    createUser,
    initializeStore,
    searchOne,
} from './database/services/store.service.js'
import { playDemo } from './demo.js'
import type { EntityMap, FetchableEntities } from './types/service.types.js'

// Should be the only thing exposed
export class Store {
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
        const newUser = await createUser(name, email, balance, isPremiumMember)
        return newUser
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

    async findOne<T extends FetchableEntities>(
        query: T,
        id: number,
    ): Promise<EntityMap[T] | undefined> {
        return await searchOne(query, id)
    }

    getOrderSummary(order: Order) {
        if (!order.owner) {
            console.warn(
                'Please include the necessary owner relation before getting a order summary',
            )
            return
        }
        console.log(getSummary(order))
    }
}

// Welcome to the store - it is not open yet
const store = Store.instance

// Connects to the DB, and fetches and inserts the products from the provided API (if the products table is empty)
await store.openStore()

await playDemo(store)
