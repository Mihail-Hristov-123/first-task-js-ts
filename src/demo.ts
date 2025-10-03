import { Store } from './index.js'

export const playDemo = async (store: Store) => {
    try {
        // Creates and returns a premium customer
        const firstUser = await store.addNewUser(
            ' John',
            'uniqueEmail', // Please change if duplicate (an error might pop up as the email should be unique)
            2000,
            true, // Change to false if you wish to observe the regular customer behavior (no discounts and might not be able to access products that are almost sold out (#14, #10 for example))
        )

        if (!firstUser) {
            throw new Error(
                'First user was not created or retrieved - demo problem',
            )
        }

        // Finds and returns a particular instance of the provided entity
        const ssdProduct = await store.findOne('product', 10)
        const jacketProduct = await store.findOne('product', 3)
        const tvProduct = await store.findOne('product', 14)

        if (!ssdProduct || !jacketProduct || !tvProduct) {
            throw new Error(`One of the products was not found - demo problem`)
        }

        // The first user was interested in these 3 products, so he added them to his cart
        await store.addProductToCart(ssdProduct, firstUser)
        await store.addProductToCart(jacketProduct, firstUser)
        await store.addProductToCart(tvProduct, firstUser)

        // Let's review John's cart (customers are iterable)
        for (const product of firstUser) {
            console.log(product)
        }

        // John has decided that the TV seems too expensive - let's remove it from his cart
        await store.removeProductFromCart(tvProduct, firstUser)

        // Our first user is now ready to place an order - this will create a new order in the DB and empty his cart
        await store.placeOrder(firstUser)

        // Order payment - user's balance is adjusted, order's status is set to complete, and the ordered items available quantity is reduced
        await store.payAllUserOrders(firstUser)
    } catch (error) {
        console.error(error)
    }
}
