# mina-transactions-generator

A tool to generate transactions for Mina networks

## Overview

`mina-transactions-generator` is a TypeScript based CLI application that can send out a number of transactions to a Mina network in a given interval.

### Prerequisites

You will need:

- Senders private key in a specific format. You can use `mina-daemon` to get it:
  ```bash
  mina advanced dump-keypair --privkey-path <path-to-private-key>
  ```
- A list of mina wallet public addresses where to send transactions to.
- A graphql endpoint url of a Mina node.

To run this tool you have the following options.

- Run it locally on your computer(requires `node`)
- Run it using docker(requires docker)
- Trigger it using helm chart. See [Running using helm chart](#running-using-helm-chart)

## Getting started

### Running it locally

Make sure you have `node` installed on your system. Git clone [mina-transactions-generator](https://github.com/MinaFoundation/mina-transactions-generator.git) and `cd` to it.

1. Install the dependencies
  ```bash
  $ npm install
  $ npm run build
  ```
2. Run the script with `--help` for available options.
  ```bash
  $ node build/entry.js --help
  ```
3. Run it
  ```bash
  $ node build/entry.js --url <url> --sender-private-key <private-key> --wallet-list <path> --transaction-type <type>
  ```
  > **Note:** see `--help` for `--transaction-type`, `--transaction-count`, `--transaction-interval`

### Running it using docker

Make sure you have access to  AWS ECR repository: 673156464838.dkr.ecr.us-west-2.amazonaws.com/mina-transactions-generator

Following can be configured 
- MINA_GRAPHQL_URL
- SENDER_PRIVATE_KEY
- RECEPIENT_WALLET_LIST
- TRANSACTION_TYPE
- TRANSACTION_COUNT
- TRANSACTION_INTERVAL
