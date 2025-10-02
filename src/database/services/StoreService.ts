import { customerRepo } from '../../index.js'

import { initializeProducts } from '../../utils/initializeProducts.js'
import { connectToDatabase } from '../connection.js'
import {
    Customer,
    PremiumCustomer,
    RegularCustomer,
} from '../entity/Customer.js'
import { Product } from '../entity/Product.js'

class StoreService {
    async establishConnection() {
        await connectToDatabase()
    }
    async fetchProducts() {
        await initializeProducts()
    }

    async createUser(
        name: string,
        email: string,
        balance: number,
        isPremiumMember: boolean,
    ) {
        const newUser = isPremiumMember
            ? new PremiumCustomer(name, email, balance)
            : new RegularCustomer(name, email, balance)
        try {
            await customerRepo.save(newUser)
            console.log(
                `A new customer with username '${name}' and email ${email} has been created`,
            )
            return newUser
        } catch (error) {
            console.error(
                `An error occurred during customer creation: ${error}`,
            )
        }
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
