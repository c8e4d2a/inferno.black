<script>
    import { all_rituals, all_tokens, erg_wallet_tokens, ritual_scroll, select_inferno_popup_show, select_inferno_slot_index, slots } from "../stores/store";
    import {v4} from "uuid";
    import {connectWallet, createBreedingTx, createBreedingTxWithTribute, get_utxos, loadErgoWalletTokens, submitTx} from './ergowallet'
    import MintScrollButton from "./MintScrollButton.svelte";
    let ritualButtonState = 'initial';

    async function clickStartRitual() {
        ritualErrorText = 'connecting...'

        const res = await connectWallet()
        if(res.error){
            ritualErrorText = res.error;
            setTimeout(()=>{
                ritualErrorText = '';
            }, 5000)
        }else{
            ritualErrorText = '';
            await loadErgoWalletTokens($all_tokens);
            const ritualToken = getRitualToken()
            if(ritualToken){
                ritual_scroll.set(ritualToken);
                ritualButtonState = "configure_slots";
            }
        }
    }

    let missing_ritual_scroll = false
    function getRitualToken(){
        const token = $erg_wallet_tokens.find(x=> x.is_scroll)
        if(!token){
            missing_ritual_scroll = true
            ritualErrorText = 'Missing Ritual Scrolls'
            setTimeout(()=>{
                missing_ritual_scroll = false
                ritualErrorText = '';
            }, 8000)
        }
        return token;
    }

    let ritualErrorText = '';

    function handleAddInfernoClick(slotIndex) {
        select_inferno_slot_index.set(slotIndex);
        select_inferno_popup_show.set(true);
    }
    function handleConfigureSlotClick(slotIndex) {
        slots.update(s =>{
            s[slotIndex].mode = "config";
            return s;
        })
    }

    function handleSetConfigSlotClick(slotIndex) {
        const ergs = parseFloat($slots[slotIndex].tributeInput);
        if (!isNaN(ergs) && ergs > 0) {
            slots.update(s =>{
                s[slotIndex].tribute = ergs;
                return s;
            })
        }
        slots.update(s =>{
                s[slotIndex].mode = "initial";
                return s;
            })
        console.log(slots);
    }

    function handleClearTributeClick(slotIndex) {
        slots.update(s =>{
                s[slotIndex].tribute = null;
                return s;
            })
    }

    function handleClearInfernoClick(slotIndex) {
        slots.update(s =>{
                s[slotIndex].infernoImage = null;
                s[slotIndex].inferno = null;
                return s;
            })
    }

    function handleCloseConfigSlotClick(slotIndex) {
        //slotInfex = 1 | 2
        slots.update(s =>{
                s[slotIndex].mode = "initial";
                return s;
            })

        //open popup with owned infernos.
    }
    // handle the case where you don't have any inferno/any left

    async function clickSubmitNewRitual(){
        // @ts-ignore
        ritualErrorText = 'signing...'
        let tx
        try{
            if($slots[0].inferno?.token_id && $slots[1].inferno?.token_id){
                tx = await createBreedingTx($ritual_scroll.token_id, $slots[0].inferno.token_id, $slots[1].inferno.token_id);
            }else if($slots[0].inferno?.token_id && $slots[1].tributeInput
                    || $slots[0].tributeInput && $slots[1].inferno?.token_id){
                const tokenId1 = $slots[0].inferno?.token_id ?? $slots[1].inferno?.token_id
                //console.log("dick", $slots[0].tributeInput, $slots[1].tributeInput);
                let tribute = '';
                if($slots[0].tributeInput != ''){
                    tribute = $slots[0].tributeInput;
                }else{
                    tribute = $slots[1].tributeInput;
                }
                tx = await createBreedingTxWithTribute($ritual_scroll.token_id, tokenId1, tribute);
            }
        }catch(e){
            console.error(e)
            ritualErrorText = 'Failed to sign Tx!'
            setTimeout(()=>{
                ritualErrorText = '';
            }, 5000)
            return;
        }

        try{
            tx = await submitTx(tx);
            ritualErrorText = 'Transaction submitted!'
            console.log(tx)
            //return;
        }catch(e){
            console.error(e)
            ritualErrorText = 'Failed to submit Tx!'
            setTimeout(()=>{
                ritualErrorText = '';
            }, 5000)
            return;
        }

        ritualErrorText = ''

        slots.set([
            {
                mode: "initial",
                tribute: null,
                tributeInput: "",
                infernoImage: null,
                inferno: null,
            },
            {
                mode: "initial",
                tribute: null,
                tributeInput: "",
                infernoImage: null,
                inferno: null,
            },
        ])
        ritual_scroll.set(null);
        ritualButtonState = 'initial'
    }

    const ENABLE_OFFER_ERG = true;
</script>

{#if ritualErrorText}

        {#if missing_ritual_scroll}
        <div
            class="flex items-center justify-center w-full"
            style="max-width:446px; height:128px;"
        >
            <MintScrollButton></MintScrollButton>
        </div>
        {:else}
                <div
                class="outline text-red-700 hover:text-gray-400 text-xl rounded flex items-center justify-center gap-8 w-full"
                style="max-width:446px; height:128px;"
            >
                    {ritualErrorText}
            </div>
        {/if}
{:else if ritualButtonState == "initial"}
    <button
        on:click={clickStartRitual}
        class="outline text-red-700 hover:text-gray-400 text-4xl rounded flex items-center justify-center gap-8 w-full"
        style="max-width:446px; height:128px;font-family: 'Permanent Marker', cursive;"
    >
        start new ritual
    </button>
{:else if ritualButtonState == "configure_slots"}
    <div
        class="text-black rounded flex items-center justify-center gap-8 w-full"
        style="max-width:446px; height:128px;"
    >
        {#if $slots[0].infernoImage}
            <div class="relative" style="width:128px;height:128px;">
                <img
                    src={`https://inferno.black/nfts/${encodeURIComponent($slots[0].infernoImage)}.png`}
                    alt=""
                    class="absolute nftimg shadow-md"
                />
                <button
                    on:click={() => handleClearInfernoClick(0)}
                    class="absolute h-6 w-6 m-1 rounded-full bg-red-700"
                    style="top:0;right:0;">X</button
                >
            </div>
        {:else if $slots[0].tribute}
            <div
                class="relative ritual flex flex-col items-center justify-center outline outline-red-700 text-red-700"
                style="width:128px;height:128px;"
            >
                <button
                    on:click={() => handleClearTributeClick(0)}
                    class="absolute h-6 w-6 m-1 rounded-full text-red-700"
                    style="top:0;right:0;">X</button
                >
                <span class="font-bold">{$slots[0].tribute} Σ</span>
            </div>
        {:else if $slots[0].mode == "initial"}
            <div
                class="ritual flex flex-col items-center justify-center"
                style="width:128px;height:128px;"
            >
            {#if ENABLE_OFFER_ERG}
                <button
                    class="w-full text-gray-400 hover:text-white grow  outline-dashed "
                    on:click={() => handleAddInfernoClick(0)}
                    >add inferno</button
                >
                <!-- <div class="text-gray-500">or</div>
                <button
                    class="w-full grow rounded outline-dashed text-gray-400 hover:text-white"
                    on:click={() => handleConfigureSlotClick(0)}>offer Σ</button
                > -->
            {:else}
                <button
                    class="w-full text-gray-400 hover:text-white grow  outline-dashed "
                    on:click={() => handleAddInfernoClick(0)}
                    >set inferno</button
                >
            {/if}
            </div>
        {:else if $slots[0].mode == "config"}
            <div
                class="p-3 relative ritual flex flex-col items-center justify-center rounded outline outline-gray-500"
                style="width:128px;height:128px;"
            >
                <button
                    on:click={() => handleCloseConfigSlotClick(0)}
                    class="hidden absolute h-6 w-6 m-1 rounded-full bg-black"
                    style="top:0;right:0;">X</button
                >
                <div class="w-full text-gray-500 text-xs mb-1">
                    Offer in ERG:
                </div>
                <input
                    bind:value={$slots[0].tributeInput}
                    placeholder="6.666"
                    class="p-1 outline"
                    style="width:100%; outline-color: #888!important;"
                    type="text"
                />
                <div class="flex w-full gap-2 mt-2 text-gray">
                    <button
                        on:click={() => handleCloseConfigSlotClick(0)}
                        class="grow outline rounded outline-gray-500 py-1 text-gray-400 hover:text-white"
                        >cancel</button
                    >
                    <button
                        on:click={() => handleSetConfigSlotClick(0)}
                        class="grow outline rounded outline-gray-500 py-1 text-gray-400 hover:text-white"
                        >set</button
                    >
                </div>
            </div>
        {/if}
        <div class="relative" style="width:128px;height:128px;">
            <img
                src="scroll.png"
                alt=""
                class:grayanimation={$slots[0].tribute}
                class="absolute nftimg shadow-md grayed"
                
            />
            {#if ($slots[0].tribute||$slots[0].infernoImage)&&($slots[1].tribute||$slots[1].infernoImage)}
            <div class="absolute text-white flex justify-center items-center" style="width:128px;height:128px;">
                <button
                    on:click={clickSubmitNewRitual}
                    class="outline outline-black text-black hover:text-white hover:outline-white rounded-full bg-red-600 h-16 w-16 mb-1 text-xl"
                    style="font-family: 'Permanent Marker', cursive;">
                    start
                </button>
            </div>
            {/if}
        </div>
        {#if $slots[1].infernoImage}
            <div class="relative" style="width:128px;height:128px;">
                <img
                    src={`https://inferno.black/nfts/${encodeURIComponent($slots[1].infernoImage)}.png`}
                    alt=""
                    class="absolute nftimg shadow-md"
                />
                <button
                    on:click={() => handleClearInfernoClick(1)}
                    class="absolute h-6 w-6 m-1 rounded-full bg-red-700"
                    style="top:0;right:0;">X</button
                >
            </div>
        {:else if $slots[1].infernoImage}
            <img
                src={`https://inferno.black/nfts/${$slots[1].infernoImage}.png`}
                alt=""
                class="nftimg shadow-md"
                
            />
        {:else if $slots[1].tribute}
            <div
                class="relative ritual flex flex-col items-center justify-center outline outline-red-700 text-red-700"
                style="width:128px;height:128px;"
            >
                <button
                    on:click={() => handleClearTributeClick(1)}
                    class="absolute h-6 w-6 m-1 rounded-full text-red-700"
                    style="top:0;right:0;">X</button
                >
                <span class="font-bold">{$slots[1].tribute} Σ</span>
            </div>
        {:else if $slots[1].mode == "initial"}
            <div
                class="ritual flex flex-col items-center justify-center"
                style="width:128px;height:128px;"
            >
                {#if ENABLE_OFFER_ERG}
                    <button
                        class="w-full text-gray-400 hover:text-white grow  outline-dashed "
                        on:click={() => handleAddInfernoClick(1)}
                        >add inferno</button
                    >
                    <div class="text-gray-500">or</div>
                    <button
                        class="w-full grow rounded outline-dashed text-gray-400 hover:text-white"
                        on:click={() => handleConfigureSlotClick(1)}>offer Σ</button
                    >
                {:else}
                    <button
                    class="w-full text-gray-400 hover:text-white grow  outline-dashed "
                    on:click={() => handleAddInfernoClick(1)}
                    >set inferno</button>
                {/if}
            </div>
        {:else if $slots[1].mode == "config"}
            <div
                class="p-3 relative ritual flex flex-col items-center justify-center rounded outline outline-gray-500"
                style="width:128px;height:128px;"
            >
                <button
                    on:click={() => handleCloseConfigSlotClick(1)}
                    class="hidden absolute h-6 w-6 m-1 rounded-full bg-black"
                    style="top:0;right:0;">X</button
                >
                <div class="w-full text-gray-500 text-xs mb-1">
                    Offer in ERG:
                </div>
                <input
                    bind:value={$slots[1].tributeInput}
                    placeholder="6.666"
                    class="p-1 outline"
                    style="width:100%; outline-color: #888!important;"
                    type="text"
                />
                <div class="flex w-full gap-2 mt-2 text-gray">
                    <button
                        on:click={() => handleCloseConfigSlotClick(1)}
                        class="grow outline rounded outline-gray-500 py-1 text-gray-400 hover:text-white"
                        >cancel</button
                    >
                    <button
                        on:click={() => handleSetConfigSlotClick(1)}
                        class="grow outline rounded outline-gray-500 py-1 text-gray-400 hover:text-white"
                        >set</button
                    >
                </div>
            </div>
        {/if}
    </div>
{/if}

<style>
    .grayed{
        filter: grayscale(100%);
    }
    .grayanimation {
        filter: grayscale(0%);
        transition: filter 5s ease-in-out;
    }

    .nftimg {
        width: 128px;
        height: 128px;
    }
</style>
