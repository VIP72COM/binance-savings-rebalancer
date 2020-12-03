const helpers = require('./helpers')
// const dummy = require('../data/dummy.json')

module.exports = class Activity {
    constructor(binanceApiClient, accountBalances) {
        this.binanceApiClient = binanceApiClient
        this.accountBalances = helpers.stripLendingPrefix(accountBalances)
    }

    async getAvailableProducts() {
        const products = await this.binanceApiClient.fetchApi(
            '/sapi/v1/lending/project/list',
            { type: 'ACTIVITY', status: 'SUBSCRIBABLE', size: 100 }
        )

        // const products = dummy.fixed

        return helpers.filterEqualAssetsByLots(
            this.accountBalances,
            helpers.reduceAssetsByInterestRate(products)
        )
    }

    async purchaseProducts(products) {
        await Promise.all(
            products.map(async product => {
                const { productId, free, lotSize, maxLotsPerUser } = product
                const lot = Math.min((free / lotSize), maxLotsPerUser)

                await this.binanceApiClient.fetchApi(
                    '/sapi/v1/lending/customizedFixed/purchase',
                    { productId, lot },
                    { method: 'POST' }
                )

                helpers.log('ACTIVITY purchase product', [product])
            })
        )
    }
}
