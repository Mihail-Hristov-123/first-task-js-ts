import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Customer } from './Customer.js'

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    private cartItemIds: number[]

    @Column('real')
    private total: number

    @ManyToOne(() => Customer, (customer) => customer.orders)
    owner: number

    constructor(cartItemIds: number[], owner: number) {
        this.cartItemIds = cartItemIds
        this.owner = owner
    }
}
