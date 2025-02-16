<script setup lang="js">
    const props = defineProps({
        item,
    })
</script>

<template>
    <section class="weapon_container">
        <div v-if="item" class="wc_header">
            <p>{{ item.name }}</p>
            <p>{{ item.description }}</p>
        </div>
        <img class="wc_image" :src="item.image" :alt="item.name" />
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
        display: flex;
        justify-content: space-between;
    }
    .wc_image {
        height: 100%;
        aspect-ratio: 1/1;
        /* object-fit: contain; */
    }
</style>