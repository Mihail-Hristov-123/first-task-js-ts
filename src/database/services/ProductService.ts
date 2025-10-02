import { productRepo } from '../../index.js'
import { Product } from '../entity/Product.js'

class ProductService {
    async decreaseQuantity(productInstance: Product) {
        if (productInstance.quantityInStock === 0) {
            console.log(
                'Product is currently unavailable, its quantity cannot be further decreased',
            )
            return
        }
        productInstance.quantityInStock -= 1
        console.log(productInstance.quantityInStock)
        await productRepo.save(productInstance)
    }
}

export type ProductOperation = keyof ProductService

export const handleProductOperation = async (
    operation: ProductOperation,
    productInstance: Product,
) => {
    const productService = new ProductService()
    console.log(productInstance.quantityInStock)
    switch (operation) {
        case 'decreaseQuantity':
            await productService.decreaseQuantity(productInstance)
            break

        default:
            break
    }
    console.log(productInstance.quantityInStock)
}
