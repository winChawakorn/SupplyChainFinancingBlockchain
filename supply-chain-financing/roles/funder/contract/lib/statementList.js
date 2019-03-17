/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const Statement = require('./statement.js');

class StatementList extends StateList {

  constructor(ctx) {
    super(ctx, 'org.papernet.commercialpaperlist');
    this.use(Statement);
  }

  async addStatement(statement) {
    return this.addState(statement);
  }

  async getStatement(statementKey) {
    return this.getState(statementKey);
  }

  async updateStatement(statement) {
    return this.updateState(statement);
  }
}


module.exports = StatementList;