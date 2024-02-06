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

### Running it with docker

- Make sure you have access to  AWS ECR repository: 673156464838.dkr.ecr.us-west-2.amazonaws.com/mina-transactions-generator
- Set bellow documented env variables.
- Mount a wallet list to a container.

**Environmental variables**
| Name                    | Description                                         | Value |
| ----------------------- | --------------------------------------------------- | ----- |
| `MINA_GRAPHQL_URL`      | A Mina node graphql endpoint so connect to          | `""` |
| `SENDER_PRIVATE_KEY`    | Private key string of a sender.                     | `""` |
| `RECEPIENT_WALLET_LIST` | A file with a list of receiver public keys.         | `""` |
| `TRANSACTION_TYPE`      | A type of transaction: `regular` or `zkApp`.        | `regular` |
| `TRANSACTION_COUNT`     | How many transactions to send(`-1` for unlimited).  | `5` |
| `TRANSACTION_INTERVAL`  | How often execute the transactions(in miliseconds). | `5000` |
| `TRANSACTION_AMOUNT`    | Amount(per transaction) to send.                    | `2` |
| `TRANSACTION_FEE`       | Transaction fee.                                    | `0.1` |

1. Create a `txt` file with a list of public keys or receiving accounts.
  ```bash
  echo "B62..." > walletList.txt
  ```
2. Launch docker mounting that list as well as pointing to it.
  ```bash 
  $ docker run -v ./walletList.txt:/app/walletList.txt -e MINA_GRAPHQL_URL='https://localhost:3085/graphql' -e SENDER_PRIVATE_KEY='EK...' -e RECEPIENT_WALLET_LIST='/app/walletList.txt' minan-transactions-generator:0.1.3
  ```
  
### Running it with helm

It only makes sence to run it as a helm chart if you want a process to continuously send transactions.
Therefore `--transaction-count` is always set to `-1`.
For instructions refer to [mina-transactions-generator](https://github.com/MinaFoundation/helm-charts/tree/main/mina-transactions-generator) helm chart.
