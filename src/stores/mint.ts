import { writable } from "svelte/store";

export const mint = writable({
    genesisTotalMinted: 1,
    userHasWLInvite: false,
    userWLToken: null,
    userJustMinted: false,
})