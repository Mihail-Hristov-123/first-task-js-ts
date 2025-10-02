import { calculateOrderTotal } from '../../utils/calculateOrderTotal.js'
import { calculateDiscountedTotal } from '../../utils/calculateDiscountedTotal.js'
import { completeOrders } from '../../utils/completeOrders.js'
import { reduceBalance } from '../../utils/reduceBalance.js'
import { reduceAllOrdersProductQuantity } from '../../utils/reduceAllOrdersProductQuantity.js'

import { simulatePayment } from '../../utils/simulatePayment.js'
import { customerRepo, orderRepo } from '../connection.js'
import type { Customer } from '../entity/customer.entity.js'
import { Order } from '../entity/order.entity.js'

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
            if (!currentCustomer.orders) {
                currentCustomer.orders = []
            }
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

            const discountedTotal = calculateDiscountedTotal(
                userUnpaidOrders,
                customerInstance.hasDiscounts,
            )
            await this.handlePayment(
                customerInstance,
                discountedTotal,
                userUnpaidOrders,
            )
            console.log(
                `User ${customerInstance.id} has successfully paid for all their orders`,
            )
        } catch (error) {
            console.error(`An error occurred during order payment: ${error}`)
        }
    }

    async handlePayment(
        customer: Customer,
        discountedTotal: number,
        ordersToPay: Order[],
    ) {
        console.log(await simulatePayment(customer.balance, discountedTotal))
        await reduceBalance(customer, discountedTotal)
        await completeOrders(ordersToPay)
        await reduceAllOrdersProductQuantity(ordersToPay)
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
            console.warn(`Unhandled operation type: ${operation}`)
            break
    }
}
