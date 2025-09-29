export const fetchProducts = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products')
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.error(`Product fetch and DB population failed: ${error}`)
    }
}

// Will later populate the DB
