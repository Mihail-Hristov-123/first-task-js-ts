import { limitProductAvailability } from '../../utils/limitProductAvailability.js'
import { customerRepo } from '../connection.js'
import { Customer, type Product } from '../../types/entity.types.js'

class CartService {
    async addToCart(product: Product, currentCustomer: Customer) {
        try {
            limitProductAvailability(currentCustomer, product)
            if (!currentCustomer.cart) {
                currentCustomer.cart = []
            }
            currentCustomer.cart.push(product)
            await customerRepo.save(currentCustomer)
            console.log(
                `Product #${product.id} was added to customer #${currentCustomer.id}'s cart`,
            )
        } catch (error) {
            console.error(
                `Error occurred while adding product to customer #${currentCustomer.id}'s cart: ${error}`,
            )
        }
    }

    async removeFromCart(product: Product, currentCustomer: Customer) {
        const productIndex = currentCustomer.cart.indexOf(product)
        if (productIndex === -1) {
            console.log(
                `Product #${product.id} was not in customer #${currentCustomer.name}'s cart`,
            )
            return
        }
        currentCustomer.cart.splice(productIndex, 1)
        try {
            await customerRepo.save(currentCustomer)
            console.log(
                `Product #${product.id} was successfully removed from customer #${currentCustomer.name}'s cart`,
            )
        } catch (error) {
            console.error(
                `Error occurred while removing product #${product.id} from customer #${currentCustomer.id}'s cart: ${error}`,
            )
        }
    }
}

export type CartOperation = keyof CartService

export const handleCartOperation = async (
    operation: CartOperation,
    customerInstance: Customer,
    product: Product,
) => {
    const cartService = new CartService()
    switch (operation) {
        case 'addToCart':
            await cartService.addToCart(product, customerInstance)
            break
        case 'removeFromCart':
            await cartService.removeFromCart(product, customerInstance)
            break
        default:
            console.warn(`Unhandled operation type: ${operation}`)
            break
    }
}
