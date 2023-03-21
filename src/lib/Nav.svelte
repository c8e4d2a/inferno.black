<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import Filter from "./Filter.svelte"
    import Wallet from "./Wallet.svelte";

    function handleKeydown(e){
        if(e.key == 'q'){
            goto('/')
        }
        if(e.key == 'w'){
            goto('/rituals')
        }
        if(e.key == 'e'){
            goto('/nfts')
        }
    }
</script>
<svelte:window on:keydown={handleKeydown}/>
<div class="flex w-full justify-between pt-4 px-4">
    <div class="flex gap-3">
        <button
            class="text-md font-semibold bg-slate-400/10 rounded-full py-1 px-3 flex items-center space-x-2 hover:bg-slate-400/20 dark:highlight-white/5"
            on:click={()=>goto('/')}
        >
            {#if $page.route.id == "/"}🔥{/if}&nbsp;Rituals
        </button>
        <button
            class="text-md font-semibold bg-slate-400/10 rounded-full py-1 px-3 flex items-center space-x-2 hover:bg-slate-400/20 dark:highlight-white/5"
            on:click={()=>goto('/nfts')}
        >
            {#if $page.route.id == '/nfts'}🔥{/if}&nbsp;NFTs
        </button>
        <button
            class="text-md font-semibold bg-slate-400/10 rounded-full py-1 px-3 flex items-center space-x-2 hover:bg-slate-400/20 dark:highlight-white/5"
            on:click={()=>goto('/about')}
        >
            {#if $page.route.id == "/about"}🔥{/if}&nbsp;About
        </button>
    </div>
    {#if $page.route.id == '/nfts'}
        <!--Filter></Filter-->
    {/if}
    <div></div>
    <Wallet></Wallet>
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
        width: 128px;
        height: 128px;
    }
    .headline {
        font-size: xx-large;
        font-weight: bold;
    }
</style>
