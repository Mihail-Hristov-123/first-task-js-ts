import type { Customer } from '../database/entity/customer.entity.js'
import { Product } from '../database/entity/product.entity.js'

export const limitProductAvailability = (
    customerInstance: Customer,
    product: Product,
) => {
    const { id: productId } = product

    if (!product.isAvailable()) {
        throw new Error(
            `The product with ID ${productId} is not currently available`,
        )
    }

    const { quantityInStock } = product

    const { hasPriority: userHasPriority } = customerInstance

    if (!userHasPriority && quantityInStock <= 10) {
        throw new Error(
            `As there are only ${quantityInStock} articles left of the product with ID ${productId}, they are reserved for our premium customers`,
        )
    }
}
