/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const BuyRequest = require('./buyRequest.js');

class BuyRequestList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.papernet.commercialpaperlist.buyreq');
        this.use(BuyRequest);
    }

    async addBuyRequest(buyRequest) {
        return this.addState(buyRequest);
    }

    async getBuyRequest(buyRequestKey) {
        return this.getState(buyRequestKey);
    }

    async updateBuyRequest(buyRequest) {
        return this.updateState(buyRequest);
    }
}


module.exports = BuyRequestList;