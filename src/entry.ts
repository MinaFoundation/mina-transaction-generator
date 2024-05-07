import { Command } from 'commander';
import * as fs from 'fs';
import { argv } from 'process';
import { applyGenerator } from './combined.js';

const program = new Command();
program
    .description('CLI to generate Mina transactions (regular and zkApp)')
    .option('-u, --url <url>', 'graphql endpoint url to connect to')
    .option('-s, --sender-private-key <private-key>', 'private key of a sender')
    .option('-w, --wallet-list <path>', 'path to a file with a recepient wallet list')
    .option('-c, --transaction-count <number>', 'number of transactions to send', '5')
    .option('-i, --transaction-interval <delay>', 'time delay in ms between transactions', '5000')
    .option('-t, --transaction-type <type>', 'transaction type (zkApp or regular)', 'regular')
    .option('-a, --transaction-amount <amount>', 'amount of Mina to send', '2')
    .option('-f, --transaction-fee <fee>', 'transaction fee', '0.1')
    .option('-n, --network-profile <profile>', 'use network profile', 'testnet')
    .action(async (options) => {
        const url = options.url || process.env.MINA_GRAPHQL_URL;
        const senderPrivateKey = options.senderPrivateKey || process.env.SENDER_PRIVATE_KEY;
        const walletList = options.walletList || process.env.RECEPIENT_WALLET_LIST;
        let transactionCount = options.transactionCount;
        let transactionInterval = options.transactionInterval;
        let transactionType = options.transactionType;
        let transactionAmount = options.transactionAmount;
        let transactionFee = options.transactionFee;
        let networkProfile = options.networkProfile;
        if (!url) {
            console.error("url is not specified or MINA_GRAPHQL_URL is not set.");
            process.exit(1);
        }
        if (!senderPrivateKey) {
            console.error("Sender private key is not specified.");
            process.exit(1);
        }
        if (!walletList) {
            console.error("Path to a recepient wallet list is not specified.");
            process.exit(1);
        }
        if (process.env.TRANSACTION_COUNT) {
            transactionCount = process.env.TRANSACTION_COUNT
        }
        if (process.env.TRANSACTION_INTERVAL) {
            transactionInterval = process.env.TRANSACTION_INTERVAL
        }
        if (process.env.TRANSACTION_TYPE) {
            transactionType = process.env.TRANSACTION_TYPE
        }
        if (process.env.TRANSACTION_AMOUNT) {
            transactionAmount = process.env.TRANSACTION_AMOUNT
        }
        if (process.env.TRANSACTION_FEE) {
            transactionFee = process.env.TRANSACTION_FEE
        }
        if (process.env.NETWORK_PROFILE) {
            networkProfile = process.env.NETWORK_PROFILE
        }
        let networkProfileTypes = ['testnet', 'mainnet'];
        if (!networkProfileTypes.includes(networkProfile)) {
            console.log('Invalid network profile');
            return;
        }
        let receivers = fs.readFileSync(walletList).toString().split("\n");
        let transactionTypes = ['regular', 'zkApp', 'mixed']
        if (transactionTypes.includes(transactionType)) {
            let incr = 0;
            while (incr != transactionCount) {
                const receiver = receivers[Math.floor(Math.random() * receivers.length)];
                await applyGenerator(url,
                    senderPrivateKey,
                    receiver,
                    transactionInterval,
                    transactionAmount,
                    transactionFee,
                    transactionType,
                    networkProfile,
                    incr);
                incr++
            }
        }
        else {
            console.log('Invalid transaction type');
            return;
        }
    }
    )
    .parse(argv);
