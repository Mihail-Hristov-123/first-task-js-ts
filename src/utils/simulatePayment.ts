export const simulatePayment = (funds: number, price: number) => {
    return new Promise((resolve, reject) => {
        console.log('Payment process has begun...')
        setTimeout(() => {
            if (funds > price) resolve('Payment complete')
            reject('Insifficient funds')
        }, 5000)
    })
}
