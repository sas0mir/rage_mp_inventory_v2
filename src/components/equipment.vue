<script setup lang="js">
    import { useItemsStore } from '@/store/items_store';

    const props = defineProps(['player']);
    const { player } = props;
    const itemsStore = useItemsStore();
    const {
        getAround,
        getBackpack,
        getEquipped,
        getAccesories,
        getWeapons,
        setItem
    } = itemsStore;

    const { head, vest, other, shirt, pants, shoes } = getEquipped;
</script>

<template>
    <section class="equipment_container">
        <h3 class="ec_header">{{ player ? player.name : 'Player' }}</h3>
        <div class="ec_clothes_container">
            <div class="ec_clothes_column">
                <Slot :item="head"></Slot>
                <Slot :item="vest"></Slot>
                <Slot :item="other"></Slot>
            </div>
            <div class="ec_clothes_column">
                <Slot :item="shirt"></Slot>
                <Slot :item="pants"></Slot>
                <Slot :item="shoes"></Slot>
            </div>
        </div>
        <div class="ec_accesories_container"></div>
        <div class="ec_stats_container"></div>
    </section>
</template>

<style>
    .equipment_container {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 40%;
        height: 100%;
        padding: 0;
        margin: 0;
        background-color: rgba(0, 0, 0, 0.75);
    }
    .ec_header {
        flex: 1 1 5%;
        text-align: center;
        font-size: 1rem;
        text-transform: uppercase;
        padding: 1rem;
        color: white;
    }
    .ec_clothes_container {
        width: 100%;
        height: 50%;
        background-image: url("../assets/bg_player.png");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        flex: 4 0 50%;
    }
    .ec_accesories_container {
        flex: 1 0 15%;
    }
    .ec_stats_container {
        flex: 1 0 25%;
    }
</style>