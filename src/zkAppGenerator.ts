import {
    Mina,
    PrivateKey,
    AccountUpdate,
    UInt64,
    PublicKey,
} from 'o1js';

export async function processZKTransaction(
    network: string,
    deployerAccount: string,
    receiver: string,
    timeDelayMS: number,
    amount: number,
    fee: number
) {
    const devNet = Mina.Network(
        network
    );
    Mina.setActiveInstance(devNet);

    let amountToSend = amount * 1000000000;
    let feeToSend = fee * 1000000000;
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

    let memo = 'Test ZKApp to Receiver';

    console.log('amount:', amount);
    const tx = await Mina.transaction({ sender: deployerPubKey, fee: feeToSend, memo: memo, nonce: inferred_nonce }, async () => {
        let accountUpdate;
        accountUpdate = AccountUpdate.createSigned(deployerPubKey);
        accountUpdate.send({ to: toUserPublicKey, amount: UInt64.from(amountToSend) });
    });
    await tx.prove();
    console.log('tx.toPretty() : ' + JSON.stringify(tx.toPretty()));

    const res = await tx.sign([deployerPrivKey]).send();

    console.log('res : ' + JSON.stringify(res));
    const hash = await res.hash;

    if (hash == null) {
        console.log('error sending transaction (see above)');
    }
    await new Promise(r => setTimeout(r, timeDelayMS));
}
