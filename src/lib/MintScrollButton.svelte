<script>
    import { OutputBuilder, TransactionBuilder } from "@fleet-sdk/core";
    import { mint } from "../stores/mint";
    import { minted_scrolls_count, min_mint_price } from "../stores/store";
    import { connectWallet, createTx, signTx } from "./ergowallet";

    let signing_state = "connecting ...";
    let price_increased_error = false;
    let tx_error = false;

    async function pressMint(e) {
        wallet_is_signing = true;
        try {
            await attemptMint();
        } finally {
            wallet_is_signing = false;
            signing_state = "connecting ...";
        }
    }

    async function attemptMint() {
        mintErrorText = "";
        if ($min_mint_price == "0") {
            return;
        }

        const connectRes = await connectWallet();
        if (connectRes.error) {
            mintErrorText = connectRes.error;
            return;
        }

        signing_state = "signing ...";
        const mintAttemptPriceInNanoErg = $min_mint_price;
        const unsignedTx = await createTx(mintAttemptPriceInNanoErg);
        const signedTx = await signTx(unsignedTx);

        if (mintAttemptPriceInNanoErg == $min_mint_price) {
            try {
                signing_state = "sending transaction...";
                const res = await ergo.submit_tx(signedTx);
                if (res.status == 200) {
                    mint.update((s) => {
                        s.userJustMinted = true;
                        return s;
                    });
                }
            } catch (e) {
                console.error(e);
                tx_error = true;
                setTimeout(() => {
                    tx_error = false;
                }, 3000);
            }
        } else {
            price_increased_error = true;
            setTimeout(() => {
                price_increased_error = false;
            }, 3000);
        }
    }

    let mintErrorText = "";
    let wallet_is_signing = false;
</script>

{#if $minted_scrolls_count == 666}
    <img src="/soldout.png" alt="" style="width: 200px; margin-top: -69px;" />
{:else if $minted_scrolls_count}
    <div>
        <button
            disabled={wallet_is_signing || price_increased_error || tx_error}
            class:mintbtn={!(
                wallet_is_signing ||
                price_increased_error ||
                tx_error
            )}
            class:shake={price_increased_error || tx_error}
            class="text-md font-semibold outline-1 rounded-md py-2 px-3 flex items-center space-x-2 dark:highlight-white/5 hover:bg-slate-400/20"
            style="border: 2px solid; height:fit-content"
            on:click={pressMint}
        >
            {#if wallet_is_signing}
                <span class="loading mr-2" /> {signing_state}
            {:else if price_increased_error}
                &gt;_&lt; price increased, try again!
            {:else if tx_error}
                &gt;_&lt; tx failed, try again!
            {:else}
                mint ritual scroll {$min_mint_price / Math.pow(10, 9)} Σ
            {/if}
        </button>
        <div class="text-xs text-center mt-1">
            {$minted_scrolls_count}/666 minted
        </div>
    </div>
{/if}
