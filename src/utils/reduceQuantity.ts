import type { Order } from "../database/entity/Order.js";
import { productRepo } from "../index.js";



const findProduct = async (productId: number) => {
    const currentProduct = await productRepo.findOneBy({ id: productId })
    if (!currentProduct) {
        throw new Error(`Product with ID ${productId} was not found`)
    }
    return currentProduct
}


const reduceProductQuantity = async (productId: number) => {
    const currentProduct = await findProduct(productId)
    await currentProduct.modifyProduct('decreaseQuantity')
    console.log(`The available quantity of product with ID ${productId} was reduced`)
}


export const reduceQuantityFromOrder = async (orders: Order[]) => {
    for (const order of orders) {
        await Promise.all(order.cartItemIds.map(item => reduceProductQuantity(item)))
    }
}




