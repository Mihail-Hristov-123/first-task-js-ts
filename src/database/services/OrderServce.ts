import { customerRepo, orderRepo } from '../../index.js'
import { calculateTotal } from '../../utils/calculateTotal.js'
import { completeOrders } from '../../utils/completeOrders.js'
import { reduceQuantityFromOrder } from '../../utils/reduceQuantity.js'
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
        const { id: customerId } = currentCustomer
        try {
            const [allUserOrders, orderCount] = await orderRepo.findAndCountBy({
                ownerId: customerId,
            })
            if (!orderCount) {
                console.log(
                    `User with ID ${customerId} has no active orders at this moment`,
                )
                return
            }

            const totalPrice = calculateTotal(
                allUserOrders,
                currentCustomer.hasDiscounts,
            )

            console.log(
                await simulatePayment(currentCustomer.balance, totalPrice),
            )
            currentCustomer.balance -= totalPrice
            await completeOrders(allUserOrders)
            await reduceQuantityFromOrder(allUserOrders)
            customerRepo.save(currentCustomer)
            console.log(`User with ID ${customerId} has paid for all their orders`)
        } catch (error) {
            console.error(`Error occurred during payment: ${error}`)
        }
    }
}

export type OrderOperation = keyof OrderService

export const handleOrderOperation = async (
    operation: OrderOperation,
    customerInstance: Customer,
) => {
    const orderService = new OrderService()
    switch (operation) {
        case 'placeOrder':
            await orderService.placeOrder(customerInstance)
            break
        case 'payAllOrders':
            await orderService.payAllOrders(customerInstance)
            break

        default:
            break
    }
}
