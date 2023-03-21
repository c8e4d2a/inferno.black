<script>
    // todo make $stores/stuff imports work
    import {ownednfts} from '../../stores/ownednfts'

</script>
<div class="w-full flex flex-col items-center" style="margin-top:16vh; min-height: 448px;">
    <div class="flex flex-col ">
        {#each $ownednfts as nft}
                <div>
                    {nft.balance} {nft.tokenId}
                </div>
        {/each}
    </div>
</div>

