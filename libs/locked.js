/**
 * Required module
 */
const helpers = require('./helpers')

/** Locked Savings API Wrapper */
module.exports = class Locked {
    /**
     * Create a Locked Savings Client
     * @param {Object} binanceApiClient - Binance API Client
     * @param {Array.<Object>} accountBalances - Account Balances
     */
    constructor(binanceApiClient, accountBalances) {
        this.binanceApiClient = binanceApiClient
        this.accountBalances = helpers.stripLendingPrefix(accountBalances)
    }

    /**
     * Get available Locked Savings projects
     * @return {Array.<Object>} Available projects
     */
    async getAvailableProjects() {
        const projects = await this.binanceApiClient.fetchApi(
            '/sapi/v1/lending/project/list',
            { type: 'CUSTOMIZED_FIXED', status: 'SUBSCRIBABLE', size: 100 }
        )

        return helpers.filterEqualAssetsByLots(
            this.accountBalances,
            helpers.reduceAssetsByInterestRate(projects)
        )
    }

    /**
     * Purchase Locked Savings projects
     * @param {Array.<Object>} projects - Locked Savings projects to purchase
     */
    async purchaseProjects(projects) {
        await Promise.all(
            projects.map(async project => {
                const { projectId, free, lotSize, maxLotsPerUser } = project
                const lot = Math.min((free / lotSize), maxLotsPerUser)

                await this.binanceApiClient.fetchApi(
                    '/sapi/v1/lending/customizedFixed/purchase',
                    { projectId, lot },
                    { method: 'POST' }
                )

                helpers.log('Purchase a Locked Savings project', [project])
            })
        )
    }
}
