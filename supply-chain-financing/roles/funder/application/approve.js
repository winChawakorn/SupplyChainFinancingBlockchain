/*
SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access PaperNet network
 * 4. Construct request to issue statement
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const Statement = require('../contract/lib/statement.js');

// A wallet stores a collection of identities for use
//const wallet = new FileSystemWallet('../user/isabella/wallet');
const wallet = new FileSystemWallet('../identity/user/buyer/wallet');

// Main program function
async function main() {

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        const userName = 'Admin@org1.example.com';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: false, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to statement contract
        console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('scfContract', 'org.papernet.commercialpaper');

        // approve statement
        console.log('Submit statement approve transaction.');
        // id, funder, buyer, supplier, product, amount, price, dueDate
        const approveResponse = await contract.submitTransaction('approve', '0001');

        // process response
        console.log('Process approve transaction response.');

        let statement = Statement.fromBuffer(approveResponse);

        // console.log(`${statement.funder} statement : ${statement.id} successfully send to ${statement.buyer}`);
        console.log('----------------------');
        console.log('function: approve');
        const keys = Object.keys(statement);
        keys.forEach(key => {
            console.log(`${key}:`, statement[key]);
        });
        console.log('----------------------');
        console.log('Transaction complete.');

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
main().then(() => {

    console.log('Issue program complete.');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});