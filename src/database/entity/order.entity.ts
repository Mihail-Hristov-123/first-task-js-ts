import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { Customer, Product } from '../../types/entity.types.js'

import type { Status } from '../../types/entity.types.js'

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToMany(() => Product)
    @JoinTable()
    products: Product[]

    @Column({ type: 'enum', enum: ['pending', 'complete'], default: 'pending' })
    status: Status

    @Column('real', { nullable: true })
    private _total: number

    get total() {
        return this._total
    }
    set total(newTotal: number) {
        if (newTotal < 0) {
            console.warn("Order total can't be negative")
            return
        }
        this._total = newTotal
    }

    @ManyToOne(() => Customer, (customer) => customer.orders)
    owner: Customer

    constructor(owner: Customer) {
        this.owner = owner
    }
}
