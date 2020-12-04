/**
 * Required module
 */
const helpers = require('./helpers')

/** Activities API Wrapper */
module.exports = class Activities {
    /**
     * Create an Activities Client
     * @param {Object} binanceApiClient - Binance API Client
     * @param {Array.<Object>} accountBalances - Account Balances
     */
    constructor(binanceApiClient, accountBalances) {
        this.binanceApiClient = binanceApiClient
        this.accountBalances = helpers.stripLendingPrefix(accountBalances)
    }

    /**
     * Get available Activities projects
     * @return {Array.<Object>} Available projects
     */
    async getAvailableProjects() {
        const projects = await this.binanceApiClient.fetchApi(
            '/sapi/v1/lending/project/list',
            { type: 'ACTIVITY', status: 'SUBSCRIBABLE', size: 100 }
        )

        return helpers.filterEqualAssetsByLots(
            this.accountBalances,
            helpers.reduceAssetsByInterestRate(projects)
        )
    }

    /**
     * Purchase Activities projects
     * @param {Array.<Object>} projects - Activities projects to purchase
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

                helpers.log('Purchase an Activities project', [project])
            })
        )
    }
}
