module.exports.reduceAssetsByInterestRate = products => {
    products.sort((a, b) => (a['asset'] > b['asset']) ? 1 : (a['asset'] === b['asset']) ? ((a['interestRate'] < b['interestRate']) ? 1 : -1) : -1 )

    return [...new Set(products.map(product => product['asset']))].map(asset => products.filter(item => item['asset'] === asset)[0])
}

module.exports.filterDifferentAssets = (products1, products2) => {
    return products2.filter(product2 => !products1.map(x => x['asset']).includes(product2['asset'])).flat()
}

module.exports.filterEqualAssets = (products1, products2) => {
    return products1.map(product1 => products2.filter(product2 => product1['asset'] === product2['asset'])).flat()
}

module.exports.filterEqualAssetsByLots = (products1, products2) => {
    return products1.map(product1 => {
        const filteredProducts = products2.filter(product2 => product1['asset'] === product2['asset'] && product1['free'] >= (product2['lotsLowLimit'] * product2['lotSize']))

        return filteredProducts.map(filteredProduct => ({...filteredProduct, ...product1}))
    }).flat()
}

module.exports.filterEqualAssetsByAmount = (products1, products2) => {
    return products1.map(product1 => {
        const filteredProducts = products2.filter(product2 => product1['asset'] === product2['asset'] && product1['free'] >= product2['minPurchaseAmount'])

        return filteredProducts.map(filteredProduct => ({...filteredProduct, ...product1}))
    }).flat()
}

module.exports.stripLendingPrefix = balances => {
    return balances.map(balance => {
        if (balance['asset'].startsWith('LD')) {
            balance['asset'] = balance['asset'].substring(2)
        }

        return balance
    })
}

module.exports.log = (msg, args) => {
    console.log(msg, args.map(x => x['asset']))
}
