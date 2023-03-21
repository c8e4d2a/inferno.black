<script>
    import { all_tokens, timeline } from "../stores/store";
    import Time from "svelte-time";
</script>

<div class="p-4 flex flex-col md:stickyy self-start top-0 mt-5">
    <div class="flex flex-col gap-5">
        {#each $all_tokens.filter(x=> x.mint_tx).filter((x,i)=> i < 6) as activity}
            <div class="flex items-start gap-2">
                <div class="flex flex-col h-full">
                    <img src={`https://inferno.black/nfts/${encodeURIComponent(activity.name)}.png`} alt="" style="width:100px;">
                </div>
                <div class="leading-5  pb-4">
                    <div class="text-xs font-"><Time relative timestamp={activity.inserted_at} /></div>
                    <!-- <div class="text-xs font-"><Time relative timestamp={activity.time} /></div> -->
                    {#if activity.is_creature}
                        <a href={`/nfts/${activity.id}`} class="text-white hover:text-red-700"><div class="">{activity.receiver_address.substring(0,5)} evoked {activity.name}</div></a>
                    {:else}
                        <div class="text-white">{activity.receiver_address.substring(0,5)} minted {activity.name}</div>
                    {/if}
                    <a href={`https://explorer.ergoplatform.com/en/transactions/${activity.mint_tx}`} target="_blank" rel="noreferrer" class="text-xs text-gray-500">{activity.mint_tx.substring(0,32)}</a>                        
                </div>
            </div>
        {/each}
    </div>
</div>