import { PrivateKey } from "o1js";

export async function paymentGenerator(
    network: string,
    deployerAccount: string,
    password: string,
    path: string, receivers: string[],
    noTransactions: number,
    timeDelayMS: number
) {
    const deployer_public_key = PrivateKey.fromBase58(deployerAccount).toPublicKey().toBase58().toString();
    const query_import = `mutation MyMutation {
        importAccount(password: "${password}", path: "${path}")
      }`
    await fetch(network, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: query_import
        }),
    })
        .then(r => r.json())
        .then(data => console.log("data returned:", data))
    const query_unlock = `mutation MyMutation {
        unlockAccount(input: {publicKey: "${deployer_public_key}", password: "${password}"})
      }`
    await fetch(network, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: query_unlock
        }),
    })
        .then(r => r.json())
        .then(data => console.log("data returned:", data))

    for (let i = 0; i < noTransactions; i++) {
        const receiver = receivers[Math.floor(Math.random() * receivers.length)]
        console.log("receiver: ", receiver)
        const query_pay = `mutation MyMutation {
            sendPayment(input: {fee: 2000000000, amount: "1500000", to: "${receiver}", from: "${deployer_public_key}", memo: "test"})
          }`
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
