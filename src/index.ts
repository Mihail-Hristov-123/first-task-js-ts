import { Customer } from './database/entity/customer.entity.js'
import { Product } from './database/entity/product.entity.js'

import {
    createUser,
    initializeStore,
} from './database/services/store.service.js'
import { fetchInstance, type FetchableEntities } from './utils/fetchInstance.js'

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

    // returns a single entity if it is found - not type safe yet
    async find(query: FetchableEntities, id: number) {
        return await fetchInstance(query, id)
    }
}
