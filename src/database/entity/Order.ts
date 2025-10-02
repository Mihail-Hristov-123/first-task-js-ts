import {
    BeforeInsert,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { productRepo } from '../../index.js'
import { Customer } from './Customer.js'
import { Product } from './Product.js'
import { calculateOrderTotal } from '../../utils/calculateOrderTotal.js'

type Status = 'pending' | 'complete'

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToMany(() => Product, { cascade: true })
    @JoinTable()
    products: Product[]

    @Column({ type: 'enum', enum: ['pending', 'complete'], default: 'pending' })
    status: Status

    @Column('real', { nullable: true })
    total: number

    @ManyToOne(() => Customer, (customer) => customer.orders)
    owner: Customer

    // @BeforeInsert()
    // async setTotal() {
    //     let total = 0
    //     for (const itemId of this.cartItemIds) {
    //         let productInfo = await productRepo.findOneBy({ id: itemId })
    //         if (!productInfo) {
    //             throw new Error(
    //                 `Couldn't find any info for product with ID ${itemId} - order total was not calculated`,
    //             )
    //         }
    //         total += productInfo.price
    //     }
    //     this.total = total
    // }


    *[Symbol.iterator]() {
        for (const item of this.products) {
            yield item
        }
    }


    constructor(owner: Customer) {
        this.owner = owner
    }
}
