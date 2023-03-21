<script lang="ts">
    import { onMount } from "svelte";
    import { genesisnfts } from "../common/genesisnfts";
    import Page from "../routes/+page.svelte";
    import { all_tokens } from "../stores/store";
    import { visibleGalleryNnfts } from "../stores/visibleGalleryNfts";

    const PAGE_SIZE = 6;
    let offset = 10;
    let total = 0;
    let totalPages = 0;
    let currentPage = 0;
    let prevPages: Array<number> = [];
    let nextPages: Array<number> = [];

    function updatePagination(tokens) {
        offset = currentPage * PAGE_SIZE;
        totalPages = Math.ceil(total / PAGE_SIZE) - 1;
        prevPages = [
            currentPage - 4,
            currentPage - 3,
            currentPage - 2,
            currentPage - 1,
        ].map((x) => (0 <= x && x < currentPage ? x : ""));
        if (currentPage > 4) {
            prevPages[0] = 0;
            prevPages[1] = "...";
        }
        nextPages = [
            currentPage + 1,
            currentPage + 2,
            currentPage + 3,
            currentPage + 4,
        ].map((x) => (currentPage <= x && x <= totalPages ? x : ""));
        if (currentPage < totalPages - 4) {
            nextPages[2] = "...";
            nextPages[3] = totalPages;
        }
        visibleGalleryNnfts.set(tokens.slice(offset, offset + PAGE_SIZE));
    }

    onMount(() => {
        updateView($all_tokens.filter(x=> x.is_creature));
    });

    $: updateView($all_tokens.filter(x=> x.is_creature))

    function updateView(tokens){
        total = tokens.length;
        updatePagination(tokens);
    }

    function clickNextPage() {
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination($all_tokens.filter(x=> x.is_creature));
        }
    }
    function clickPrevPage() {
        if (currentPage > 0) {
            currentPage--;
            updatePagination($all_tokens.filter(x=> x.is_creature));
        }
    }
    function clickPage(i) {
        if (!Number.isInteger(i)) {
            return;
        }
        currentPage = i;
        updatePagination($all_tokens.filter(x=> x.is_creature));
    }
</script>

<div class="flex items-center paginator">
    <button on:click={clickPrevPage} class="text-red-800">❮</button>
    <div style="width:120px;">
        {#each prevPages as p}
            <button on:click={() => clickPage(p)}  class="text-red-800">{p}</button>
        {/each}
    </div>
    <button disabled>{currentPage}</button>
    <div style="width:120px;">
        {#each nextPages as p}
            <button on:click={() => clickPage(p)}  class="text-red-800">{p}</button>
        {/each}
    </div>
    <button on:click={clickNextPage} class="text-red-800">❯</button>
</div>

<style>
    .paginator button {
        width: 30px;
    }
</style>
