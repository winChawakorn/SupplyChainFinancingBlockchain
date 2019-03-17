./teardown.sh
./start.sh

docker-compose -f ../supply-chain-financing/roles/buyer/configuration/cli/docker-compose.yml up -d
# docker-compose -f ../supply-chain-financing/roles/supplier/configuration/cli/docker-compose.yml up -d
# docker-compose -f ../supply-chain-financing/roles/funder/configuration/cli/docker-compose.yml up -d

ttab '../supply-chain-financing/roles/buyer/configuration/cli/monitordocker.sh net_basic'
sleep 5


# install buyRequestContract
docker exec cliBuyer peer chaincode install -n scfContract -v 0 -p /opt/gopath/src/github.com/contract -l node
docker exec cliBuyer peer chaincode instantiate -n scfContract -v 0 -l node -c '{"Args":["org.papernet.commercialpaper:instantiate"]}' -C mychannel -P "AND ('Org1MSP.member')"

# # install statementContract
# docker exec cliBuyer peer chaincode install -n statementContract -v 0 -p /opt/gopath/src/github.com/contract -l node
# docker exec cliBuyer peer chaincode instantiate -n statementContract -v 0 -l node -c '{"Args":["org.papernet.commercialpaper:instantiate"]}' -C mychannel -P "AND ('Org1MSP.member')"

# # # install invoiceContract
# docker exec cliBuyer peer chaincode install -n invoiceContract -v 0 -p /opt/gopath/src/github.com/contract -l node
# docker exec cliBuyer peer chaincode instantiate -n invoiceContract -v 0 -l node -c '{"Args":["org.papernet.commercialpaper:instantiate"]}' -C mychannel -P "AND ('Org1MSP.member')"

../supply-chain-financing/roles/buyer/configuration/cli/monitordocker.sh net_basic
