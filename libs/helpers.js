/**
 * Reduce projects by interest rate
 * @param {Array.<Object>} projects - Primary projects
 * @return {Array.<Object>} projects - Filtered projects
 */
module.exports.reduceAssetsByInterestRate = projects => {
    projects.sort((a, b) => (a['asset'] > b['asset']) ? 1 : (a['asset'] === b['asset']) ? ((a['interestRate'] < b['interestRate']) ? 1 : -1) : -1 )

    return [...new Set(projects.map(product => product['asset']))].map(asset => projects.filter(item => item['asset'] === asset)[0])
}

/**
 * Filter projects with different assets
 * @param {Array.<Object>} projects1 - Primary projects
 * @param {Array.<Object>} projects2 - Secondary projects
 * @return {Array.<Object>} projects1 - Filtered projects
 */
module.exports.filterDifferentAssets = (projects1, projects2) => {
    return projects2.filter(project2 => !projects1.map(project1 => project1['asset']).includes(project2['asset'])).flat()
}

/**
 * Filter projects with equal assets
 * @param {Array.<Object>} projects1 - Primary projects
 * @param {Array.<Object>} projects2 - Secondary projects
 * @return {Array.<Object>} projects1 - Filtered projects
 */
module.exports.filterEqualAssets = (projects1, projects2) => {
    return projects1.map(project1 => projects2.filter(project2 => project1['asset'] === project2['asset'])).flat()
}

/**
 * Filter projects with equal assets and free amount >= lotsLowLimit * lotSize
 * @param {Array.<Object>} projects1 - Primary projects
 * @param {Array.<Object>} projects2 - Secondary projects
 * @return {Array.<Object>} projects1 - Filtered projects
 */
module.exports.filterEqualAssetsByLots = (projects1, projects2) => {
    return projects1.map(project1 => {
        const filteredProducts = projects2.filter(project2 => project1['asset'] === project2['asset'] && project1['free'] >= (project2['lotsLowLimit'] * project2['lotSize']))

        return filteredProducts.map(filteredProduct => ({...filteredProduct, ...project1}))
    }).flat()
}

/**
 * Filter products with equal assets and free amount >= minPurchaseAmount
 * @param {Array.<Object>} products1 - Primary products
 * @param {Array.<Object>} products2 - Secondary products
 * @return {Array.<Object>} products1 - Filtered products
 */
module.exports.filterEqualAssetsByAmount = (products1, products2) => {
    return products1.map(product1 => {
        const filteredProducts = products2.filter(product2 => product1['asset'] === product2['asset'] && product1['free'] >= product2['minPurchaseAmount'])

        return filteredProducts.map(filteredProduct => ({...filteredProduct, ...product1}))
    }).flat()
}

/**
 * Remove Binance Lending prefix (LD)
 * @param {Array.<Object>} balances - Balances input
 * @return {Array.<Object>} balances - Balances output
 */
module.exports.stripLendingPrefix = balances => {
    return balances.map(balance => {
        if (balance['asset'].startsWith('LD')) {
            balance['asset'] = balance['asset'].substring(2)
        }

        return balance
    })
}

/**
 * Log message and the associated items
 * @param {String} msg - Log message
 * @param {Array.<Object>} args - Log items
 */
module.exports.log = (msg, args) => {
    console.log(msg, args.map(x => x['asset']))
}
