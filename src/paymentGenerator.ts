import Client from 'mina-signer';

export async function paymentGenerator(
    network: string,
    deployerAccount: string,
    receivers: string[],
    noTransactions: number,
    timeDelayMS: number
) {
    const client = new Client({ network: 'testnet' });
    let sender_public = client.derivePublicKey(deployerAccount)
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
    for (let i = 0; i < noTransactions; i++) {
        const receiver = receivers[Math.floor(Math.random() * receivers.length)]
        console.log("receiver: ", receiver)
        let signedPayment = client.signPayment(
            {
                to: receiver,
                from: sender_public,
                amount: 1500000,
                fee: 2000000000,
                nonce: inferred_nonce + i
            },
            deployerAccount
        );
        const query_pay = `mutation MyMutation {
            sendPayment(input: {fee: 2000000000,  amount: "1500000", to: "${receiver}", from: "${sender_public}", nonce: "${inferred_nonce + i}"}, signature: {field: "${signedPayment.signature.field}", scalar: "${signedPayment.signature.scalar}"})}`
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
            .then(data => console.log("data returned:", data))
        await new Promise(r => setTimeout(r, timeDelayMS));
    }
}
