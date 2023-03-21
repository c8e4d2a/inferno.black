<script lang="ts">
    export let demon;
    export let disablelink=false;
    export let gray=false;

    import Fa from "svelte-fa/src/fa.svelte";
    import {
        faDna,
        faClock,
        faClockRotateLeft,
    } from "@fortawesome/free-solid-svg-icons";
    import Time from "svelte-time/src/Time.svelte";
</script>

<div>
    {#if disablelink}
        <img
            src={`https://inferno.black/nfts/${encodeURIComponent(demon.name)}.png`}
            style={gray?"filter:grayscale();":""}
            alt=""
            class="nftimg shadow-md"
        />
    {:else}
    <a href={`/nfts/${demon.id}`}>
        <img
            src={`https://inferno.black/nfts/${encodeURIComponent(demon.name)}.png`}
            style={gray?"filter:grayscale();":""}
            alt=""
            class="nftimg shadow-md"
        />
    </a>
    {/if}
    <div class="w-full mt-2 text-sm text-left text-gray-400">{demon.name}</div>
    <div class="flex justify-between w-full mt-2 text-sm text-gray-600">
        
        <div class="flex items-center text-gray-600">
            <Fa icon={faDna} scale={0.8} class="mr-2" /> Gen {demon.gen ??
                0}
        </div>
        {#if demon.cd_current > 0}
            <div class="flex items-center text-gray-600">
                <Fa icon={faClock} scale={0.8} class="mr-2" />
                {Math.floor(demon.cd_current / 60)}min {Math.floor((demon.cd_current % 60)).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}sec
                <!-- {Math.ceil(demon.cd / 60)}m -->
            </div>
        {/if}
    </div>

    
</div>

<style>
    .nftimg {
        width: 200px;
        height: 200px;
    }
</style>
