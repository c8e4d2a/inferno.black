<script lang="ts">
    import { notifier } from "@beyonk/svelte-notifications";
    import {
        all_tokens,
        erg_wallet_tokens,
        select_inferno_popup_show,
        select_inferno_for_existing_ritual_id,
        select_inferno_slot_index,
        slots,
        all_rituals,
    } from "../stores/store";
    import Demon from "./Demon.svelte"
    import { signTxCreatureToRitual, submitTx } from "./ergowallet";

    function insertDemonIntoSlot(demon) {
        slots.update((s) => {
            s[$select_inferno_slot_index].infernoImage = demon.name;
            s[$select_inferno_slot_index].inferno = demon;
            return s;
        });
        select_inferno_popup_show.set(false);
    }

    async function selectCreature(demon){
        if($select_inferno_for_existing_ritual_id){
            try{
                const ritualId = $select_inferno_for_existing_ritual_id
                const creatureTokenId = demon.token_id;
                const signedTx = await signTxCreatureToRitual(ritualId, creatureTokenId);
                if(signedTx && !signedTx.error){
                    const ritual = $all_rituals.find(r=> ritualId == r.id)
                    if(ritual && (ritual.slotLeft.tribute || ritual.slotRight.tribute)) {
                        const txId = await submitTx(signedTx);
                        if(txId){
                            notifier.info(`Inferno sent to perform a ritual.`, 8000);
                        }
                    }
                }
            }finally{
                select_inferno_for_existing_ritual_id.set(null);
                select_inferno_popup_show.set(false);
            }
        }else{
            insertDemonIntoSlot(demon)
        }
    }
</script>

<div
    style="position:fixed; min-height:100vh; width:100%; z-index:100;"
    class="flex justify-center items-center bg-black"
>
    <div
        class="relative min-h-full w-full flex flex-col items-center justify-center gap-10 px-2 grow"
    >
        <button
            class="absolute p-4 bg-red-600 text-white m-2"
            style="top:0;right:0;"
            on:click={() => select_inferno_popup_show.set(false)}>close</button
        >
        <div
            class="flex flex-wrap gap-2 lg:gap-20"
            style="max-width: 800px; max-height: 100vh; overflow-y: auto;"
        >
            {#each $all_tokens.filter((t) => t.is_creature && $erg_wallet_tokens.some((x) => x.id == t.id)) as demon}
                {#if demon.cd_current > 0 || demon.id == $slots[0].inferno?.id || demon.id == $slots[1].inferno?.id}
                    <Demon {demon} disablelink={true} gray={true} />
                {:else}
                    <button on:click={() => selectCreature(demon)}>
                        <Demon {demon} disablelink={true} />
                    </button>
                {/if}
            {/each}
        </div>
    </div>
</div>

<style>
    .infernos {
        font-size: 20vmin;
        font-weight: bold;
    }
    .main-button {
        color: hsl(15, 100%, 55%);
    }
    .wallet-btn {
        box-shadow: inset 0 1px 0 0 hsl(0deg 0% 100% / 5%);
    }
    .nftimg {
        width: 160px;
        height: auto;
    }
    .headline {
        font-size: xx-large;
        font-weight: bold;
    }
</style>
