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

class SCFContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.papernet.commercialpaper');
    }

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
        let buyRequest = BuyRequest.createInstance(id, buyer, supplier, product, amount);
        await ctx.buyRequestList.addBuyRequest(buyRequest);
        return buyRequest.toBuffer();
    }

    async issueInvoice(ctx, id) {
        let buyRequestKey = Invoice.makeKey(['0001']);
        let buyRequest = await ctx.buyRequestList.getBuyRequest(buyRequestKey);
        let invoice = Invoice.createInstance(id, buyRequest.buyer, buyRequest.supplier, 'Funder', buyRequest.product, buyRequest.amount, '40000');
        await ctx.invoiceList.addInvoice(invoice);
        return invoice.toBuffer();
    }

    async approve(ctx, id) {
        let invoiceKey = Invoice.makeKey(['0001']);
        let invoice = await ctx.invoiceList.getInvoice(invoiceKey);
        let statement = Statement.createInstance(id, invoice.funder, invoice.buyer, invoice.supplier, invoice.product, invoice.amount, invoice.price, '2019-05-20');
        await ctx.statementList.addStatement(statement);
        return statement.toBuffer();
    }

    async requestPayment(ctx) {
        let invoiceKey = Invoice.makeKey(['0001']);
        let invoice = await ctx.invoiceList.getInvoice(invoiceKey);
        if (invoice.isPaid()) {
            throw new Error('Invoice ' + id + ' already paid');
        }
        invoice.pay()
        await ctx.invoiceList.updateInvoice(invoice);
        return invoice.toBuffer();
    }

    async pay(ctx, id) {
        let statementKey = Statement.makeKey(['0001']);
        let statement = await ctx.statementList.getStatement(statementKey);
        if (statement.isPaid()) {
            throw new Error('Payment ' + id + ' already paid');
        }
        statement.pay()

        await ctx.statementList.updateStatement(statement);
        return statement.toBuffer();
    }
}

module.exports = SCFContract;
