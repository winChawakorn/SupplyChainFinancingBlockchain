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
const Statement = require('./statement.js');


/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class SCFContract extends Contract {

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
    async issueBuyRequest(ctx, id, buyer, supplier, product, amount) {
        // create an instance of the buyRequest
        let buyRequest = BuyRequest.createInstance(id, buyer, supplier, product, amount);

        // Add the paper to the list of all similar buy request in the ledger world state
        await ctx.buyRequestList.addBuyRequest(buyRequest);

        let statement = Statement.createInstance('0001', 'funder', 'buyer', 'supplier', 'product', '100', '40000', '2020-05-31');

        // Add the paper to the list of all similar buy request in the ledger world state
        await ctx.statementList.addStatement(statement);

        // // Must return a serialized paper to caller of smart contract
        return buyRequest.toBuffer();
    }

    async issueStatement(ctx, id, funder, buyer, supplier, product, amount, price, dueDate) {
        // let invoiceKey = Invoice.makeKey([invoiceId]);
        // let invoice = await ctx.invoiceList.getInvoice(invoiceKey);
        // create an instance of the statement
        // id, funder, buyer, supplier, product, amount, price, dueDate
        let statement = Statement.createInstance(id, funder, buyer, supplier, product, amount, price, dueDate);

        // Add the paper to the list of all similar buy request in the ledger world state
        await ctx.statementList.addStatement(statement);

        // Must return a serialized paper to caller of smart contract
        return statement.toBuffer();
    }

    async payStatement(ctx, id) {
        console.log('hello from payStatement')

        // console.log('=====finding buy req======')
        // const buyRequest = await ctx.buyRequestList.getBuyRequest('0001')
        // console.log(buyRequest)

        let statementKey = Statement.makeKey(['0001']);

        let statement = await ctx.statementList.getStatement(statementKey);
        console.log(statement)

        // Check statement is not REDEEMED
        if (statement.isPaid()) {
            throw new Error('Payment ' + id + ' already paid');
        }
        statement.pay()

        await ctx.statementList.updateStatement(statement);
        return statement.toBuffer();
    }
}

module.exports = SCFContract;
