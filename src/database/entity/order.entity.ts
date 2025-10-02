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
    total: number

    @ManyToOne(() => Customer, (customer) => customer.orders)
    owner: Customer

    constructor(owner: Customer) {
        this.owner = owner
    }
}
