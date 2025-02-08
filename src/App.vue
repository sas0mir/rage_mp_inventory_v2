<script setup>
  import { ref, onMounted } from 'vue';
  import { translateText } from './lang';
  import { executeClient } from './api/rage';
  import { format } from './api/formatter'
  import { ItemType, ItemId, itemsInfo } from './json/itemsinfo';
  import { clothesData, ItemToWeaponHash, WeaponHashToItem, stageItem, clearSlot, defaulSelectItem, defaulHoverItem, maxSlots, otherName, otherType, clothes, clothesId, clothesName, itemIdCaseToId } from './functions.js';
  import wComponents from './wComponents.js';
  import wMaxHP from './wMaxHP.js';
  import rangeslider from './components/rangeslider';
  import slot from './slot.vue';
  import { useMotion as spring } from '@vueuse/motion/index';
  import { getPng } from './getPng';
  //to do fonts

  const charGender = ref(false);
  const charMoney = ref(0);

  onMounted(() => {

  })

</script>

<template>
  
</template>

<style scoped>


@media (min-width: 1024px) {
  
}
</style>
