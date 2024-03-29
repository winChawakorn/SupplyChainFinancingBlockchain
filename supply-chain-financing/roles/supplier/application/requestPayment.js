/*
SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access PaperNet network
 * 4. Construct request to issue commercial paper
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

        // Get addressability to commercial paper contract
        console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('scfContract', 'org.papernet.commercialpaper');

        // redeem commercial paper
        console.log('Submit requestPayment to transaction.');

        const payResponse = await contract.submitTransaction('requestPayment', '0001');

        // process response
        console.log('Process requestPayment transaction response.');

        let requestPayment = Statement.fromBuffer(payResponse);

        // console.log(`${requestPayment.buyer} pay to funder : ${requestPayment.id} successfully requestPayment with ${requestPayment.price} to ${requestPayment.funder}`);
        console.log('----------------------');
        console.log('function: requestPayment');
        const keys = Object.keys(requestPayment);
        keys.forEach(key => {
            console.log(`${key}:`, requestPayment[key]);
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

    console.log('pay program complete.');

}).catch((e) => {

    console.log('pay program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});
