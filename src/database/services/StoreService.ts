import { customerRepo } from '../../index.js'

import { initializeProducts } from '../../utils/initializeProducts.js'
import { connectToDatabase } from '../connection.js'
import { PremiumCustomer, RegularCustomer } from '../entity/Customer.js'

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
}

const storeService = new StoreService()

const initializeStore = async () => {
    try {
        await storeService.establishConnection()
        await storeService.fetchProducts()
        console.log(`The store is now open and ready for new orders!`)
    } catch (error) {
        console.error(error)
    }
}

const createUser = storeService.createUser

export { createUser, initializeStore }
