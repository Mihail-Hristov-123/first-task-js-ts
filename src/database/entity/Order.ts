import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { productRepo } from '../../index.js'
import { Customer } from './Customer.js'

type Status = 'pending' | 'complete'

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column('int', { array: true })
    cartItemIds: number[]

    @Column({ type: 'enum', enum: ['pending', 'complete'], default: 'pending' })
    status: Status

    @Column('real', { nullable: true })
    total: number

    @ManyToOne(() => Customer, (customer) => customer.orders)
    owner: Customer



    @BeforeInsert()
    async setTotal() {
        let total = 0
        for (const itemId of this.cartItemIds) {
            let productInfo = await productRepo.findOneBy({ id: itemId })
            if (!productInfo) {
                throw new Error(
                    `Couldn't find any info for product with ID ${itemId} - order total was not calculated`,
                )
            }
            total += productInfo.price
        }
        this.total = total
    }

    constructor(cartItemIds: number[], owner: Customer) {
        this.cartItemIds = cartItemIds
        this.owner = owner
    }
    *[Symbol.iterator]() {
        for (const item of this.cartItemIds) {
            yield item
        }
    }
}
