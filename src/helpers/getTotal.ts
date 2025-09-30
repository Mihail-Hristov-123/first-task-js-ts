import { productRepo } from '../index.js'

export const getTotal = async (itemIds: number[]) => {
    let total = 0
    try {
        for (const id of itemIds) {
            const product = await productRepo.findOneBy({ id })
            if (!product) {
                throw new Error(`Product with id ${id} was not found`)
            }
            total += product.price
        }
        return total
    } catch (error) {
        console.error(
            `An error occurred while calculating the order's total: ${error}`,
        )
    }
}
