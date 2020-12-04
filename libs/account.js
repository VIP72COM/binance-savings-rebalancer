/** Account API Wrapper */
module.exports = class Account {
    /**
     * Create an Account Client
     * @param {Object} binanceApiClient - Binance API Client
     */
    constructor(binanceApiClient) {
        this.binanceApiClient = binanceApiClient
    }

    /**
     * Get balances with a positive free amount from Binance Account
     * @return {Array.<Object>} Binance Account Balances
     */
    async getBalances() {
        const accountInfos = await this.binanceApiClient.fetchApi('/api/v3/account')
        const { balances } = accountInfos

        return balances.filter(balance => Number(balance['free']))
    }
}
