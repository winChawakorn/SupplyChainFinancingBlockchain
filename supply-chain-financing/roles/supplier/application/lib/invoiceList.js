/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const Invoice = require('./invoice.js');

class InvoiceList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.papernet.commercialpaperlist');
        this.use(Invoice);
    }

    async addInvoice(invoice) {
        return this.addState(invoice);
    }

    async getInvoice(invoiceKey) {
        return this.getState(invoiceKey);
    }

    async updateInvoice(invoice) {
        return this.updateState(invoice);
    }
}


module.exports = InvoiceList;