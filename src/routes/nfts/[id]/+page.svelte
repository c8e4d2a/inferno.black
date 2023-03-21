<script lang="ts">
    import { page } from "$app/stores";
    import { genesisnfts } from "../../../common/genesisnfts";
    import { all_tokens } from "../../../stores/store";

    import Demon from "$lib/Demon.svelte"

    import Fa from "svelte-fa/src/fa.svelte";
    import {
        faDna,
        faClock,
        faClockRotateLeft,
    } from "@fortawesome/free-solid-svg-icons";
    import Time from "svelte-time/src/Time.svelte";

    $: nft = $all_tokens.find((d) => d.id == $page.params.id);
    $: evoked = $all_tokens.filter(t => t.parents?.split(' ').some(x => x == nft.id));
</script>

<div
    class="w-full min-h-full flex flex-col justify-center items-center relative grow"
>
    <div class="absolute z-10 p-3 py-5" style="right:0; top:0;">
        <a href="/nfts">
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="red"
                xmlns="http://www.w3.org/2000/svg"
                ><path
                    d="M12.6667 3.33333L3.33333 12.6667"
                    stroke-miterlimit="10"
                /><path
                    d="M3.33333 3.33333L12.6667 12.6667"
                    stroke-miterlimit="10"
                /></svg
            >
        </a>
    </div>
    <div class="relative flex flex-col items-center pt-4">
        <div class="w-lg-max uptolg:px-4">
            {#if nft}
                <div class="flex flex-wrap gap-20 lg:gap-28 justify-center">
                    <div>
                        <img
                            src={`https://inferno.black/nfts/${encodeURIComponent(
                                nft.name
                            )}.png`}
                            alt=""
                            class="shadow-md"
                            style={evoked?.length>0?"width:500px;":""}
                        />
                    </div>
                    <div class="flex flex-col justify-center gap-4">
                        <div
                            style="margin-top:0.4em; font-family: 'Brush Script MT'; font-style:italic;"
                            class="text-2xl"
                        >
                            {nft?.name}
                        </div>
                        <div>
                            <div class=" text-gray-400">Token ID</div>
                            <a
                                href={`https://explorer.ergoplatform.com/en/token/${nft.token_id}`}
                                target="_blank"
                                rel="noreferrer"
                                style="text-decoration:underline;"
                            >
                                {nft.token_id.slice(0, 6)}
                            </a>
                        </div>
                        {#if nft.gen == 0}
                            <div>
                                <div class=" text-gray-400">Collection</div>
                                <a href="/nfts" class="text-red-600">
                                    <div class="">36 Σ Genesis</div>
                                </a>
                            </div>
                            <div>
                                <div class=" text-gray-400">Artist</div>
                                <div class=" flex items-center text-zinc-600">
                                    unknown
                                </div>
                            </div>
                        {/if}
                        <div>
                            <div class=" text-gray-400">Gen</div>
                            <div class=" flex items-center text-zinc-600">
                                {nft?.gen}
                            </div>
                        </div>
                        <div>
                            <div class=" text-gray-400">CD</div>
                            <div class=" flex items-center text-zinc-600">
                                {nft?.cd_minutes} minutes
                            </div>
                        </div>
                        {#if nft.cd_current > 0}
                        <div>
                            <div class=" text-gray-400">Remaining CD</div>
                            <div class=" flex items-center text-zinc-600">
                                <Fa icon={faClock} scale={0.8} class="mr-2" />
                                {Math.floor(nft.cd_current / 60)}min {Math.floor((nft.cd_current % 60)).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}sec
                            </div>
                        </div>
                        {/if}

                        {#if nft.gen == 0}
                            <div>
                                <div class=" text-gray-400">About</div>
                                <div
                                    style="max-width: 300px; font-style: italic;"
                                    class="text-sm mt-1 text-zinc-600"
                                >
                                    {genesisnfts.find(
                                        (x) => x.name == nft?.name
                                    )?.lore}
                                </div>
                            </div>
                        {:else}
                            <div class=" text-gray-400">Ancestors</div>
                            <div class="flex gap-2">
                                {#each nft?.parents.split(" ") as parentId}
                                    <div>
                                        <a href={`/nfts/${parentId}`}>
                                            <img
                                                src={"https://inferno.black/nfts/" +
                                                    $all_tokens.find(
                                                        (d) => d.id == parentId
                                                    ).name +
                                                    ".png"}
                                                alt=""
                                                class="ancestornftimg shadow-md"
                                            />
                                            <div
                                                style="max-width: 300px; font-style: italic;"
                                                class="text-sm mt-1 text-zinc-600"
                                            >
                                                {$all_tokens.find(
                                                    (d) => d.id == parentId
                                                ).name}
                                            </div>
                                        </a>   
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>
                {#if evoked?.length > 0}
                    <div class="w-lg-max uptolg:px-4 mt-10" style="max-width:1080px;">
                        <div class="mb-4">Evoked:</div>
                        <div class="flex flex-wrap gap-5">
                            {#each evoked as demon}
                                <Demon {demon}></Demon>
                            {/each}
                        </div>
                    </div>
                {/if}
            {:else if $all_tokens.length == 0}
                <div>loading...</div>
            {:else}
                <div>not found</div>
            {/if}
        </div>

    </div>
</div>


<style>
    .ancestornftimg{
        width:80px;
        height:80px;
    }
</style>