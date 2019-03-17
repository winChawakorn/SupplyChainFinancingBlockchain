/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');
const GlobalContext = require('./globalContext.js');

// PaperNet specifc classes
const BuyRequest = require('./buyRequest.js');
const BuyRequestList = require('./buyRequestList.js');


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
        return new GlobalContext();
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

        // Add the paper to the list of all similar buy request in the ledger world state
        await ctx.buyRequestList.addBuyRequest(buyRequest);

        // // Must return a serialized paper to caller of smart contract
        return buyRequest.toBuffer();
    }
}

module.exports = BuyRequestContract;
