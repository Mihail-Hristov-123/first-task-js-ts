import { Product } from '../entity/Product.js'

class ProductService {
    decreaseQuantity(productInstance: Product) {
        if (productInstance.quantityInStock === 0) {
            console.log(
                'Product is currently unavailable, its quantity cannot be further decreased',
            )
        }
        productInstance.quantityInStock -= 1
    }
}

export type ProductOperation = keyof ProductService

export const handleProductOperation = (
    operation: ProductOperation,
    productInstance: Product,
) => {
    const productService = new ProductService()
    switch (operation) {
        case 'decreaseQuantity':
            productService.decreaseQuantity(productInstance)
            break

        default:
            break
    }
}
