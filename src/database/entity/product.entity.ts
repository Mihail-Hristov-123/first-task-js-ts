import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import type { ProductFields, RawProduct } from '../../types/entity.types.js'

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @Column('real')
    price: number

    @Column({ nullable: true })
    quantityInStock: number

    constructor(
        title: string,
        description: string,
        price: number,
        quantityInStock: number,
    ) {
        this.title = title
        this.description = description
        this.price = price
        this.quantityInStock = quantityInStock
    }

    static isProduct(obj: RawProduct): obj is ProductFields {
        return (
            obj &&
            typeof obj.title === 'string' &&
            typeof obj.description === 'string' &&
            typeof obj.price === 'number'
        )
    }

    isAvailable() {
        return this.quantityInStock > 0
    }
}
