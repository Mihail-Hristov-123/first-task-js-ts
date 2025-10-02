import { initializeProducts } from '../../utils/initializeProducts.js'
import { connectToDatabase, customerRepo } from '../connection.js'
import { PremiumCustomer, RegularCustomer } from '../entity/Customer.js'

class StoreService {
    async initializeStore() {
        try {
            await connectToDatabase()
            await initializeProducts()
            console.log(`The store is now open and ready for new orders!`)
        } catch (error) {
            console.error(error)
        }
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

export const { initializeStore, createUser } = storeService
