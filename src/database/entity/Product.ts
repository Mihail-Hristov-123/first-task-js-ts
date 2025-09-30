import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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

    @Column()
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

    isProduct(potentialProduct: unknown): potentialProduct is Product {
        return potentialProduct instanceof Product
    }
}
