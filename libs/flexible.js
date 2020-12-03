const helpers = require('./helpers')

module.exports = class Flexible {
    constructor(binanceApiClient, accountBalances, flexibleBalances) {
        this.binanceApiClient = binanceApiClient
        this.accountBalances = helpers.stripLendingPrefix(accountBalances)
        this.flexibleBalances = helpers.stripLendingPrefix(flexibleBalances)
    }

    async getAvailableProducts() {
        const products = await this.binanceApiClient.fetchApi(
            '/sapi/v1/lending/daily/product/list',
            { status: 'SUBSCRIBABLE' }
        )

        return helpers.filterEqualAssetsByAmount(
            this.accountBalances,
            helpers.filterDifferentAssets(this.flexibleBalances, products)
        )
    }

    async purchaseProducts(products) {
        await Promise.all(
            products.map(async product => {
                const { productId, free, upLimitPerUser } = product
                const amount = Math.min(free, upLimitPerUser)

                await this.binanceApiClient.fetchApi(
                    '/sapi/v1/lending/daily/purchase',
                    { productId, amount },
                    { method: 'POST' }
                )

                helpers.log('FLEXIBLE purchase product', [product])
            })
        )
    }

    async redeemProducts(products) {
        await Promise.all(
            products.map(async product => {
                const { asset } = product

                const position = await this.binanceApiClient.fetchApi(
                    '/sapi/v1/lending/daily/token/position',
                    { asset }
                )

                const type = 'FAST'
                const amount = position[0]['freeAmount']
                const productId = position[0]['productId']

                await this.binanceApiClient.fetchApi(
                    '/sapi/v1/lending/daily/redeem',
                    { productId, amount, type },
                    { method: 'POST' }
                )

                helpers.log('FLEXIBLE redeem product', [product])
            })
        )
    }
}
