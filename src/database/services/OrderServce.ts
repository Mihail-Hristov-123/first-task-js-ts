import { customerRepo, orderRepo } from '../../index.js'
import { completeOrders } from '../../utils/completeOrders.js'
import { simulatePayment } from '../../utils/simulatePayment.js'
import type { Customer } from '../entity/Customer.js'
import { Order } from '../entity/Order.js'

class OrderService {
    async placeOrder(currentCustomer: Customer) {
        const newOrder = new Order(currentCustomer.cart, currentCustomer.id)
        try {
            const result = await orderRepo.save(newOrder)
            currentCustomer.orderIds.push(result.id)
            customerRepo.save(currentCustomer)
            console.log('Order placed')
        } catch (error) {
            console.log(`Order placement failed: ${error}`)
        }
    }

    async payAllOrders(currentCustomer: Customer) {
        try {
            const [allUserOrders, orderCount] = await orderRepo.findAndCountBy({
                ownerId: currentCustomer.id,
            })
            if (!orderCount) {
                console.log(
                    `User ${currentCustomer.name} has no active orders at this moment`,
                )
                return
            }

            const ordersTotal = allUserOrders.reduce(
                (sum: number, order) => (sum += order.total),
                0,
            )

            console.log(
                await simulatePayment(currentCustomer.balance, ordersTotal),
            )
            currentCustomer.balance -= ordersTotal
            await completeOrders(allUserOrders)
            customerRepo.save(currentCustomer)
            console.log(
                `User ${currentCustomer.name} has paid for all their orders`,
            )
        } catch (error) {
            console.error(`Error occurred during payment: ${error}`)
        }
    }
}


export type OrderOperation = keyof OrderService

export const handleOrderOperation = async (operation: OrderOperation, customerInstance: Customer) => {
    const orderService = new OrderService()
    switch (operation) {
        case 'placeOrder':
            await orderService.placeOrder(customerInstance)
            break;
        case 'payAllOrders':
            await orderService.payAllOrders(customerInstance)
            break;

        default:
            break;
    }


}


