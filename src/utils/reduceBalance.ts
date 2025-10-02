import type { Customer } from '../database/entity/Customer.js'
import { customerRepo } from '../database/connection.js'

export const reduceBalance = async (customer: Customer, amount: number) => {
    customer.balance = customer.balance - amount
    await customerRepo.save(customer)
    console.log(
        `A total of $${amount} have been reducted from user with ID ${customer.id}'s account`,
    )
}
