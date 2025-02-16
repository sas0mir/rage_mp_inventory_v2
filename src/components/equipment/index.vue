<script setup lang="js">

    import Slot from '../slot/index.vue'
    const props = defineProps({
        player,
        accesories,
        clothes_head,
        clothes_vest,
        clothes_other,
        clothes_shirt,
        clothes_pants,
        clothes_shoes,
    })

    const head = props.clothes_head;
    const vest = props.clothes_vest;
    const other = props.clothes_other;
    const shirt = props.clothes_shirt;
    const pants = props.clothes_pants;
    const shoes = props.clothes_shoes;
</script>

<template>
    <section class="equipment_container">
        <h3 v-if="player.name" class="ec_header">{{ player.name }}</h3>
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
    </section>
</template>

<style>
    .weapon_container {
        position: relative;
        display: block;
        width: 40%;
        height: 100%;
        padding: 0;
        margin: 0;
    }
    .wc_header {
        font-size: 1rem;
    }
    .ec_clothes_container {
        display: flex;
        justify-content: space-between;
    }
    .ec_clothes_column {
        
    }
</style>