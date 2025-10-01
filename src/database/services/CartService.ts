import { productRepo } from '../../index.js'
import { Customer } from '../entity/Customer.js'

class CartService {
    async addToCart(productId: number, currentCustomer: Customer) {
        try {
            const productExists = await productRepo.findOneBy({ id: productId })
            if (!productExists)
                throw new Error(`Product with ID ${productId} was not found`)
            currentCustomer.cart.push(productId)
            console.log(
                `Product with ID ${productId} was added to ${Customer.name}'s cart`,
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
        }
        currentCustomer.cart.splice(productIndex, 1)
        console.log(
            `Product with id ${productId} was successfully removed from ${currentCustomer.name}'s cart`,
        )
    }
}

export type CartOperation = keyof CartService

export const handleCartOperation = async (operation: CartOperation, customerInstance: Customer, productId: number) => {
    const cartService = new CartService()
    switch (operation) {
        case 'addToCart':
            await cartService.addToCart(productId, customerInstance)
            break;
        case 'removeFromCart':
            cartService.removeFromCart(productId, customerInstance)
            break;
        default:
            break;
    }
}