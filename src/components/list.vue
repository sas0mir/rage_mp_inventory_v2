<script setup lang="js">
    import { useItemsStore } from '@/store/items_store';

    const props = defineProps(['position']);
    const { position } = props;

    const itemsStore = useItemsStore();
    const { getAround, getBackpack } = itemsStore;

    const items = position === 'around' ? getAround : getBackpack;
</script>

<template>
    <div class="list_container">
        <template v-for="item in items" :key="item.itemId">
            <div class="list_item">
                <p>{{ item.name }}</p>
            </div>
        </template>
    </div>
</template>

<style>
    .list_container {
        position: relative;
        display: block;
        width: 20%;
        height: 100%;
        padding: 0;
        margin: 0;
        background-color: rgba(0, 0, 0, 0.75);
    }
</style>