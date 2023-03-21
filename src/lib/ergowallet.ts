import { OutputBuilder, TransactionBuilder } from "@fleet-sdk/core";
import { erg_wallet_tokens, all_tokens } from "../stores/store";

export async function get_utxos() {
    return await ergo.get_utxos();
}

export async function get_addresses() {
    return await [...await ergo.get_unused_addresses(), ... await ergo.get_used_addresses()];
}

async function getExplorerHeight() {
    let res = await fetch('https://api.ergoplatform.com/api/v1/networkState');
    const data = await res.json()
    return data.height;
}

export async function createTx(amount) {
    //const nautilusConnected = await ergoConnector.nautilus.connect();
    const creationHeight = await getExplorerHeight();
    const inputs = await ergo.get_utxos();
    const changeAddress = await ergo.get_change_address();

    const unsignedTransaction = new TransactionBuilder(creationHeight)
        .from(inputs)
        .to(
            new OutputBuilder(
                BigInt(amount),
                "9gdLSKyzeyB3qQ1LWidALiyyfvQwFCZtcozXqjQ9hRkfGwPFCbR"
            )
        )
        .sendChangeTo(changeAddress)
        .payMinFee()
        .build()
        .toEIP12Object();
    return unsignedTransaction;
}

function stringErgToStringNanoErg(strErg) {
    const parts = strErg.split('.')
    const res = ''
    if (parts.length == 2) {
        return parts[0] + parts[1] + (new Array(9 - parts[1].length)).fill().map(x => "0").join("")
    } else {
        return parts[0] + "000000000"
    }

}

export async function createBreedingTxWithTribute(scrollId, token1Id, trubuteErg) {
    const realErg = stringErgToStringNanoErg(trubuteErg)

    const output = new OutputBuilder(
        BigInt(30000000) + BigInt(realErg),
        "9gdLSKyzeyB3qQ1LWidALiyyfvQwFCZtcozXqjQ9hRkfGwPFCbR"
    ).addTokens([{
        tokenId: scrollId,
        amount: "1"
    }, {
        tokenId: token1Id,
        amount: "1"
    }]);

    return signedTxByOutput(output)
}

export async function createBreedingTx(scrollId, token1Id, token2Id) {
    const output = new OutputBuilder(
        BigInt(30000000),
        "9gdLSKyzeyB3qQ1LWidALiyyfvQwFCZtcozXqjQ9hRkfGwPFCbR"
    ).addTokens([{
        tokenId: scrollId,
        amount: "1"
    }, {
        tokenId: token1Id,
        amount: "1"
    }, {
        tokenId: token2Id,
        amount: "1",
    }]);

    return signedTxByOutput(output)
}

async function  signedTxByOutput(output) {
    await connectWallet();
    const creationHeight = await getExplorerHeight();
    const inputs = await ergo.get_utxos();
    const changeAddress = await ergo.get_change_address();

    const unsignedTransaction = new TransactionBuilder(creationHeight)
        .from(inputs) // add inputs
        .to(output)
        .sendChangeTo(changeAddress) // set change address
        .payMinFee() // set fee
        .build()
        .toEIP12Object(); // build!

    const signedTx = await ergo.sign_tx(unsignedTransaction);
    return signedTx
}

export async function signTx(unsignedTx) {
    return await ergo.sign_tx(unsignedTx);
}


export async function submitTx(signedTx) {
    return await ergo.submit_tx(signedTx);
}

export async function connectWallet() {

    if (!window.ergoConnector) {
        return { error: "Please install Nautilus Wallet" };
    }

    if (window.ergo) {
        return true;
    }

    const nautilusConnected = await ergoConnector.nautilus.connect();

    if (nautilusConnected) {
        return true;
    } else {
        return { error: "Please connect Nautilus" };
    }
}

export async function loadErgoWalletTokens(allTokens) {
    const inputs = await get_utxos()
    const walletTokenIds = inputs.flatMap(box => box.assets.map(a => a.tokenId))
    const ownedProjectTokens = allTokens.filter(token => walletTokenIds.some(tId => tId == token.token_id))
    erg_wallet_tokens.set(ownedProjectTokens)
}

export async function signTxCreatureToRitual(ritualId, creatureTokenId) {
    console.log(`send creature ${creatureTokenId} to ritual ${ritualId}`)
    
    const output = new OutputBuilder(
        BigInt(30000000) + BigInt(ritualId),
        "9gdLSKyzeyB3qQ1LWidALiyyfvQwFCZtcozXqjQ9hRkfGwPFCbR"
    ).addTokens([{
        tokenId: creatureTokenId,
        amount: "1"
    }]);

    return await signedTxByOutput(output);
}