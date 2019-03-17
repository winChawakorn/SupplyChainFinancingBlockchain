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
const Invoice = require('./invoice.js');


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

        console.log(buyRequest)

        // let statement = Statement.createInstance('0001', 'funder', 'buyer', 'supplier', 'product', '100', '40000', '2020-05-31');

        // // Add the paper to the list of all similar buy request in the ledger world state
        // await ctx.statementList.addStatement(statement);

        // // Must return a serialized paper to caller of smart contract
        return buyRequest.toBuffer();
    }

    async issueInvoice(ctx, id) {
        let buyRequestKey = Invoice.makeKey(['0001']);
        let buyRequest = await ctx.buyRequestList.getBuyRequest(buyRequestKey);
        console.log('Buy reqqqqqqqq')
        console.log(buyRequest)

        // create an instance of the invoice
        let invoice = Invoice.createInstance(id, buyRequest.buyer, buyRequest.supplier, buyRequest.product, buyRequest.amount, '40000');
        console.log('invoiceeeeeeeeee')
        console.log(invoice)
        // Add the paper to the list of all similar buy request in the ledger world state
        await ctx.invoiceList.addInvoice(invoice);

        // // Must return a serialized paper to caller of smart contract
        return invoice.toBuffer();
    }

    async approve(ctx, id) {
        let invoiceKey = Invoice.makeKey(['0001']);
        let invoice = await ctx.invoiceList.getInvoice(invoiceKey);
        // create an instance of the statement
        let statement = Statement.createInstance(id, invoice.funder, invoice.buyer, invoice.supplier, invoice.product, invoice.amount, invoice.price, '2019-05-20');

        // Add the paper to the list of all similar buy request in the ledger world state
        await ctx.statementList.addStatement(statement);

        // Must return a serialized paper to caller of smart contract
        return statement.toBuffer();
    }

    async pay(ctx, id) {
        console.log('hello from payStatement')

        // console.log('=====finding buy req======')
        // const buyRequest = await ctx.buyRequestList.getBuyRequest('0001')
        // console.log(buyRequest)

        let statementKey = Statement.makeKey(['0001']);

        let statement = await ctx.statementList.getStatement(statementKey);
        // console.log(statement)

        // Check statement is not paid
        if (statement.isPaid()) {
            throw new Error('Payment ' + id + ' already paid');
        }
        statement.pay()

        await ctx.statementList.updateStatement(statement);
        return statement.toBuffer();
    }

    async requestPayment(ctx) {
        // console.log('=====finding buy req======')
        // const buyRequest = await ctx.buyRequestList.getBuyRequest('0001')
        // console.log(buyRequest)

        let invoiceKey = Invoice.makeKey(['0001']);

        let invoice = await ctx.invoiceList.getInvoice(invoiceKey);
        // console.log(invoice)

        // Check invoice is not paid
        if (invoice.isPaid()) {
            throw new Error('Invoice ' + id + ' already paid');
        }
        invoice.pay()

        await ctx.invoiceList.updateStatement(invoice);
        return invoice.toBuffer();
    }
}

module.exports = SCFContract;
