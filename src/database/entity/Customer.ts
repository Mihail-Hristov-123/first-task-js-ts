import { ChildEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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
