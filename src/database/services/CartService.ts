import { productRepo } from '../../index.js'
import { limitProductAvailability } from '../../utils/limitProductAvailability.js'
import { Customer } from '../entity/Customer.js'

class CartService {
    async addToCart(productId: number, currentCustomer: Customer) {
        try {
            const product = await productRepo.findOneBy({ id: productId })
            limitProductAvailability(
                currentCustomer,
                productId,
                product || undefined,
            )
            currentCustomer.cart.push(productId)
            console.log(
                `Product with ID ${productId} was added to ${currentCustomer.name}'s cart`,
            )
        } catch (error) {
            console.error(
                `Error occurred while adding product to cart: ${error}`,
            )
        }
    }

    removeFromCart(productId: number, currentCustomer: Customer) {
        const productIndex = currentCustomer.cart.indexOf(productId)
        if (productIndex === -1) {
            console.log(
                `Product with id ${productId} was not in ${currentCustomer.name}'s cart`,
            )
            return
        }
        currentCustomer.cart.splice(productIndex, 1)
        console.log(
            `Product with id ${productId} was successfully removed from ${currentCustomer.name}'s cart`,
        )
    }
}

export type CartOperation = keyof CartService

export const handleCartOperation = async (
    operation: CartOperation,
    customerInstance: Customer,
    productId: number,
) => {
    const cartService = new CartService()
    switch (operation) {
        case 'addToCart':
            await cartService.addToCart(productId, customerInstance)
            break
        case 'removeFromCart':
            cartService.removeFromCart(productId, customerInstance)
            break
        default:
            break
    }
}
