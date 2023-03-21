<script >
    import { all_tokens, erg_wallet_tokens, select_inferno_for_existing_ritual_id, select_inferno_popup_show } from "../stores/store";
    import { connectWallet, loadErgoWalletTokens } from "./ergowallet";
    import { notifier } from '@beyonk/svelte-notifications'

    export let ritual;
    export let slot;
    export let left=true;

    async function clickOnTributeSlot(ritual, slot){
        const res = await connectWallet()
        if(res.error){
            notifier.danger(res.error,8000)
        }else{
            await loadErgoWalletTokens($all_tokens);
            select_inferno_for_existing_ritual_id.set(ritual.id);
            select_inferno_popup_show.set(true);
        }
    }
</script>
<div
    style={left?"width:128px; height:128px; z-index:2;":"width:128px; height:128px; z-index:6;left:320px;"}
    class="absolute"
    class:left-0={left}
    class:left-bang={left && ritual?.testAnimation}
    class:right-bang={!left && ritual?.testAnimation} >
    {#if slot?.inferno?.id}
        <a href={`/nfts/${slot?.inferno?.id}`}>
            <img
                src={`https://inferno.black/nfts/${encodeURIComponent(slot?.infernoImage)}.png`}
                alt=""
                class="nftimg shadow-md"
            />
        </a>
    {:else if slot?.tribute}
        <button 
            class="w-full h-full flex justify-center items-center outline outline-red-900 text-red-800"
            on:click={()=>clickOnTributeSlot(ritual, slot)}>
                {slot?.tribute} Σ
        </button>
    {/if}
</div>

<style>
    @keyframes left-to-center{
        0% {
            left: 0px;
        }
        99% {
            opacity: 1;
        }
        100% {
            left: 162px;
            opacity: 0;
        }
    }
    @keyframes right-to-center{
        0% {
            left: 320px;
        }
        95% {
            opacity: 1;
        }
        100% {
            left: 162px;
            opacity: 0;
        }
    }
    @keyframes fade-out-animation{
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
     .left-bang{
        animation:left-to-center 0.4s cubic-bezier(0.51, 0.08, 0.89, 0.41);
        -webkit-animation-fill-mode: forwards; /* Chrome 16+, Safari 4+ */
        -moz-animation-fill-mode: forwards;    /* FF 5+ */
        -o-animation-fill-mode: forwards;      /* Not implemented yet */
        -ms-animation-fill-mode: forwards;     /* IE 10+ */
        animation-fill-mode: forwards;         /* When the spec is finished */
    }
    .right-bang{
        animation:right-to-center 0.4s cubic-bezier(0.51, 0.08, 0.89, 0.41);
        -webkit-animation-fill-mode: forwards; /* Chrome 16+, Safari 4+ */
        -moz-animation-fill-mode: forwards;    /* FF 5+ */
        -o-animation-fill-mode: forwards;      /* Not implemented yet */
        -ms-animation-fill-mode: forwards;     /* IE 10+ */
        animation-fill-mode: forwards;         /* When the spec is finished */
    }
</style>