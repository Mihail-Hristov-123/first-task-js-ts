import { customerRepo, orderRepo } from '../../index.js'
import { calculateOrderTotal } from '../../utils/calculateOrderTotal.js'
import { calculateTotal } from '../../utils/calculateTotal.js'
import { completeOrders } from '../../utils/completeOrders.js'
import { reduceBalance } from '../../utils/reduceBalance.js'
import { reduceProductQuantity } from '../../utils/reduceProductQuantity.js'

import { simulatePayment } from '../../utils/simulatePayment.js'
import type { Customer } from '../entity/Customer.js'
import { Order } from '../entity/Order.js'

class OrderService {
    async placeOrder(currentCustomer: Customer) {
        const cartItems = currentCustomer.cart
        if (cartItems.length === 0) {
            console.log(
                "Customer's cart is is empty, so an order could not be placed",
            )
            return
        }

        try {
            const newOrder = new Order(currentCustomer)
            newOrder.products = [...currentCustomer.cart]
            newOrder.total = calculateOrderTotal(newOrder)
            await orderRepo.save(newOrder)
            currentCustomer.cart.length = 0
            currentCustomer.orders.push(newOrder)
            await customerRepo.save(currentCustomer)

            console.log(
                `Order with a total price of ${newOrder.total.toFixed(2)} has been placed!`,
            )
        } catch (error) {
            console.error(`Order placement failed: ${error}`)
        }
    }

    async payAllOrders(customerInstance: Customer) {
        try {
            const userUnpaidOrders = await orderRepo.find({
                where: {
                    owner: { id: customerInstance.id },
                    status: 'pending',
                },
                relations: ['products'],
            })
            if (userUnpaidOrders.length === 0) {
                console.log(
                    `User with ID ${customerInstance.id} doesn't have any active orders - there's nothing to pay for`,
                )
                return
            }

            const discountedTotal = calculateTotal(
                userUnpaidOrders,
                customerInstance.hasDiscounts,
            )
            console.log(
                await simulatePayment(
                    customerInstance.balance,
                    discountedTotal,
                ),
            )
            await reduceBalance(customerInstance, discountedTotal)
            await completeOrders(userUnpaidOrders)
            await reduceProductQuantity(userUnpaidOrders)
            console.log(
                `User ${customerInstance.id} has successfully paid for all their orders`,
            )
        } catch (error) {
            console.error(`An error occurred during order payment: ${error}`)
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
