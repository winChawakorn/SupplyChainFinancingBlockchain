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
class BuyRequest extends State {

    constructor(obj) {
        super(BuyRequest.getClass(), [obj.buyer, obj.id]);
        Object.assign(this, obj);
    }

    static fromBuffer(buffer) {
        console.log('buffer is')
        console.log(Buffer.from(JSON.parse(buffer)).toString('utf-8'))
        
        return BuyRequest.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, BuyRequest);
    }

    /**
     * Factory method to create a commercial paper object
     */
    
    static createInstance(id, buyer, supplier, product, amount) {
        return new BuyRequest({ id, buyer, supplier, product, amount });
    }

    static getClass() {
        return 'org.papernet.commercialpaper';
    }
}

module.exports = BuyRequest;
