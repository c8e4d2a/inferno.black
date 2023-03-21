import * as fs from "fs";

const wlTokensMeta = [
    {wl:"pjthu", seed: 6641},
    {wl:"refdh", seed: 653},
    {wl:"sbi0y", seed: 8684},
    {wl:"57n65", seed: 803},
    {wl:"6q17z", seed: 3625},
    {wl:"69bqu", seed: 7526},
    {wl:"dct7i", seed: 1213},
    {wl:"0qiuw", seed: 7129},
    {wl:"fs729", seed: 4815},
    {wl:"0t2gy", seed: 1765},
    {wl:"xh1dw", seed: 2281},
    {wl:"d7sou", seed: 7025},
    {wl:"hwyxa", seed: 6126},
    {wl:"lwuk9", seed: 4056},
    {wl:"3ckln", seed: 8582},
    {wl:"c33qu", seed: 2939},
    {wl:"lhm95", seed: 545},
    {wl:"i3fwx", seed: 4219},
    {wl:"xkn65", seed: 2315},
    {wl:"yud4j", seed: 9440},
    {wl:"zw2iz", seed: 5751},
    {wl:"02aee", seed: 9025},
    {wl:"zehzk", seed: 6930},
    {wl:"3gb3n", seed: 4600},
    {wl:"75c27", seed: 469},
    {wl:"atp31", seed: 3945},
    {wl:"now5c", seed: 7609},
    {wl:"y47j6", seed: 2271},
    {wl:"xepwc", seed: 6260},
    {wl:"is98m", seed: 4500},
    {wl:"oylcu", seed: 3410},
    {wl:"ohu9k", seed: 8999},
    {wl:"oo3dg", seed: 1912},
    {wl:"j6bop", seed: 1505},
    {wl:"5ur9j", seed: 2957},
    {wl:"gmgma", seed: 2045},
    {wl:"1d1ck", seed: 404},
]

const wlTokens = [
    "pjthu",
    "refdh",
    "sbi0y",
    "57n65",
    "6q17z",
    "69bqu",
    "dct7i",
    "0qiuw",
    "fs729",
    "0t2gy",
    "xh1dw",
    "d7sou",
    "hwyxa",
    "lwuk9",
    "3ckln",
    "c33qu",
    "lhm95",
    "i3fwx",
    "xkn65",
    "yud4j",
    "zw2iz",
    "02aee",
    "zehzk",
    "3gb3n",
    "75c27",
    "atp31",
    "now5c",
    "y47j6",
    "xepwc",
    "is98m",
    "oylcu",
    "ohu9k",
    "oo3dg",
    "j6bop",
    "5ur9j",
    "gmgma",
    "1d1ck",
]

function randomSeed(){
    let seed = Math.floor(Math.random() * 9999);
    while(wlTokensMeta.some(x => x.seed == seed)){
        seed = Math.floor(Math.random() * 9999);
    }
    return seed;
}


/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {

    let minted = wlTokens.filter(wl =>{
        const path = `./${wl}.txt`;
        if (fs.existsSync(path)) {
            return true;
        }
        return false;
    })
    
    return { minted };
}

/** @type {import('./$types').Actions} */
export const actions = {
    mint: async ({ cookies, request }) => {
        const data = await request.formData();
        const txId = data.get('txId');
        const wl = data.get('wl');
        if(wlTokens.some(x => x == wl?.toLowerCase())){
            const path = `./${wl}.txt`;

            if (fs.existsSync(path)) {
                console.log("ALREADY MINTED:",new Date(),  {wl, txId})
                return { success: true };
            }
            console.log("MINT:",new Date(),  {wl, txId})

            let text = JSON.stringify({txId, wl, date: new Date()});
            fs.writeFileSync(`./${wl}.txt`, text);
        }

        return { success: true };
    },

    seed: async ({ cookies, request }) => {
        const data = await request.formData();
        const wl = data.get('wl');
        if(wlTokensMeta.some(x => x.wl == wl?.toLowerCase())){
            return { seed: wlTokensMeta.find(x => x.wl == wl?.toLowerCase())?.seed??0 }
        }
            return { seed: randomSeed() };
    },
};