/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const BuyRequest = require('./buyRequest.js');
const BuyRequestList = require('./buyRequestList.js');

/**
 * A custom context provides easy access to list of all buy request
 */
class BuyRequestContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.buyRequestList = new BuyRequestList(this);
    }

}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class BuyRequestContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.papernet.commercialpaper');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new BuyRequestContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }
    // this runs server-side
    async issue(ctx, id, buyer, supplier, product, amount) {
        // create an instance of the buyRequest
        let buyRequest = BuyRequest.createInstance(id, buyer, supplier, product, amount);
        console.log('currentState ====')
        console.log(buyRequest.getCurrentState())

        // Add the paper to the list of all similar buy request in the ledger world state
        await ctx.buyRequestList.addBuyRequest(buyRequest);

        // // Must return a serialized paper to caller of smart contract
        return buyRequest.toBuffer();
    }
}

module.exports = BuyRequestContract;
