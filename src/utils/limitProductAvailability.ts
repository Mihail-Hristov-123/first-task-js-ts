import type { Customer } from '../database/entity/Customer.js'
import { Product } from '../database/entity/Product.js'

export const limitProductAvailability = (customerInstance: Customer, product: Product) => {
    if (!product.isAvailable()) {
        throw new Error(
            `The product with ID ${product.id} is not currently available`,
        )
    }

    const { quantityInStock } = product

    const userHasPriority = customerInstance.hasPriority

    if (!userHasPriority && quantityInStock <= 10) {
        throw new Error(
            `As there are only ${quantityInStock} articles left of the product with ID ${product.id}, they are reserved for our premium customers`,
        )
    }
}
