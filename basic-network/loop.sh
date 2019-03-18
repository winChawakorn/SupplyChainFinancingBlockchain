while true;
do
  cd ../supply-chain-financing/roles/buyer/application
  node issueBuyRequest.js
  cd -
  cd ../supply-chain-financing/roles/supplier/application
  node issueInvoice.js
  cd -
  cd ../supply-chain-financing/roles/funder/application
  node approve.js
  cd -
  cd ../supply-chain-financing/roles/supplier/application
  node requestPayment.js
  cd -
  cd ../supply-chain-financing/roles/buyer/application
  node pay.js
  cd -
done