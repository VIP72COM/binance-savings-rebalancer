/**
 * Required modules
 */
const helpers = require('./libs/helpers')
const binanceApi = require('./libs/binance-api')
const binanceApiClient = new binanceApi(process.env['API_KEY'], process.env['API_SECRET'])

const Locked = require('./libs/locked')
const Account = require('./libs/account')
const Activities = require('./libs/activities')
const Flexible = require('./libs/flexible')

;(async () => {
    const account = new Account(binanceApiClient)
    const accountBalances = await account.getBalances()
    const flexibleBalances = accountBalances.filter(x => x['asset'].startsWith('LD'))

    /**
     * Activities
     */
    const activities = new Activities(binanceApiClient, accountBalances)
    activities.getAvailableProjects().then(async projects => {
        const redeemProjects = helpers.filterEqualAssets(flexibleBalances, projects)

        redeemProjects && await flexible.redeemProducts(redeemProjects)

        await activities.purchaseProjects(projects)
    })

    /**
     * Locked Savings
     */
    const locked = new Locked(binanceApiClient, accountBalances)
    locked.getAvailableProjects().then(async projects => {
        const redeemProjects = helpers.filterEqualAssets(flexibleBalances, projects)

        redeemProjects && await flexible.redeemProducts(redeemProjects)

        await locked.purchaseProjects(projects)
    })

    /**
     * Flexible Savings
     */
    const flexible = new Flexible(binanceApiClient, accountBalances, flexibleBalances)
    flexible.getAvailableProducts().then(async products => {
        await flexible.purchaseProducts(products)
    })
})()
