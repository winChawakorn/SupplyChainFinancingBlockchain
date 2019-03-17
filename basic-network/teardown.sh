#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -e

# remove chaincode docker images
docker rm -f $(docker ps -aq)
docker rmi $(docker images 'dev-*' -q)

# Shut down the Docker containers for the system tests.
docker-compose -f docker-compose.yml kill && docker-compose -f docker-compose.yml down --remove-orphans -v

# remove the local state
rm -f ~/.hfc-key-store/*

# Remove everythinggggggggggg
docker rm -f logspout
docker rm -f cliBuyer
docker rm -f cliFunder
docker rm -f cliSupplier

docker-compose -f ../supply-chain-financing/roles/buyer/configuration/cli/docker-compose.yml down --remove-orphans -v
docker-compose -f ../supply-chain-financing/roles/supplier/configuration/cli/docker-compose.yml down --remove-orphans -v
docker-compose -f ../supply-chain-financing/roles/funder/configuration/cli/docker-compose.yml down --remove-orphans -v

# remove chaincode docker images
docker rm -f $(docker ps -aq)
docker rmi $(docker images 'dev-*' -q)

# Your system is now clean
