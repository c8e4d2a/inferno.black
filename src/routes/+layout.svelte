<script lang="ts">
    import "../app.css";
    import Nav from "$lib/Nav.svelte";

    import { Socket }  from "phoenix";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { mint } from "../stores/mint";
    import { performRitual } from "../stores/store";
    import { NotificationDisplay, notifier } from '@beyonk/svelte-notifications'
    import { all_rituals, all_tokens, cooldown_tik, minted_scrolls_count, min_mint_price, modal, project, timeline } from "../stores/store";

    let socket = null;
    //const endpoint = "ws://localhost:4000/socket"
    const endpoint = "wss://inferno.black:5000/socket"

    const allScrolls = {
        //'10000001': 66,
        //'10000002': 66,
        //'10000003': 66,
        //'10000004': 66,
        //'10000005': 66,
        //'10000006': 66,
        //'10000007': 66,
        //'10000008': 168,
        '6660000000':    66,
        '6666000000':    66,
        '6666600000':    66,
        '6666660000':    66,
        '6666666000':    66,
        '6666666600':    66,
        '6666666660':    66,
        '6666666666':   168,
    };

    function updateStats(stats){
        Object.keys(allScrolls).forEach(k =>{
            const stat = stats.find(s => s[0]==k);
            allScrolls[k] = stat?stat[1]:0;
        })
        calculateMintedScrollCount()
        calculateMinMintPrice()
    }

    function addToken(token){
        const mappedToken = _mapToken(token)
        all_tokens.update(t=>{
            t = [mappedToken, ...t]
            return t;
        })
        finishRitualByResultingToken(token)
    }

    function setTimeline(mints){
        const mintRows = mints.map(row =>{
            return {
                time: (new Date(row[0]+ 'Z')).toString(),
                name: row[1],
                address: row[2],
                tx: row[3],
                id: row[4],
                is_creature: row[5],
                is_scroll: row[6],
                project: row[7],
                
            }
        }).filter(x=>x.project == $project). filter((x,i)=> i < 6);
        timeline.set(mintRows);
    }

    function _mapToken(x){
        const last_use  = x.last_use?(new Date(x.last_use+'Z')).getTime():null
        
        x.inserted_at   = x.inserted_at? new Date(x.inserted_at+'Z'):null
        x.updated_at    = x.updated_at? new Date(x.updated_at+'Z'):null
        x.last_use      = last_use
        x.cd_current    = last_use?(x.cd_minutes * 60 * 1000  - Date.now() + last_use)/1000:0

        return x;
    }

    function setTokens(tokens){
        all_tokens.set(tokens.filter(x=>x.token_id && x.project == $project).map(_mapToken).sort((a,b)=> {
            const d1 = new Date(a.inserted_at)
            const d2 = new Date(b.inserted_at)
            return d2.getTime() - d1.getTime()
        }));
    }

    function dbSlotToUISlot(dbSlot){
        if(dbSlot.bid_erg){
            return {
                    tribute: dbSlot.bid_erg / Math.pow(10,9),
            }
        }else{
            const creature = $all_tokens.find(t => t.token_id == dbSlot.assigned_creature_token_id);
            return {
                    tribute: null,
                    infernoImage: creature?.name,
                    inferno: creature,
            }
        }
    }

    function setSlots(slots){
        const sorted = slots.filter(s=> !s.done).sort((a,b)=> a.scroll_id - b.scroll_id)
        const rituals = []
        for(let i=0; i < sorted.length; i += 2){
            if(sorted[i].scroll_id != sorted[i+1].scroll_id){
                throw new Error("Slots do not match!")
            }
            if($all_tokens.some(t => t.id == sorted[i].scroll_id)){
                rituals.push({
                    id: sorted[i].scroll_id,
                    slotLeft: dbSlotToUISlot(sorted[i]),
                    slotRight: dbSlotToUISlot(sorted[i+1]),
                })
            }
        }

        all_rituals.set(rituals)
    }

    function finishRitualByResultingToken(token){
        const ritual = $all_rituals.find(r => r.id == token.from_ritual_id)
        if(ritual){
            const parents = token.parents.split(' ')
            const creature1 = $all_tokens.find(t => t.id ==parents[0])
            ritual.slotLeft.tribute = null;
            ritual.slotLeft.infernoImage = creature1.name;
            ritual.slotLeft.inferno = creature1;

            const creature2 = $all_tokens.find(t => t.id ==parents[1])
            ritual.slotRight.tribute = null;
            ritual.slotRight.infernoImage = creature2.name;
            ritual.slotRight.inferno = creature2;

            ritual.summonedCreature = token;
            performRitual(ritual)
        }

    }

    function addHalfRitual(halfRitual){
        console.log("halfRitual", {halfRitual})
        const inferno = $all_tokens.find(t=> t.id == halfRitual.creature_id)
        if(inferno?.project != $project){
            return;
        }
        const newRitual = {
            id: halfRitual.scroll_id,
            slotLeft: {
                tribute: null,
                infernoImage: inferno?.name,
                inferno: inferno
            },
            slotRight: {
                tribute: halfRitual.tribute / Math.pow(10,9),
            },
            testAnimation:false,
            showPortal:false,
        }
        all_rituals.update(ar =>{
            ar = [newRitual, ...ar.filter(r => r.id != halfRitual.scroll_id)]
            return ar;
        })
        notifier.success(`${halfRitual.address.slice(0,3)}...${halfRitual.address.slice(-3)} started a new Ritual!`, 8000);
    }

    function updateCooldowns(){
        all_tokens.update(at=>{
            at = at.map((x)=>{x.cd_current= x.last_use?(x.cd_minutes * 60 * 1000  - Date.now() + x.last_use)/1000:0; return x})
            return at;
        })
    }

    function calculateMintedScrollCount(){
        const sum = Object.keys(allScrolls).reduce((acc, k)=> acc + allScrolls[k],0);
        const totalMinted = 666 - sum
        minted_scrolls_count.set(totalMinted);
    }

    function calculateMinMintPrice(){
        const len = Object.keys(allScrolls).length
        let minPrice = '0';
        for(let i=0; i <len; i++){
            const key = Object.keys(allScrolls)[i];
            if (allScrolls[key] > 0){
                minPrice = key;
                break;
            }
        }
        min_mint_price.set(minPrice);
    }

    type MintEvent  = {
        name: string
        ipfs: string
        address: string
    }

    function ensureSocket() {
        if (window.phx_sock?.isConnected()) {
            return;
        }

        window.phx_sock = new Socket(endpoint, { params: { token: localStorage.getItem('bobo_jwt') } });
        window.phx_sock.connect();
    }
    function ensureChanel(topic) {
        if(!topic){
            topic = '';
        }
        let channel = window.phx_sock.channels.find(c => c.topic == `room:${topic}`);
        if (channel && channel.state == "joined") {
            return Promise.resolve(channel);
        }

        ensureSocket();

        channel = window.phx_sock.channel(`room:${topic}`, { token: localStorage.getItem('bobo_jwt') })
        channel.on("update", (obj)=> {
            console.log(obj)
        })
        channel.on("mint", (obj:MintEvent)=> {
            notifier.success(`${obj.address.slice(0,3)}...${obj.address.slice(-3)} minted ${obj.name}`, 8000);
        })
        channel.on("stats", (obj)=> {
            updateStats(obj.stats);
        })
        channel.on("token", (obj)=> {
            const token = JSON.parse(obj.token)
            if(token.project == $project){
                addToken(token);
            }
        })
        channel.on("all_tokens", (obj)=> {
            const all_tokens = JSON.parse(obj.tokens)
            setTokens(all_tokens);
        })
        channel.on("half_ritual", (obj)=> {
            addHalfRitual(obj);
        })

        return new Promise((resolve, reject) => {
            channel
                .join()
                .receive('ok', (res) => {
                    updateStats(res.stats);
                    setTimeline(res.mints);
                    setTokens(JSON.parse(res.tokens));
                    setSlots(JSON.parse(res.slots));
                    resolve(channel);
                })
                .receive('error', (err) => {
                    reject(err);
                });
        })
    }

    let n

    onMount(async ()=>{
        const p = $page.url.searchParams.get('project');
        if(p){
            project.set(p);
        }
        ensureSocket();
        const c = await ensureChanel("lobby")
        //console.log(c)
        //console.log(socket)
        if($cooldown_tik){
            clearInterval($cooldown_tik)
        }
        const intervall = setInterval(updateCooldowns,1000)
        cooldown_tik.set(intervall);
    })
</script>
<NotificationDisplay bind:this={n} />
<Nav></Nav>
<slot></slot>