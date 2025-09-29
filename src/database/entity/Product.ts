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

    isProduct(potentialProduct: unknown): potentialProduct is Product {
        return potentialProduct instanceof Product
    }
}
