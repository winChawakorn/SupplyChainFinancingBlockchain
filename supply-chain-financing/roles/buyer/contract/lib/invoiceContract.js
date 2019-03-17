/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const Invoice = require('./invoice.js');
const InvoiceList = require('./invoiceList.js');

const BuyRequest = require('./buyRequest.js')

/**
 * A custom context provides easy access to list of all buy request
 */
class InvoiceContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.invoiceList = new InvoiceList(this);
    }

}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class InvoiceContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.papernet.commercialpaper');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new InvoiceContext();
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
    async issueInvoice(ctx, id, buyer, supplier, funder, amount) {

        // let buyRequestKey = BuyRequest.makeKey([id]);

        // let buyRequest = await ctx.buyRequestList.getInvoice(buyRequestKey);

        // let buyRequest = await ctx.buyRequestList.getBuyRequest(buyRequestKey);

        // create an instance of the invoice
        let invoice = Invoice.createInstance(id, buyer, supplier, funder, amount, amount * 400);

        // Add the paper to the list of all similar buy request in the ledger world state
        await ctx.invoiceList.addInvoice(invoice);

        // // Must return a serialized paper to caller of smart contract
        return invoice.toBuffer();
    }

    async payInvoice(ctx, id, buyer, supplier, funder, product, amount, price) {
        // let invoiceKey = Invoice.makeKey([id]);

        // let invoice = await ctx.invoiceList.getInvoice(invoiceKey);

        // Check invoice is not REDEEMED
        // if (invoice.isPaid()) {
        // throw new Error('Payment ' + id + ' already paid');
        // }
        // invoice.pay()

        // await ctx.invoiceList.updateInvoice(invoice);
        // return invoice.toBuffer();
        return { id, buyer, supplier, funder, product, amount, price }
    }
}

module.exports = InvoiceContract;
