import type { Repository } from 'typeorm'
import { initializeProducts } from '../../utils/initializeProducts.js'
import {
    connectToDatabase,
    customerRepo,
    orderRepo,
    productRepo,
} from '../connection.js'
import {
    Customer,
    PremiumCustomer,
    RegularCustomer,
} from '../entity/customer.entity.js'

import type { EntityMap, FetchableEntities } from '../../types/service.types.js'
import type { Product } from '../entity/product.entity.js'

const repoMap: {
    [K in keyof EntityMap]: Repository<EntityMap[K]>
} = {
    customer: customerRepo,
    product: productRepo,
    order: orderRepo,
}
export class StoreService {
    async openStore() {
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

    async addNewUser(
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

    async findOne<T extends FetchableEntities>(
        query: T,
        id: number,
    ): Promise<EntityMap[T] | undefined> {
        try {
            const result = await repoMap[query].findOneByOrFail({ id } as any)
            return result
        } catch (error) {
            console.error(`Error occurred during search: ${error}`)
            return undefined
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

const storeService = new StoreService()
