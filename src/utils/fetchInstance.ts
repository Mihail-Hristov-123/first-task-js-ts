import { customerRepo, orderRepo, productRepo } from '../index.js'

export type FetchableEntities = 'customer' | 'product' | 'order'

const getAppropriateRepo = (query: FetchableEntities) => {
    switch (query) {
        case 'customer':
            return customerRepo

        case 'order':
            return orderRepo

        case 'product':
            return productRepo

        default:
            break
    }
}

export const fetchInstance = async (query: FetchableEntities, id: number) => {
    try {
        const repoToUse = getAppropriateRepo(query)
        const result = await repoToUse?.findOneByOrFail({ id })
        return result
    } catch (error) {
        console.error(`An error occurred while trying to find ${query} #${id}`)
    }
}
