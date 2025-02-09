<script setup lang="js">
    import { ItemType, itemsInfo, ItemId } from './json/itemsinfo'
    import { getPng } from './getPng.js'

    let item;
    let defaultIcon;
    let defaultName;
    let defaultStyle;

    let iconInfo = itemsInfo[item.ItemId];
        
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
    <div v-if="item && item.ItemId !== 0" :class="`box-item ${defaultStyle} ${GetClothesClass(iconInfo, item)} ${item.active ? 'active' : ''} ${item.anim ? 'anim' : 'noAnim'} ${!item.use ? 'noUse' : ''}`">
        <span class="item-png" :style="{backgroundImage: url(getPng(item, iconInfo))}"></span>
        <div v-if="defaultIcon === undefined && item.Count > 1 && item.ItemId !== 19 && iconInfo.functionType !== ItemType.Clothes && iconInfo.functionType !== ItemType.Weapons" class="count">{{item.Count}}</div>
        <div v-if="item.ItemId === 19 && item.Data.split('_') && item.Data.split('_').length >= 1" class="count">{{item.Data.split("_")[0]}}</div>
        <div v-if="defaultIcon === undefined && iconInfo.functionType === 1 && item.ItemId != -5 && item.ItemId != -9 && item.ItemId != -1 && item.Data.split('_').length >= 2" class="count">{{Bool(item.Data.split('_')[2]) ? "М" : "Ж"}}</div>
        <div v-if="defaultIcon === undefined && item.ItemId == -9" class="count">{{item.Data}}</div>
        <div v-if="defaultIcon === undefined && item.ItemId == ItemId.SimCard" class="count">{{item.Data}}</div>
        <div v-if="defaultIcon === undefined && item.ItemId == ItemId.VehicleNumber" class="count">{{item.Data}}</div>
    </div>

    <div v-else :class="`box-item gray ${defaultStyle} ${item.active ? 'active' : ''} ${item.anim ? 'anim' : 'noAnim'} ${!item.use ? 'noUse' : ''} ${item.hover ? 'hover' : ''}`">
        <!-- on:mousedown on:mouseup on:mouseenter on:mouseleave -->
        <span v-if="defaultIcon != undefined" :class="`${defaultIcon} icon`" ></span>
        <div v-if="defaultName != undefined" class="box-item-name">{{defaultName}}</div>
    </div>
</template>