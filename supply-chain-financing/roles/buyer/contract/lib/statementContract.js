/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const Statement = require('./statement.js');
const StatementList = require('./statementlist.js');

/**
 * A custom context provides easy access to list of all commercial statements
 */
class StatementContext extends Context {

  constructor() {
    super();
    // All statements are held in a list of statements
    this.statementList = new StatementList(this);
  }

}

/**
 * Define commercial statement smart contract by extending Fabric Contract class
 *
 */
class StatementContract extends Contract {

  constructor() {
    // Unique namespace when multiple contracts per chaincode file
    super('org.statementnet.commercialstatement');
  }

  /**
   * Define a custom context for commercial statement
  */
  createContext() {
    return new StatementContext();
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

  async issue(ctx, id, funder, buyer, supplier, product, amount, price) {
    // create an instance of the statement
    let statement = BuyRequest.createInstance(id, funder, buyer, supplier, product, amount, price);

    // Add the paper to the list of all similar buy request in the ledger world state
    await ctx.statementList.addBuyRequest(statement);

    // Must return a serialized paper to caller of smart contract
    return statement.toBuffer();
  }

  async pay(ctx, id) {

    let statementKey = Statement.makeKey([id]);

    let statement = await ctx.statementList.getStatement(statementKey);

    // Check statement is not REDEEMED
    if (statement.isPaid()) {
      throw new Error('Payment ' + id + ' already paid');
    }

    await ctx.statementList.updateStatement(statement);
    return statement.toBuffer();
  }

}

module.exports = StatementContract;
