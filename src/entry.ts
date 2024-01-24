import { Command } from 'commander';
import * as fs from 'fs';
import { paymentGenerator } from './paymentGenerator.js';
import { zkAppGenerator } from './zkAppGenerator.js';
import { argv } from 'process';

const program = new Command();
program
    .description('CLI to generate Mina transactions (regular and zkApp)')
    .requiredOption('-n, --network <path>', 'network to connect to')
    .requiredOption('-s, --sender-private-key <private-key>', 'private key of sender')
    .requiredOption('-w, --wallet-list <path>', 'url to wallet list')
    .option('-c, --transaction-count <number>', 'number of transactions to send', '5')
    .option('-i, --transaction-interval <delay>', 'time delay in ms between transactions', '5000')
    .option('-t, --transaction-type <type>', 'transaction type (zkApp or regular)', 'regular')
    .option('-p, --password-for-sender-private-key <password>', 'password for the key file')
    .option('-k, --path-to-sender-private-key <path>', 'path to the key file')
    .action((options) => {
        let receivers = fs.readFileSync(options.walletList).toString().split("\n");
        if (options.transactionType == 'regular') {
            if (options.passwordForSenderPrivateKey == undefined || options.pathToSenderPrivateKey == undefined) {
                console.log('Please provide password and path for key file');
                return;
            }

            paymentGenerator(
                options.network,
                options.senderPrivateKey,
                options.passwordForSenderPrivateKey,
                options.pathToSenderPrivateKey,
                receivers,
                parseInt(options.transactionCount),
                parseInt(options.transactionInterval))
                ;
        }
        else if (options.transactionType == 'zkApp') {
            zkAppGenerator(
                options.network,
                options.senderPrivateKey,
                receivers,
                options.transactionCount,
                options.transactionInterval);
        }
        else {
            console.log('Invalid transaction type');
            return;
        }
    })
    .parse(argv);