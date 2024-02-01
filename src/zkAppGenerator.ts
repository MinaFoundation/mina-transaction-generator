import {
    Mina,
    PrivateKey,
    AccountUpdate,
    UInt64,
    PublicKey,
} from 'o1js';

export async function zkAppGenerator(
    network: string,
    deployerAccount: string,
    receivers: string[],
    noTransactions: number,
    timeDelayMS: number
) {
    if (noTransactions === -1) {
        while (true) {
            const receiver = receivers[Math.floor(Math.random() * receivers.length)];
            await processZKTransaction(network, deployerAccount, receiver, timeDelayMS);
        }
    } else {
        for (let i = 0; i < noTransactions; i++) {
            const receiver = receivers[Math.floor(Math.random() * receivers.length)];
            await processZKTransaction(network, deployerAccount, receiver, timeDelayMS);
        }
    }
}

async function processZKTransaction(
    network: string,
    deployerAccount: string,
    receiver: string,
    timeDelayMS: number
) {
    const devNet = Mina.Network(
        network
    );
    Mina.setActiveInstance(devNet);

    const deployerPrivKey = PrivateKey.fromBase58(deployerAccount);
    const deployerPubKey = deployerPrivKey.toPublicKey();
    console.log('Sender public key:', deployerPubKey.toBase58().toString());
    const query = `query MyQuery {
        account(publicKey: "${deployerPubKey.toBase58().toString()}") {
          inferredNonce
        }
      }`
    let response = await fetch(network, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: query
        }),
    })
    let inferred_nonce = parseInt((await response.json()).data.account.inferredNonce)

    const toUserPublicKey = PublicKey.fromBase58(receiver);
    console.log('Receiver public key:', toUserPublicKey.toBase58().toString());

    const MINA = 1e9;
    const amount = 1 * MINA;

    let memo = 'Test ZKApp to Receiver';
    const transactionFee = 2 * MINA;

    console.log('amount:', amount);
    const tx = await Mina.transaction({ sender: deployerPubKey, fee: transactionFee, memo: memo, nonce: inferred_nonce }, () => {
        let accountUpdate;
        accountUpdate = AccountUpdate.createSigned(deployerPubKey);
        accountUpdate.send({ to: toUserPublicKey, amount: UInt64.from(amount) });
    });
    await tx.prove();
    console.log('tx.toPretty() : ' + JSON.stringify(tx.toPretty()));

    const res = await tx.sign([deployerPrivKey]).send();

    console.log('res : ' + JSON.stringify(res));
    const hash = await res.hash();

    if (hash == null) {
        console.log('error sending transaction (see above)');
    }
    await new Promise(r => setTimeout(r, timeDelayMS));
}
