module.exports = class Account {
    constructor(binanceApiClient) {
        this.binanceApiClient = binanceApiClient
    }

    async getBalances() {
        const accountInfos = await this.binanceApiClient.fetchApi('/api/v3/account')
        const { balances } = accountInfos

        return balances.filter(balance => Number(balance['free']))
    }
}
