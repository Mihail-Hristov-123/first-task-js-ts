import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { handleProductOperation, type ProductOperation } from '../services/ProductService.js'

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column('real')
    price: number

    @Column({ nullable: true })
    quantityInStock: number

    constructor(
        name: string,
        description: string,
        price: number,
        quantityInStock: number,
    ) {
        this.name = name
        this.description = description
        this.price = price
        this.quantityInStock = quantityInStock
    }

    static isProduct(potentialProduct: unknown): potentialProduct is Product {
        return potentialProduct instanceof Product
    }

    isAvailable() {
        return this.quantityInStock > 0
    }

    modifyProduct(operation: ProductOperation) {
        handleProductOperation(operation, this)
    }
}
