/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const brcontract = require('./lib/buyRequestContract.js');
const stcontract = require('./lib/statementContract.js');
const incontract = require('./lib/invoiceContract.js');

module.exports.contracts = [brcontract, stcontract, incontract];