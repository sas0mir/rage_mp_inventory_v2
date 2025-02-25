<script setup lang="js">

    const props = defineProps([
        'item'
    ])

    let item = props.item;
    let defaultIcon;
    let defaultName;
    let defaultStyle;

        
    const Bool = (text) => {
        return String(text).toLowerCase() === "true";
    }

    const GetClothesClass = (_iconInfo, _item) => {
        if (_iconInfo.functionType === ItemType.Clothes && _item.ItemId != -5 && _item.ItemId != -9 && _item.ItemId != -1 && _item.Data.split("_").length >= 2) {
            return Bool(item.Data.split("_")[2]) ? "clothesM" : "clothesF"
        }
        return "";
    }
</script>

<template>
    <div v-if="item && item.ItemId !== 0" :class="`box-item`">
        <span class="item-png">123</span>
    </div>

    <div v-else :class="`box-item gray`">
        <!-- on:mousedown on:mouseup on:mouseenter on:mouseleave -->
        <span :class="`icon`" >321</span>
    </div>
</template>