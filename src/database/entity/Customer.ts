import { ChildEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { productRepo } from '../../index.js'

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

    @Column('real')
    private balance: number

    @Column('int', { array: true })
    private cart: number[]

    async addToCart(productId: number) {
        try {
            const productExists = await productRepo.findOneBy({ id: productId })
            if (!productExists)
                throw new Error(`Product with ID ${productId} was not found`)
            this.cart.push(productId)
            console.log(
                `Product with ID ${productId} was added to ${this.name}'s cart`,
            )
        } catch (error) {
            console.error(
                `Error occurred while adding product to cart: ${error}`,
            )
        }
    }
    removeFromCart(productId: number) {
        const productIndex = this.cart.indexOf(productId)
        if (productIndex === -1) {
            console.log(
                `Product with id ${productId} was not in ${this.name}'s cart`,
            )
        }
        this.cart.splice(productIndex, 1)
        console.log(
            `Product with id ${productId} was successfully removed from ${this.name}'s cart`,
        )
    }

    // async buyProduct(productId: number) {
    //     // Decreases the available quantity of a particular product
    //     try {
    //         const product = await productRepo.findOneBy({
    //             id: productId,
    //         })

    //         if (!product) {
    //             throw new Error('No product was found with the particular ID')
    //         }

    //         if (!product.isAvailable()) {
    //             console.log(
    //                 'Currently this product is unavailable. You will be notified once it is restocked',
    //             )
    //             return
    //         }
    //         const currentQunatity = product.quantityInStock

    //         if (currentQunatity < 10 && !this.hasPriority) {
    //             console.log(
    //                 `As there are only ${currentQunatity} articles of this type left, they are reserved for our premium customers`,
    //             )
    //             return
    //         }

    //         if (this.balance < product.price) {
    //             console.log('Insufficient funds')
    //             return
    //         }

    //         product.quantityInStock = currentQunatity - 1
    //         await productRepo.save(product)
    //         this.balance -= product.price
    //         console.log(`${product.name} purchased successfully`)
    //     } catch (error) {
    //         console.error(`An error occurred during the purchase: ${error}`)
    //     }
    // }

    public constructor(
        name: string,
        hasDiscounts: boolean,
        hasPriority: boolean,
        balance: number,
    ) {
        if (balance < 0 || balance > 100_000) {
            throw new Error('Invalid balance')
        }
        this.name = name
        this.hasDiscounts = hasDiscounts
        this.hasPriority = hasPriority
        this.balance = balance
        this.cart = []
    }
}

@ChildEntity()
class RegularCustomer extends Customer {
    constructor(name: string, balance: number) {
        super(name, false, false, balance)
    }
}

@ChildEntity()
class PremiumCustomer extends Customer {
    constructor(name: string, balance: number) {
        super(name, true, true, balance)
    }
}

export { Customer, RegularCustomer, PremiumCustomer }
