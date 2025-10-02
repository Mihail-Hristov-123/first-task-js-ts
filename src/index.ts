import { orderRepo, productRepo } from './database/connection.js'
import { Customer } from './database/entity/customer.entity.js'
import type { Order } from './database/entity/order.entity.js'
import { Product } from './database/entity/product.entity.js'
import { getSummary } from './database/services/customer.order.service.js'

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

const store = Store.instance

await store.openStore()

const testUser = await store.addNewCustomer(
    'Michael',
    'misho@gsmsasisl.cosm',
    2000,
    false,
)
const prodOne = await productRepo.findOneBy({ id: 1 })
const prodTwo = await productRepo.findOneBy({ id: 2 })
await store.addProductToCart(prodOne!, testUser!)
await store.addProductToCart(prodTwo!, testUser!)

await store.placeOrder(testUser!)
const order = await orderRepo.findOne({
    where: { id: 1 },
    relations: ['owner', 'products'],
})
console.log(getSummary(order!))
await store.payAllUserOrders(testUser!)
