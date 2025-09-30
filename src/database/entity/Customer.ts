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
        // Decreases the quantity of a particular product
        try {
            const product = await repository.product.findOneBy({
                id: productId,
            })

            if (!product) {
                throw new Error('No product was found with the particular ID')
            }
            const currentQunatity = product?.quantityInStock
            if (currentQunatity === 0) {
                console.log(
                    'Currently this product is unavailable. You will be notified once it is restocked',
                )
                return
            }
            if (currentQunatity < 10 && !this.hasPriority) {
                console.log(
                    `As there are only ${currentQunatity} articles of this type left, they are reserved for our premium customers`,
                )
                return
            }
            product.quantityInStock = currentQunatity - 1
            await repository.product.save(product)
            console.log(`${product.name} purchased successfully`)
        } catch (error) {
            console.error(`An error occurred during the purchase: ${error}`)
        }
    }

    public constructor(
        name: string,
        hasDiscounts: boolean,
        hasPriority: boolean,
    ) {
        this.name = name
        this.hasDiscounts = hasDiscounts
        this.hasPriority = hasPriority
        this.cart = []
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
