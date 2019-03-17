/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const Statement = require('./statement.js');
const StatementList = require('./statementList.js');

const Invoice = require('./invoice.js');


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

  async issueStatementContract(ctx, id, funder, buyer, supplier, product, amount, price, dueDate) {
    // let invoiceKey = Invoice.makeKey([invoiceId]);
    // let invoice = await ctx.invoiceList.getInvoice(invoiceKey);
    // create an instance of the statement
    // id, funder, buyer, supplier, product, amount, price, dueDate
    console.log('====== issue in statementContract')
    let statement = Statement.createInstance(id, funder, buyer, supplier, product, amount, price, dueDate);

    // Add the paper to the list of all similar buy request in the ledger world state
    await ctx.statementList.addStatement(statement);

    // Must return a serialized paper to caller of smart contract
    return statement.toBuffer();
  }

  async payStatement(ctx, id, funder, buyer, supplier, product, amount, price, dueDate) {

    // let statementKey = Statement.makeKey([id]);

    // let statement = await ctx.statementList.getStatement(statementKey);

    // Check statement is not REDEEMED
    // if (statement.isPaid()) {
    //   throw new Error('Payment ' + id + ' already paid');
    // }
    // statement.pay()

    // await ctx.statementList.updateStatement(statement);
    return { id, funder, buyer, supplier, product, amount, price, dueDate };
  }

}

module.exports = StatementContract;
