/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class Invoice extends State {

    constructor(obj) {
        super(Invoice.getClass(), [obj.id]);
        Object.assign(this, obj);
    }

    static fromBuffer(buffer) {
        console.log('buffer is')
        console.log(Buffer.from(JSON.parse(buffer)).toString('utf-8'))

        return Invoice.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    pay() {
        this.pay = true;
    }

    isPaid() {
        return this.pay
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Invoice);
    }

    /**
     * Factory method to create a commercial paper object
     */

    static createInstance(id, buyer, supplier, funder, product, amount, price) {
        return new Invoice({ id, buyer, supplier, funder, product, amount, price });
    }

    static getClass() {
        return 'org.papernet.commercialpaper';
    }
}

module.exports = Invoice;
