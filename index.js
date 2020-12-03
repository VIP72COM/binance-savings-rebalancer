const helpers = require('./libs/helpers')
const binanceApi = require('./libs/binance-api')
const binanceApiClient = new binanceApi(process.env['API_KEY'], process.env['API_SECRET'])

const Fixed = require('./libs/fixed')
const Account = require('./libs/account')
const Activity = require('./libs/activity')
const Flexible = require('./libs/flexible')

;(async () => {
    const account = new Account(binanceApiClient)
    const accountBalances = await account.getBalances()
    const flexibleBalances = accountBalances.filter(x => x['asset'].startsWith('LD'))

    /* ACTIVITY */
    const activity = new Activity(binanceApiClient, accountBalances)
    activity.getAvailableProducts().then(async products => {
        const redeemProducts = helpers.filterEqualAssets(flexibleBalances, products)

        redeemProducts && await flexible.redeemProducts(redeemProducts)

        await activity.purchaseProducts(products)
    })

    /* FIXED */
    const fixed = new Fixed(binanceApiClient, accountBalances)
    fixed.getAvailableProducts().then(async products => {
        const redeemProducts = helpers.filterEqualAssets(flexibleBalances, products)

        redeemProducts && await flexible.redeemProducts(redeemProducts)

        await fixed.purchaseProducts(products)
    })

    /* FLEXIBLE */
    const flexible = new Flexible(binanceApiClient, accountBalances, flexibleBalances)
    flexible.getAvailableProducts().then(products => flexible.purchaseProducts(products))
})()
