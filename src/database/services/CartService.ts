import { customerRepo, productRepo } from '../../index.js'
import { limitProductAvailability } from '../../utils/limitProductAvailability.js'
import { Customer } from '../entity/Customer.js'
import type { Product } from '../entity/Product.js'

class CartService {
    async addToCart(product: Product, currentCustomer: Customer) {
        try {

            limitProductAvailability(currentCustomer, product)
            currentCustomer.cart.push(product)
            await customerRepo.save(currentCustomer)
            console.log(
                `Product with ID ${product.id} was added to ${currentCustomer.name}'s cart`,
            )
        } catch (error) {
            console.error(
                `Error occurred while adding product to cart: ${error}`,
            )
        }
    }

    async removeFromCart(product: Product, currentCustomer: Customer) {
        const productIndex = currentCustomer.cart.indexOf(product)
        if (productIndex === -1) {
            console.log(
                `Product with id ${product.id} was not in ${currentCustomer.name}'s cart`,
            )
            return
        }
        currentCustomer.cart.splice(productIndex, 1)
        await customerRepo.save(currentCustomer)
        console.log(
            `Product with id ${product.id} was successfully removed from ${currentCustomer.name}'s cart`,
        )
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
            break
    }
}
