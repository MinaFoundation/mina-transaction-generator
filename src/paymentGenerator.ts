import Client from 'mina-signer';

export async function processTransaction(
    network: string,
    deployerAccount: string,
    receiver: string,
    timeDelayMS: number,
    amount: number,
    fee: number,
    networkProfile: 'mainnet' | 'testnet'
) {
    const client = new Client({ network: networkProfile });
    let sender_public = client.derivePublicKey(deployerAccount)
    console.log("receiver: ", receiver);
    let amountToSend = amount * 1000000000;
    let feeToSend = fee * 1000000000;
    const query = `query MyQuery {
        account(publicKey: "${sender_public}") {
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
    let signedPayment = client.signPayment(
        {
            to: receiver,
            from: sender_public,
            amount: amountToSend,
            fee: feeToSend,
            nonce: inferred_nonce
        },
        deployerAccount
    );
    const query_pay = `mutation MyMutation {
        sendPayment(input: {fee: "${feeToSend}",  amount: "${amountToSend}", to: "${receiver}", from: "${sender_public}", nonce: "${inferred_nonce}"}, signature: {field: "${signedPayment.signature.field}", scalar: "${signedPayment.signature.scalar}"})}`;
    await fetch(network, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: query_pay
        }),
    })
        .then(r => r.json())
        .then(data => console.log("data returned:", data));
    await new Promise(r => setTimeout(r, timeDelayMS));
}
