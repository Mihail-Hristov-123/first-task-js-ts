import type { Customer } from '../database/entity/customer.entity.js'
import { customerRepo } from '../database/connection.js'

export const reduceBalance = async (customer: Customer, amount: number) => {
    customer.balance = customer.balance - amount
    try {
        await customerRepo.save(customer)
        console.log(
            `A total of $${amount} have been reduced from user with ID ${customer.id}'s account`,
        )
    } catch (error) {
        console.error(
            `An error occurred during user #${customer.id}'s balance adjustment`,
        )
    }
}
