import { initializeProducts } from '../../utils/initializeProducts.js'
import { connectToDatabase, customerRepo, productRepo } from '../connection.js'
import { PremiumCustomer, RegularCustomer } from '../entity/customer.entity.js'

class StoreService {
    async initializeStore() {
        try {
            await connectToDatabase()
            const alreadyStocked = Boolean(await productRepo.count())
            if (!alreadyStocked) {
                await initializeProducts()
            }
            console.log(
                `The store is now open ${alreadyStocked ? 'once again' : ', freshly stocked'} and ready for new orders!`,
            )
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
