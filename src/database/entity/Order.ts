import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { productRepo } from '../../index.js'

type Status = 'pending' | 'complete'

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column('int', { array: true })
    private cartItemIds: number[]

    @Column()
    private _status: Status

    @Column('real', { nullable: true })
    total: number

    @Column()
    ownerId: number

    get status() {
        return this._status
    }

    set status(newStatus: Status) {
        this._status = newStatus
    }

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

    constructor(cartItemIds: number[], ownerId: number) {
        this.cartItemIds = cartItemIds
        this.ownerId = ownerId
        this._status = 'pending'
    }
    *[Symbol.iterator]() {
        for (const item of this.cartItemIds) {
            yield item
        }
    }
}
