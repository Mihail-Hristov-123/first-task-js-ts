import type { Order } from "../database/entity/Order.js";
import { orderRepo } from "../index.js";

export const completeOrders = async (orders: Order[]) => {
    for (const currentOrder of orders) {
        console.log(currentOrder)
        currentOrder.status = 'complete'
        await orderRepo.save(currentOrder)
        console.log(`Order ${currentOrder.id}'s status has been set to completed`)
    }
}