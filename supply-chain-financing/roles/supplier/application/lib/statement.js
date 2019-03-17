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
class Statement extends State {

  constructor(obj) {
    super(Statement.getClass(), [obj.id]);
    Object.assign(this, obj);
    this.pay = false;
  }

  pay() {
    this.pay = true;
  }

  isPaid() {
    return this.pay
  }

  static fromBuffer(buffer) {
    return Statement.deserialize(Buffer.from(JSON.parse(buffer)));
  }

  toBuffer() {
    return Buffer.from(JSON.stringify(this));
  }

  /**
   * Deserialize a state data to commercial paper
   * @param {Buffer} data to form back into the object
   */
  static deserialize(data) {
    return State.deserializeClass(data, Statement);
  }

  /**
   * Factory method to create a commercial paper object
   */
  static createInstance(id, funder, buyer, supplier, product, amount, price, dueDate) {
    return new Statement({ id, funder, buyer, supplier, product, amount, price, dueDate });
  }

  static getClass() {
    return 'org.papernet.commercialpaper';
  }
}

module.exports = Statement;
