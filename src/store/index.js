import { defineStore } from "pinia";

export const useItemsStore = defineStore('items', {
    state: () => ({
        weapon_first: null,
        weapon_second: null,
        clothes_head: null,
        clothes_vest: null,
        clothes_other: null,
        clothes_shirt: null,
        clothes_pants: null,
        clothes_shoes: null,
        accesories: [],
        around: [],
        backpack: []
    }),
    getters: {
        getAround: (state) => state.around,
        getBackpack: (state) => state.backpack,
        getEquipped: (state) => {
            state.clothes_head,
            state.clothes_vest,
            state.clothes_other,
            state.clothes_shirt,
            state.clothes_pants,
            state.clothes_shoes
        },
        getAccesories: (state) => state.accesories,
        getWeapons: (state) => { state.weapon_first. state.weapon_second }
    },
    actions: {
        setState(slot, item, index) {
            if (['accesories', 'around', 'backpack'].indexOf(slot) >= 0) {
                this[slot][index] = item
            } else this[slot] = item
        }
    }
})