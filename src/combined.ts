import { processTransaction } from './paymentGenerator.js';
import { processZKTransaction } from './zkAppGenerator.js';

export async function applyGenerator(
    url: string,
    senderPrivateKey: string,
    receiver: string,
    transactionInterval: string,
    transactionAmount: string,
    transactionFee: string,
    transactionType: string,
    i: number) {
    if (transactionType === 'regular') {
        await processTransaction(
            url,
            senderPrivateKey,
            receiver,
            parseInt(transactionInterval),
            parseFloat(transactionAmount),
            parseFloat(transactionFee)
        );
    }
    else if (transactionType === 'zkApp') {
        await processZKTransaction(
            url,
            senderPrivateKey,
            receiver,
            parseInt(transactionInterval),
            parseFloat(transactionAmount),
            parseFloat(transactionFee))
    }
    else {
        if (i % 2 === 0) {
            await processTransaction(
                url,
                senderPrivateKey,
                receiver,
                parseInt(transactionInterval),
                parseFloat(transactionAmount),
                parseFloat(transactionFee)
            );
        }
        else {
            await processZKTransaction(
                url,
                senderPrivateKey,
                receiver,
                parseInt(transactionInterval),
                parseFloat(transactionAmount),
                parseFloat(transactionFee)
            );
        }
    }
}
