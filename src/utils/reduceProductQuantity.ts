import type { Customer } from "../database/entity/Customer.js";
import type { Order } from "../database/entity/Order.js";
import { orderRepo } from "../index.js";

export const reduceProductQuantity = async (orders: Order[]) => {

    for (const order of orders) {
        for (const product of order.products) {
            await product.modifyProduct('decreaseQuantity')


        }
    }


}