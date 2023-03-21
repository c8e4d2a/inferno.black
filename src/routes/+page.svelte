<script lang="ts">
    import Timeline from "$lib/Timeline.svelte";
    import SelectInfernoPopup from "$lib/SelectInfernoPopup.svelte";
    import StartRitual from "$lib/StartRitual.svelte";
    import Demon from "$lib/Demon.svelte";
    import {
        all_rituals,
        all_tokens,
        performRitual,
        select_inferno_popup_show,
    } from "../stores/store";
    import { flip } from "svelte/animate";
    import { fade } from "svelte/transition";
    import Portal from "$lib/Portal.svelte";
    import RitualSlot from "$lib/RitualSlot.svelte";
</script>

<!-- "POPUP" start-->
{#if $select_inferno_popup_show}
    <SelectInfernoPopup />
{/if}
<!-- "POPUP" end-->

<div
    class="min-h-full w-full flex flex-col items-center justify-center gap-10 px-2 grow "
>
    <div class="flex flex-wrap w-full">
        {#if $all_tokens.length > 0}
            <Timeline />
            <div class="grow flex justify-center">
                <div
                    class="w-full flex flex-col items-center gap-16 ritual-list"
                    style="max-width:800px;"
                >
                    <StartRitual />
                    {#if $all_rituals.length == 0}
                        <div
                            class="flex flex-wrap gap-2 lg:gap-20"
                            style="max-width:800px;"
                        >
                            {#each $all_tokens.filter((t, i) => t.is_creature && i < 6) as demon}
                                <Demon {demon} />
                            {/each}
                        </div>
                    {/if}
                    {#if true}
                        {#each $all_rituals as ritual (ritual.id)}
                            <div
                                animate:flip={{ duration: 500 }}
                                in:fade={{ delay: 200 }}
                                class="relative flex gap-8"
                                style="width:448px;height:128px;">
                                <RitualSlot {ritual} slot={ritual.slotLeft} />


                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div
                                    class="absolute z-3"
                                    style="left:162px; z-index:3;"
                                    on:click={() => {
                                        performRitual(ritual);
                                        ritual = ritual;
                                    }}
                                >
                                    <img
                                        src="scroll_round.png"
                                        alt=""
                                        class="nftimg"
                                        class:bump={ritual.testAnimation}
                                    />
                                </div>
                                {#if ritual.showPortal}
                                    <div
                                        class="absolute"
                                        style="left:162px; z-index:6;"
                                    >
                                        <div
                                            class="relative flex items-center justify-center"
                                        >
                                            <div
                                                class:bump-portal={ritual.testAnimation}
                                            >
                                                <Portal />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        class="absolute flex justify-center items-center"
                                        style="left:162px; z-index:1;"
                                    >
                                        <img
                                            src={`https://inferno.black/nfts/${encodeURIComponent(
                                                ritual.summonedCreature?.name
                                            )}.png`}
                                            alt=""
                                            class="rounded-full"
                                            class:circle2box={ritual.testAnimation}
                                            style="width:120px;height:120px;"
                                        />
                                    </div>
                                {/if}

                                
                                <RitualSlot
                                    {ritual}
                                    slot={ritual.slotRight}
                                    left={false}
                                />
                                <div
                                    style="width:128px; height:128px; left:320px; z-index:2; opacity:0;"
                                    class="absolute flex items-center"
                                    class:reveal-details-text={ritual.testAnimation}
                                >
                                    <div>
                                        <div>
                                            {ritual.summonedCreature?.name}
                                        </div>
                                        <div>
                                            Gen: {ritual.summonedCreature?.gen}
                                        </div>
                                        <a
                                            href={`https://explorer.ergoplatform.com/en/token/${ritual.summonedCreature?.token_id}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            style="text-decoration:underline;"
                                        >
                                            <div>
                                                Token: {ritual.summonedCreature?.token_id?.substring(
                                                    0,
                                                    6
                                                )}
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    {/if}
                </div>
            </div>
        {:else}
            <div class="w-full text-center">loading...</div>
        {/if}
    </div>
</div>

<style>
    .nftimg {
        width: 128px;
    }

    @keyframes hit-enlarge {
        0% {
            transform: scale(1);
        }
        5% {
            transform: scale(1.1);
        }
        10% {
            transform: scale(1);
        }
        20% {
            transform: scale(1);
        }
        25% {
            transform: scale(1.1);
        }
        30% {
            transform: scale(1);
        }
        35% {
            transform: scale(1.1);
        }
        40% {
            transform: scale(1);
        }
        50% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    @keyframes border-radius-to-0 {
        0% {
            border-radius: 50%;
        }
        100% {
            border-radius: 0%;
        }
    }

    @keyframes fade-in-text-frames {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    .bump {
        animation: hit-enlarge 2.4s;
        animation-delay: 0.4s;
        -webkit-animation-fill-mode: forwards; /* Chrome 16+, Safari 4+ */
        -moz-animation-fill-mode: forwards; /* FF 5+ */
        -o-animation-fill-mode: forwards; /* Not implemented yet */
        -ms-animation-fill-mode: forwards; /* IE 10+ */
        animation-fill-mode: forwards; /* When the spec is finished */
    }

    .bump-portal {
        animation: hit-enlarge 2.4s;
        animation-delay: 0s;
        -webkit-animation-fill-mode: forwards; /* Chrome 16+, Safari 4+ */
        -moz-animation-fill-mode: forwards; /* FF 5+ */
        -o-animation-fill-mode: forwards; /* Not implemented yet */
        -ms-animation-fill-mode: forwards; /* IE 10+ */
        animation-fill-mode: forwards; /* When the spec is finished */
    }
    .circle2box {
        animation: border-radius-to-0 0.3s;
        animation-delay: 1.5s;
        -webkit-animation-fill-mode: forwards; /* Chrome 16+, Safari 4+ */
        -moz-animation-fill-mode: forwards; /* FF 5+ */
        -o-animation-fill-mode: forwards; /* Not implemented yet */
        -ms-animation-fill-mode: forwards; /* IE 10+ */
        animation-fill-mode: forwards; /* When the spec is finished */
    }
    .reveal-details-text {
        animation: fade-in-text-frames 0.2s;
        animation-delay: 3s;
        -webkit-animation-fill-mode: forwards; /* Chrome 16+, Safari 4+ */
        -moz-animation-fill-mode: forwards; /* FF 5+ */
        -o-animation-fill-mode: forwards; /* Not implemented yet */
        -ms-animation-fill-mode: forwards; /* IE 10+ */
        animation-fill-mode: forwards; /* When the spec is finished */
    }
</style>
