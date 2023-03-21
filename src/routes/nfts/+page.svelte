<script lang="ts">
    import Paginator from "$lib/Paginator.svelte";
    import Demon from "$lib/Demon.svelte";
    import { visibleGalleryNnfts } from "../../stores/visibleGalleryNfts";


</script>

<div
    class="min-h-full w-full flex flex-col items-center justify-center gap-10 px-2 grow"
>
    <div class="flex flex-wrap gap-2 lg:gap-20" style="max-width:800px;">
        {#each $visibleGalleryNnfts as demon}
            <Demon {demon}></Demon>
        {/each}
    </div>
    <div class="w-full flex justify-center mt-10"><Paginator /></div>
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
