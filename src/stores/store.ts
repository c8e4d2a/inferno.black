import { writable } from "svelte/store";
import { lore } from "../common/lore";

export const main_selected_collection = writable(lore.collections[0].genesis)

export const minted_scrolls_count = writable(0);
export const infernos_summoned = writable(36);
export const min_mint_price = writable('0');
export const modal = writable(null);
export const select_inferno_popup_show = writable(false);
export const select_inferno_slot_index = writable(0);

export const select_inferno_for_existing_ritual_id = writable();

export const timeline = writable([]);

export const all_tokens = writable([]);
export const erg_wallet_tokens = writable([]);
export const erg_wallet_addresses = writable([]);

export const cooldown_tik = writable();

export const project = writable('inferno');

export const ritual_scroll = writable();

export const slots = writable(
    [
        {
            mode: "initial",
            //mode: "config",
            tribute: null,
            //tribute: 1,
            tributeInput: "",
            infernoImage: null,
            inferno: null,
        },
        {
            mode: "initial",
            tribute: null,
            //tribute: 2,
            tributeInput: "",
            infernoImage: null,
            inferno: null,
        },
    ]
);

export const all_rituals = writable([
        {
            id: '1',
            summonedCreature: {
                after_lease_return_to_owner: null,
                burn_tx: null,
                cd_minutes: 35,
                creature_name: null,
                from_ritual_id: 57,
                gen: 2,
                id: 1057,
                inserted_at: "2023-03-16T15:15:54",
                ipfs: "ipfs://bafkreiek56p7gx7cj4cbpxdbeiip7whb7vf2h2dh2lsvogwutg4y4a7xpi",
                is_creature: true,
                is_scroll: null,
                last_use: null,
                lease_price: null,
                mint_tx: "c95c3e2ab9feba7cc342b9c327571eddcd99707a653287e3496fec9a872cb8bc",
                name: "Zodwing",
                parents: "1099 1053",
                project: "inferno",
                receiver_address: "9f8xmyMiHmmBtDxVESpp5crtjJbyqbEtJPzdJy9kAyTYX6wA3JY",
                token_id: "28522cdd05dc1c661ababfc540cf83d05e6567e5862d3cf1ae7c6afbd837b96a",
                updated_at: "2023-03-16T15:15:54"
            },
            slotLeft: {
                tribute: null,
                infernoImage: 'Zephyr',
            },
            slotRight: {
                tribute: null,
                infernoImage: 'Icarian',
            },
            testAnimation:false,
            showPortal:false,
        }/*,{
            id: '2',
            slotLeft: {
                tribute: 0.666,
                infernoImage: null,
            },
            slotRight: {
                tribute: 0.06,
                infernoImage: null,
            },
        }*/
    ]
);

export function performRitual(ritual){
    all_rituals.update(ar=>{
        ritual.testAnimation=true
        const i = ar.findIndex(x=> x.id == ritual.id)
        ar[i] = ritual;

        return ar;
    })
    setTimeout(()=>{
        all_rituals.update(ar=>{
            const x = ar.find(r=>r.id == ritual.id);
            if(x){
                x.showPortal=true
            }
            return ar;
        })},600);
    setTimeout(()=>{all_rituals.update(a=>{a = a.filter(r=>r.id != ritual.id); return a;})},10000)
}