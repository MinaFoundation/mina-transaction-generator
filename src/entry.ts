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
    .option('-a, --transaction-amount <amount>', 'amount of Mina to send', '1500000')
    .option('-f, --transaction-fee <fee>', 'transaction fee', '2000000000')
    .action(async (options) => {
        const url = options.url || process.env.MINA_GRAPHQL_URL;
        const senderPrivateKey = options.senderPrivateKey || process.env.SENDER_PRIVATE_KEY;
        const walletList = options.walletList || process.env.RECEPIENT_WALLET_LIST;
        let transactionCount = options.transactionCount;
        let transactionInterval = options.transactionInterval;
        let transactionType = options.transactionType;
        let transactionAmount = options.transactionAmount;
        let transactionFee = options.transactionFee;
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
        let receivers = fs.readFileSync(walletList).toString().split("\n");
        let transactionTypes = ['regular', 'zkApp', 'mixed']
        if (transactionTypes.includes(transactionType)) {
            if (transactionCount === -1) {
                while (true) {
                    let incr = 0;
                    const receiver = receivers[Math.floor(Math.random() * receivers.length)];
                    await applyGenerator(url,
                        senderPrivateKey,
                        receiver,
                        transactionInterval,
                        transactionAmount,
                        transactionFee,
                        transactionType,
                        incr);
                    incr++;
                }
            }
            else {
                for (let i = 0; i < transactionCount; i++) {
                    const receiver = receivers[Math.floor(Math.random() * receivers.length)];
                    await applyGenerator(url,
                        senderPrivateKey,
                        receiver,
                        transactionInterval,
                        transactionAmount,
                        transactionFee,
                        transactionType,
                        i);
                }
            }
        }
        else {
            console.log('Invalid transaction type');
            return;
        }
    }
    )
    .parse(argv);