<script lang="ts">
    import { lore } from "../../common/lore";
    import {
    all_tokens,
        main_selected_collection,
    } from "../../stores/store";
    import { genesisnfts } from "../../common/genesisnfts";
    import MintScrollButton from "$lib/MintScrollButton.svelte";
</script>

<div style="min-height:100vh; padding-left: 10vmin; padding-right: 10vmin;">
    <div class="flex flex-wrap gap-20 items-center">
        <div style="margin-top: max(5vh, 58px);">
            <p class="infernos">Inferno.</p>
            <div style="max-width:600px;">
                <p class="pl-2">
                    {lore.introduction}
                </p>
            </div>
        </div>
        <div class="flex flex-wrap lg:flex-col gap-8 justify-center mt-4">
            <div>
                <img
                    src="nfts/Zephyr.png"
                    alt=""
                    class="nftimg shadow-md"
                    style="width:128px;"
                />
                <div class="w-full mt-2 hidden">#1 Zephyr</div>
            </div>
            <div>
                <img
                    src="nfts/Dantalion.png"
                    alt=""
                    class="nftimg shadow-md"
                    style="width:128px;"
                />
                <div class="w-full mt-2 hidden">#2 Dantalion</div>
            </div>
            <div>
                <img
                    src="nfts/Magma.png"
                    alt=""
                    class="nftimg shadow-md"
                    style="width:128px;"
                />
                <div class="w-full mt-2 hidden">#3 Magma</div>
            </div>
        </div>
    </div>

    <div
        class="flex flex-wrap gap-4 align-top justify-end mt-10"
        style="max-width:600px;"
    >
        <MintScrollButton></MintScrollButton>

        <a
            class="text-md font-semibold outline-1 rounded-md py-2 px-3 flex items-center space-x-2 dark:highlight-white/5 hover:bg-slate-400/20"
            style="border: 2px solid; height:fit-content"
            href="https://discord.com/invite/bitmasks"
            target="_blank "
            rel="noreferrer"
        >
            Join Discord
        </a>
    </div>
</div>
<div style="margin-left: 10vmin;" class="mt-10">
    <div class="text-4xl mb-4">Genesis NFTs</div>
    <div class="flex flex-wrap gap-6 mb-10">
        {#each lore.collections as col}
            <button
                class="text-md font-semibold outline-1 rounded-md py-2 px-3 flex items-center space-x-2 dark:highlight-white/5 hover:bg-slate-400/20"
                class:selectedbtn={$main_selected_collection == col.genesis}
                on:click={() => main_selected_collection.set(col.genesis)}
                style="border: 2px solid">{col.title}</button
            >
        {/each}
    </div>

    <div class="flex flex-wrap gap-6">
        <div>
            <h2 class="text-2xl">{$main_selected_collection}:</h2>
            <div class="mt-10" style="max-width: 400px;">
                {lore.collections.find(
                    (c) => c.genesis == $main_selected_collection
                )?.lore}
            </div>
        </div>
        <div class="flex flex-col items-center" style="min-height: 448px;">
            <div class="flex flex-wrap gap-14" style="max-width:600px;">
                    {#each genesisnfts.filter((nft) => nft.genesis == $main_selected_collection) as demon, i}
                        <div>
                            <a href={`/nfts/${$all_tokens.find(t=> t.name == demon.name)?.id}`}>
                                <img
                                    src={"https://inferno.black/nfts/" + demon.name + ".png"}
                                    alt=""
                                    class="nftimg shadow-md"
                                />
                            </a>
                            <div class="w-full mt-2 text-sm text-red-800">
                                {demon.name}
                            </div>
                        </div>
                    {/each}
            </div>
        </div>
    </div>
</div>
<!-- socials -->
<div class="mt-24 flex justify-center gap-4 w-full mb-10">
    <div>
        <a href="https://t.co/tzfd8Nm6UQ" target="_blank" rel="noreferrer"
            >Discord</a
        >
    </div>
    <div>
        <a
            href="https://twitter.com/BitmasksIO"
            target="_blank"
            rel="noreferrer">Twitter</a
        >
    </div>
</div>

<style>
    .shake {
        animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
        transform: translate3d(0, 0, 0);
        perspective: 1000px;
    }

    @keyframes shake {
        10%, 90% {
            transform: translate3d(-1px, 0, 0);
        }
        20%, 80% {
            transform: translate3d(2px, 0, 0);
        }
        30%, 50%, 70% {
            transform: translate3d(-4px, 0, 0);
        }
        40%, 60% {
            transform: translate3d(4px, 0, 0);
        }
    }
    .loading {
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 3px solid rgba(255,255,255,.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    -webkit-animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
    to { -webkit-transform: rotate(360deg); }
    }
    @-webkit-keyframes spin {
    to { -webkit-transform: rotate(360deg); }
    }
    .mintbtn {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 999px;
    }

    .mintbtn:hover {
        animation: burn 1400ms ease-out forwards;
    }
    .mintbtn::before {
        content: "";
        position: absolute;
        left: 40px;
        width: 100px;
        height: 40px;
        animation: flare 1400ms ease-out forwards;
    }

    .mintbtn::after {
        content: "";
        position: absolute;
        right: 40px;
        width: 100px;
        height: 40px;
        animation: flare 1000ms ease-out forwards;
    }

    @keyframes flare {
        100% {
            transform: translateY(-20px) scale(1.5);
            filter: blur(10px);
            opacity: 0;
        }
    }

    @keyframes burn {
        0% {
            color: rgba(255, 130, 110, 1);
            box-shadow: 0 0 5px 0 rgba(200, 0, 10, 1),
                0 0 5px 0 rgba(230, 30, 10, 0.8),
                0 0 5px 0 rgba(230, 230, 10, 0.6);
        }
        50% {
            color: rgba(0, 0, 0, 1);
            box-shadow: 0 -35px 40px 30px rgba(255, 130, 10, 0),
                0 -30px 30px 10px rgba(230, 30, 10, 0),
                0 -20px 10px 0 rgba(255, 255, 10, 0);
        }
        100% {
            color: rgba(255, 130, 110, 1);
            box-shadow: 0 0 5px 0 rgba(200, 0, 10, 1),
                0 0 5px 0 rgba(230, 30, 10, 0.8),
                0 0 5px 0 rgba(230, 230, 10, 0.6);
        }
    }

    a {
        color: darkred;
    }
    a:active {
        color: darkred;
    }
    .selectedbtn {
        background-color: rgba(255, 0, 0, 0.71);
        color: black;
    }
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
