const PRODUCT_API_URL = 'https://fakestoreapi.com/products'

export const fetchProducts = async () => {
    try {
        const response = await fetch(PRODUCT_API_URL)
        const data = await response.json()
        return data
    } catch (error) {
        console.error(`Product fetch and DB population failed: ${error}`)
    }
}
