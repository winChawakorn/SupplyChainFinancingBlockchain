const { Contract, Context } = require('fabric-contract-api')

const BuyRequestList = require('./buyRequestList.js')

const InvoiceList = require('./invoiceList.js')
const StatementList = require('./statementList.js')

class GlobalContext extends Context {
    constructor() {
        super()
        // All papers are held in a list of papers
        this.buyRequestList = new BuyRequestList(this)
        this.invoiceList = new InvoiceList(this)
        this.statementList = new StatementList(this)
    }
}

module.exports = GlobalContext;
