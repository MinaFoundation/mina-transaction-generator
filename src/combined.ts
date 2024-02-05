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
        processTransaction(
            url,
            senderPrivateKey,
            receiver,
            parseInt(transactionInterval),
            parseInt(transactionAmount),
            parseInt(transactionFee)
        );
    }
    else if (transactionType === 'zkApp') {
        processZKTransaction(
            url,
            senderPrivateKey,
            receiver,
            parseInt(transactionInterval),
            parseInt(transactionAmount),
            parseInt(transactionFee))
    }
    else {
        if (i % 2 === 0) {
            processTransaction(
                url,
                senderPrivateKey,
                receiver,
                parseInt(transactionInterval),
                parseInt(transactionAmount),
                parseInt(transactionFee)
            );
        }
        else {
            processZKTransaction(
                url,
                senderPrivateKey,
                receiver,
                parseInt(transactionInterval),
                parseInt(transactionAmount),
                parseInt(transactionFee)
            );
        }
    }
}