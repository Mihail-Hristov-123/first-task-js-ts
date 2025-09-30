import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Customer } from './Customer.js'

type Status = 'pending' | 'complete'

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column('int', { array: true })
    private cartItemIds: number[]

    @Column()
    status: Status

    @Column('real', { nullable: true })
    private total: number

    @ManyToOne(() => Customer, (customer) => customer.orders)
    readonly owner: number

    constructor(cartItemIds: number[], owner: number) {
        this.cartItemIds = cartItemIds
        this.owner = owner
        this.status = 'pending'
    }
}
