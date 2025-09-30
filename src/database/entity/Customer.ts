import { ChildEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import type { Product } from './Product.js'
import { repository } from '../repository.js'

@Entity()
abstract class Customer {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ default: false })
    readonly hasDiscounts: boolean

    @Column({ default: false })
    readonly hasPriority: boolean

    private cart: Omit<Product, 'qunatityInStock'>[]

    async buyProduct(productId: number) {
        try {
            const product = await repository.product.findOneBy({
                id: productId,
            })
            if (!product) {
                throw new Error('No product was found with the particular ID')
            }
            if (product.quantityInStock === 0) {
                console.log(
                    'Currently this product is unavailable. You will be notified when it is restocked',
                )
                return
            }
            if (product.quantityInStock < 10 && !this.hasPriority) {
                console.log(
                    `As there are only ${product.quantityInStock} articles of this type left, they are reserved for our premium customers`,
                )
                return
            }
            // to be continued
        } catch (error) {}
    }

    public constructor(
        name: string,
        hasDiscounts: boolean,
        hasPriority: boolean,
    ) {
        this.name = name
        this.hasDiscounts = hasDiscounts
        this.hasPriority = hasPriority
    }
}

@ChildEntity()
class RegularCustomer extends Customer {
    constructor(name: string) {
        super(name, false, false)
    }
}

@ChildEntity()
class PremiumCustomer extends Customer {
    constructor(name: string) {
        super(name, true, true)
    }
}

export { Customer, RegularCustomer, PremiumCustomer }
