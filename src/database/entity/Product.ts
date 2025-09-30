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

    constructor(name: string, description: string, price: number) {
        this.name = name
        this.description = description
        this.price = price
    }

    isProduct(potentialProduct: unknown): potentialProduct is Product {
        return potentialProduct instanceof Product
    }
}
