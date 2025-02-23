<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { executeClient } from './api/rage';
  import { ItemType, ItemId, itemsInfo } from './json/itemsinfo';
  import inventoryweapons from './json/inventoryweapons';
  import { useItemsStore } from './store/items_store';

  const itemsStore = useItemsStore();
  const {
    getAround,
    getBackpack,
    getEquipped,
    getAccesories,
    getWeapons,
    setItem
  } = itemsStore;
  console.log('GETWS->', getWeapons);
  const { weaponFirst, weaponSecond } = getWeapons;

  onMounted(() => {
    console.log('MOUNT->');
      // Инициализация инвентаря игрока
      window.events.addEvent("cef.inventory.InitData", InitData);
      window.events.addEvent("cef.inventory.InitMyData", InitMyData);
      window.events.addEvent("cef.inventory.UpdateSpecialVars", UpdateSpecialVars);
      // Инициализация инвентаря при взаимодействии с чем то
      window.events.addEvent("cef.inventory.InitOtherData", InitOtherData);
      // Инициализация инвентаря при трейде
      window.events.addEvent("cef.inventory.InitTradeData", InitTradeData);
      // Обновление слота в любом ивентаре
      window.events.addEvent("cef.inventory.UpdateSlot", UpdateSlot);
      // Инициализация инвентаря игрока
      window.events.addEvent("cef.inventory.TradeUpdate", TradeUpdate);
      // Инициализация инвентаря игрока
      window.events.addEvent("cef.inventory.tradeMoney", handleInputChange);
      // Обновление информации о бучтрых слотах
      window.events.addEvent("cef.inventory.fastSlots", FastSlots);
      // Закрытие инвентаря
      window.events.addEvent("cef.inventory.Close", Close);
      window.events.addEvent("cef.inventory.SlotToPrice", InitSlotToPrice);
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('mousedown', handleGlobalMouseDown);
      window.addEventListener('keyup', onKeyUp);
      window.addEventListener('keydown', onKeyDown);
  })

  onUnmounted(() => {
      // Инициализация инвентаря игрока
      window.events.removeEvent("cef.inventory.InitData", InitData);
      window.events.removeEvent("cef.inventory.InitMyData", InitMyData);
      window.events.removeEvent("cef.inventory.UpdateSpecialVars", UpdateSpecialVars);
      // Инициализация инвентаря при взаимодействии с чем то
      window.events.removeEvent("cef.inventory.InitOtherData", InitOtherData);
      // Инициализация инвентаря при трейде
      window.events.removeEvent("cef.inventory.InitTradeData", InitTradeData);
      // Обновление слота в любом ивентаре
      window.events.removeEvent("cef.inventory.UpdateSlot", UpdateSlot);
      // Обновление информации о items
      window.events.removeEvent("cef.inventory.Init", Init);
      // Инициализация инвентаря игрока
      window.events.removeEvent("cef.inventory.TradeUpdate", TradeUpdate);
      // Инициализация инвентаря игрока
      window.events.removeEvent("cef.inventory.tradeMoney", handleInputChange);
      // Обновление информации о бучтрых слотах
      window.events.removeEvent("cef.inventory.fastSlots", FastSlots);
      // Закрытие инвентаря
      window.events.removeEvent("cef.inventory.Close", Close);
      window.events.removeEvent("cef.inventory.SlotToPrice", InitSlotToPrice);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousedown', handleGlobalMouseDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('keydown', onKeyDown);
  })

  const handleSlotMouseUp = () => {
      if (selectItem.use === stageItem.info && clickTime >= new Date().getTime()) {
          const index = selectItem.index;
          const arrayName = selectItem.arrayName;
          const _sItem = getItemToIndex (index, arrayName);
          const _sInfoItem = window.getItem (_sItem.ItemId);

          if (selectItem.arrayName === "other" || selectItem.arrayName === "backpack") {
              let MaxStakcItems = 0;
              if ((MaxStakcItems = getMaxStakcItems (_sItem, _sInfoItem)) == -1) {
                  itemNoUse (2);
                  return;
              }
              if (MaxStakcItems > 0) executeClient ("client.gamemenu.inventory.stack", arrayName, index, 2, MaxStakcItems);
              else executeClient ("client.gamemenu.inventory.stack", arrayName, index, 2, _sItem.Count);
          } else if (_sInfoItem.functionType === ItemType.Cases && itemIdCaseToId [Number (_sItem.ItemId)] !== undefined) {
              window.router.setPopUp("PopupRoulette", itemIdCaseToId [Number (_sItem.ItemId)]);
          } else if (OtherSqlId && Number (OtherSqlId) === Number (_sItem.SqlId)) {
              closeOther ();
              executeClient ("client.gamemenu.inventory.use", arrayName, index);                
          } else executeClient ("client.gamemenu.inventory.use", arrayName, index);
          itemNoUse (3);
      }
      else if (selectItem.use === stageItem.get || selectItem.use === stageItem.info) {
          //if (getItemsUse (selectItem) !== false && (arrayName === "accessories" || arrayName === "inventory" || arrayName === "backpack" || arrayName === "other" || arrayName === "other")) {
              const index = selectItem.index;

              const arrayName = selectItem.arrayName;

              if (updateItem(index, arrayName, "hover")) {
                  selectItem = {
                      ...getItemToIndex(index, arrayName),
                      use: stageItem.info,
                      index: index,
                      arrayName: arrayName
                  }
              } else selectItem = defaulSelectItem;
          //} else itemNoUse (4);
      }
  }

  const handleMouseDown = (event, index, arrayName) => {
      if (event.which == 1) {
          executeClient ("sounds.playInterface", "inventory/keys", 0.005);
          
          const item = getItemToIndex(index, arrayName);

          if (((selectItem.use === stageItem.info && (selectItem.index !== index || selectItem.arrayName !== arrayName)) ||
              selectItem.use !== stageItem.info) && item.ItemId != 0 && item.use) {

              if (arrayName === "other" && OtherInfo.Id === otherType.Nearby) {
                  if (OtherInfo.Id === otherType.Nearby && item.remoteId) 
                      return executeClient ("client.gamemenu.inventory.nearby", item.remoteId);
              } else if (arrayName === "other" && OtherInfo.Id === otherType.Tent) {

                  let _infoItem = window.getItem (item.ItemId);

                  const _selectItem = {
                      ...item,
                      use: stageItem.useItem,
                      index: index,
                      arrayName: arrayName,
                      tent: true,
                      info: _infoItem
                  }

                  unHoverAll ();
                  updateItem(index, arrayName, "hover", true);
                  infoItem = defaulHoverItem;
                  
                  coords.set({ x: event.clientX, y: event.clientY });

                  clickTime = new Date().getTime() + 200;
                  
                  StackValue.value = 1;

                  selectItem = _selectItem;
                  if (item.Count > 1) {
                      rangeslidercreate (item.Count);
                  }

                  return;
              }
              if (OtherSqlId && Number (OtherSqlId) === Number (getItemToIndex(index, arrayName).SqlId)) {
                  closeOther ();
              }

              itemNoUse (9);

              const target = event.target.getBoundingClientRect();

              const offsetInElementX = (target.width - (target.right - event.clientX));
              const offsetInElementY = (target.height - (target.bottom - event.clientY));

              coords.set({ x: event.clientX, y: event.clientY });

              clickTime = new Date().getTime() + 1000;
              selectItem = {
                  ...getItemToIndex(index, arrayName),
                  use: stageItem.get,
                  width: target.width,
                  height: target.height,
                  offsetInElementX: offsetInElementX,
                  offsetInElementY: offsetInElementY,
                  clientX: event.clientX,
                  clientY: event.clientY,
                  index: index,
                  arrayName: arrayName
              }

              mouseLeaveSelectedItem = false;

          }
      } else if (event.which == 3 && (arrayName !== "other" || (arrayName === "other" && OtherInfo.Id !== otherType.Nearby && OtherInfo.Id !== otherType.Tent)) && ItemsData[arrayName][index].ItemId != 0 && getItemToIndex(index, arrayName).use) {
          const item = getItemToIndex(index, arrayName);

          const _selectItem = {
              ...item,
              use: stageItem.useItem,
              index: index,
              arrayName: arrayName
          }
          if (getItemsUse (selectItem) === false && OtherInfo.Id <= otherType.None && item.Count <= 0 && getDropItem (arrayName, item.ItemId) === false) return;

          unHoverAll ();
          updateItem(index, arrayName, "hover", true);
          infoItem = defaulHoverItem;
          
          coords.set({ x: event.clientX, y: event.clientY });

          selectItem = _selectItem;
      }
  }

  //Глобальные
  const handleGlobalMouseMove = (event) => {
      if (!visible) return;
      else if (isMoveBlock) {
          moveBlock[isMoveBlock] = [
              event.clientY - selectItem.offsetInElementY,
              event.clientX - selectItem.offsetInElementX
          ]
          
          if (moveBlock[isMoveBlock][0] + selectItem.height > window.innerHeight) moveBlock[isMoveBlock][0] = window.innerHeight - selectItem.height;
          else if (moveBlock[isMoveBlock][0] < 0) moveBlock[isMoveBlock][0] = 0;

          if (moveBlock[isMoveBlock][1] + selectItem.width > window.innerWidth) moveBlock[isMoveBlock][1] = window.innerWidth - selectItem.width;
          else if (moveBlock[isMoveBlock][1] < 0) moveBlock[isMoveBlock][1] = 0;
      }
      else if (infoItem !== defaulHoverItem) {
          boxInfoLeft = fixOutToCenter($coords.x, boxItemInfo.value);
          boxInfoTop = fixOutToTop($coords.y, boxItemInfo.value);
      }
      else if ((selectItem.use === stageItem.move && infoItem === defaulHoverItem) || (selectItem.use !== stageItem.useItem && selectItem.use !== stageItem.get && infoItem === defaulHoverItem)) {
          let clientX = event.clientX;
          let clientY = event.clientY;
          
          if (clientY + selectItem.height > window.innerHeight) clientY = window.innerHeight - selectItem.height;
          else if (clientY < 0) clientY = 0;

          if (clientX + selectItem.width > window.innerWidth) clientX = window.innerWidth - selectItem.width;
          else if (clientX < 0) clientX = 0;
          
          coords.set({ x: clientX, y: clientY });

      } else if (selectItem.use === stageItem.get && (selectItem.clientX !== event.clientX || selectItem.clientY !== event.clientY)) {
          unHoverAll ();
          selectItem = {
              ...selectItem,
              use: stageItem.move,
          }
          let clientX = event.clientX;
          let clientY = event.clientY;
          
          if (clientY + selectItem.height > window.innerHeight) clientY = window.innerHeight - selectItem.height;
          else if (clientY < 0) clientY = 0;

          if (clientX + selectItem.width > window.innerWidth) clientX = window.innerWidth - selectItem.width;
          else if (clientX < 0) clientX = 0;

          coords.set({ x: clientX, y: clientY });            
      }
  }

  const onUseItem = () => {
      if (selectItem.use === stageItem.useItem) {
          const selectIndex = selectItem.index;
          const selectArrayName = selectItem.arrayName;

          const Item = getItemToIndex(selectIndex, selectArrayName);
          const InfoItem = window.getItem (Item.ItemId);

          if (InfoItem.functionType === ItemType.Cases && itemIdCaseToId [Number (Item.ItemId)] !== undefined) {
              window.router.setPopUp("PopupRoulette", itemIdCaseToId [Number (Item.ItemId)] );
          } else if (OtherSqlId && Number (OtherSqlId) === Number (Item.SqlId)) {
              closeOther ();
          } else {
              executeClient ("client.gamemenu.inventory.use", selectArrayName, selectIndex);
          }
          itemNoUse (10);
      }
  }

  const onDropItem = () => {
      if (selectItem.use === stageItem.useItem) {
          const selectIndex = selectItem.index;
          const selectArrayName = selectItem.arrayName;

          if (selectItem.Count > 1) {
              ItemStack = 1;
              rangeslidercreate (selectItem.Count);
          } else {
              itemNoUse (11);
              executeClient ("client.gamemenu.inventory.drop", selectArrayName, selectIndex);
          }
      }
  }

  const onTransfer = () => {
      if (selectItem.use === stageItem.useItem) {
          const selectIndex = selectItem.index;
          const selectArrayName = selectItem.arrayName;

          if (selectItem.Count > 1) {
              ItemStack = 2;
              rangeslidercreate (selectItem.Count);
          } else {            
              const _sItem = getItemToIndex (selectIndex, selectArrayName);
              const _sInfoItem = window.getItem (_sItem.ItemId);
              if (selectItem.arrayName !== "other" && isMove (selectIndex, "other", _sItem, _sInfoItem) == -2) {
                  itemNoUse (12);
                  return;
              } else if ((selectItem.arrayName === "other" || selectItem.arrayName === "backpack") && getMaxStakcItems (_sItem, _sInfoItem) != 0) {
                  itemNoUse (13);
                  return;
              }
              executeClient ("client.gamemenu.inventory.stack", selectArrayName, selectIndex, 2, 1);
              itemNoUse (14);
          }
      }
  }


  const handleGlobalMouseUp = (event) => {
      if (!visible) return;
      else if (event.which !== 1) return;
      if (isMoveBlock) {
          selectItem = defaulSelectItem;
          isMoveBlock = false;
          return;
      }
      else if (selectItem.use === stageItem.move) {
          if (hoverItem === defaulHoverItem && tradeInfo.Active === false && selectItem !== defaulSelectItem && getDropItem (selectItem.arrayName, selectItem.ItemId) !== false) {
              const selectIndex = selectItem.index;
              const selectArrayName = selectItem.arrayName;
              //const _Item = window.getItem (id, arrayName);
              
              // Если мышка покинула первоначальную ячейку, и перенос был в несуществубщую ячейку, то дропаем
              if (mouseLeaveSelectedItem === true && mainInventoryArea === false/* && (selectArrayName === "inventory" || selectArrayName === "backpack")*/) {
                  
                  executeClient ("client.gamemenu.inventory.drop", selectArrayName, selectIndex);                    
              }
              itemNoUse(18);
          } else if (hoverItem !== defaulHoverItem && (hoverItem.index !== selectItem.index || hoverItem.arrayName !== selectItem.arrayName)) {
              //Item на который наводимся
              let hoverIndex = hoverItem.index;
              const hoverArrayName = hoverItem.arrayName;
              let _hItem = getItemToIndex (hoverIndex, hoverArrayName);
              let _hInfoItem = window.getItem (_hItem.ItemId);
              //Выбранный
              let selectIndex = selectItem.index;
              const selectArrayName = selectItem.arrayName;
              let _sItem = getItemToIndex (selectIndex, selectArrayName);
              let _sInfoItem = window.getItem (_sItem.ItemId);

              let returnMove = -1;
              if (!_hItem.use || hoverArrayName === "with_trade") {
                  itemNoUse (19);
                  window.notificationAdd(4, 9, translateText('player1', 'Данный слот не доступен!'), 3000);
                  return;
              } else if ((hoverArrayName === "accessories" || hoverArrayName === "fastSlots") && selectArrayName !== "inventory") {
                  itemNoUse (20);
                  window.notificationAdd(4, 9, translateText('player1', 'Сначала переложите предмет в собственный инвентарь!'), 3000);
                  return;
              } else if ((selectArrayName === "accessories" || selectArrayName === "fastSlots") && hoverArrayName !== "inventory") {
                  itemNoUse (21);
                  window.notificationAdd(4, 9, translateText('player1', 'Сначала переложите предмет в собственный инвентарь!'), 3000);
                  return;
              } else if (hoverArrayName === "other" && OtherInfo.Id === otherType.Nearby) {
                  executeClient ("client.gamemenu.inventory.drop", selectArrayName, selectIndex);   
                  itemNoUse(18);
                  return;
              }          
              
              if (hoverArrayName !== selectArrayName && (returnMove = isMove (hoverIndex, hoverArrayName, _sItem, _sInfoItem)) == -2) {
                  itemNoUse (22);
                  return;
              }
              
              if (hoverArrayName === "other" && OtherInfo.Id === otherType.Tent && OtherInfo.IsMyTent) {
                  executeClient ("client.gamemenu.inventory.stack", selectArrayName, selectIndex, 2, _sItem.Count);
                  itemNoUse(18);
                  return;
              }  

              if (returnMove !== -1) {
                  hoverIndex = returnMove;
                  _hItem = getItemToIndex (hoverIndex, hoverArrayName);
                  _hInfoItem = window.getItem (_hItem.ItemId);
                  if (isMove (hoverIndex, hoverArrayName, _sItem, _sInfoItem) == -2) {
                      itemNoUse (23);
                      return;
                  }
              }
              returnMove = -1;
              
              if (hoverArrayName !== selectArrayName && (returnMove = isMove (selectIndex, selectArrayName, _hItem, _hInfoItem)) == -2) {
                  itemNoUse (24);
                  return;
              }

              if (returnMove !== -1) {
                  selectIndex = returnMove;
                  _sItem = getItemToIndex (selectIndex, selectArrayName);
                  _sInfoItem = window.getItem (_sItem.ItemId);
              
                  if (isMove (selectIndex, selectArrayName, _hItem, _hInfoItem) == -2) {
                      itemNoUse (25);
                      return;
                  }
              }

              let MaxStakcItems = 0;
              if ((hoverArrayName !== "other" && hoverArrayName !== "backpack") && (selectArrayName === "other" || selectArrayName === "backpack") && ![0, 237, 238, 239, 240, 241, 242, 245, 246, 247].includes (_sItem.ItemId) && (MaxStakcItems = getMaxStakcItems (_sItem, _sInfoItem)) == -1) {
                  //window.notificationAdd(4, 9, `Нет места для ${itemInfo.Name}, максимум можно иметь при себе - ${itemInfo.Stack} шт. | У вас ${count + item.Count} шт.`, 3000);
                  itemNoUse (26);
                  return;
              }

              if (MaxStakcItems > 0) {
                  if (_hItem.ItemId === _sItem.ItemId || _hItem.ItemId === 0) {
                      executeClient ("client.gamemenu.inventory.move.stack", selectArrayName, selectIndex, hoverArrayName, hoverIndex, MaxStakcItems);
                      /*if (_hItem.ItemId === _sItem.ItemId && _hItem.Count === _sInfoItem.Stack) {                            
                          setItem (hoverIndex, hoverArrayName, _sItem);
                          setItem (selectIndex, selectArrayName, _hItem);
                      }
                      else */if (_hItem.ItemId === _sItem.ItemId) {
                          _hItem.Count += MaxStakcItems;
                          _sItem.Count -= MaxStakcItems;
                          setItem (hoverIndex, hoverArrayName, _hItem);
                          setItem (selectIndex, selectArrayName, _sItem);
                          executeClient ("sounds.playInterface", "inventory/drag_drop", 0.05);
                      } else {
                          _sItem.Count -= MaxStakcItems;
                          setItem (selectIndex, selectArrayName, _sItem);
                          _hItem = _sItem;
                          _hItem.Count = MaxStakcItems;
                          setItem (hoverIndex, hoverArrayName, _hItem);
                          executeClient ("sounds.playInterface", "inventory/drag_drop", 0.05);
                      }
                  }
                  else window.notificationAdd(4, 9, `${translateText('player1', 'Нет места для')} ${_sInfoItem.Name}, ${translateText('player1', 'максимум можно иметь при себе')} - ${_sInfoItem.Stack} ${translateText('player1', 'шт.')}`, 3000);
                  itemNoUse (27);
                  return;
              }

              MaxStakcItems = 0;
              if ((selectArrayName !== "other" && selectArrayName !== "backpack") && (hoverArrayName === "other" || hoverArrayName === "backpack") && ![0, 237, 238, 239, 240, 241, 242, 245, 246, 247].includes (_hItem.ItemId) && _hItem.ItemId != _sItem.ItemId && (MaxStakcItems = getMaxStakcItems (_hItem, _hInfoItem)) == -1) {
                  itemNoUse (28);
                  return;
              }

              if (MaxStakcItems > 0) {
                  /*if (_hItem.Count === _hInfoItem.Stack) {      
                      executeClient ("client.gamemenu.inventory.move.stack", selectArrayName, selectIndex, hoverArrayName, hoverIndex, MaxStakcItems);                      
                      setItem (hoverIndex, hoverArrayName, _sItem);
                      setItem (selectIndex, selectArrayName, _hItem);
                  } else */if (_hItem.ItemId === _sItem.ItemId) {
                      executeClient ("client.gamemenu.inventory.move.stack", selectArrayName, selectIndex, hoverArrayName, hoverIndex, MaxStakcItems);
                      _sItem.Count += MaxStakcItems;
                      _hItem.Count -= MaxStakcItems;
                      setItem (hoverIndex, hoverArrayName, _hItem);
                      setItem (selectIndex, selectArrayName, _sItem);
                      executeClient ("sounds.playInterface", "inventory/drag_drop", 0.05);
                  }
                  else window.notificationAdd(4, 9, `${translateText('player1', 'Нет места для')} ${_sInfoItem.Name}, ${translateText('player1', 'максимум можно иметь при себе')} - ${_sInfoItem.Stack} ${translateText('player1', 'шт.')}`, 3000);
                  itemNoUse (29);
                  return;
              }
              executeClient ("client.gamemenu.inventory.move", selectArrayName, selectIndex, hoverArrayName, hoverIndex);

              //{"Name":"Маска","Description":"","Icon":"item-pizza","Type":"Одежда","Model":3887136870,"Stack":1,"functionType":1}                
              if (_hItem.ItemId === _sItem.ItemId && Number (_hInfoItem.Stack) > 1 && Number (_hInfoItem.Stack) > _sItem.Count && Number (_hInfoItem.Stack) > _hItem.Count) {
                  const amount = (_hItem.Count === undefined || _hItem.Count < 2 || !isNumber(_hItem.Count)) ? 1 : _hItem.Count;

                  if (Number (_hInfoItem.Stack) >= (amount + _sItem.Count)) {
                      _sItem.Count += amount;
                      setItem (hoverIndex, hoverArrayName, _sItem);
                      setItem (selectIndex, selectArrayName, clearSlot);
                  } else {
                      _hItem.Count = (amount + _sItem.Count) - _hInfoItem.Stack;
                      _sItem.Count = _hInfoItem.Stack;
                      setItem (hoverIndex, hoverArrayName, _sItem);
                      setItem (selectIndex, selectArrayName, _hItem);
                  }
              } else {
                  setItem (hoverIndex, hoverArrayName, _sItem);
                  setItem (selectIndex, selectArrayName, _hItem);
              }
              executeClient ("sounds.playInterface", "inventory/drag_drop", 0.05);
          }
          itemNoUse (30, true);
      }
  }

</script>

<template>
    <div class="inventory_container">
        <div class="ic_weapons">
            <weapon-slot :position="first" :item="weaponFirst"></weapon-slot>
            <weapon-slot :position="second" :item="weaponSecond"></weapon-slot>
        </div>
        <div class="ic_content">
            <list></list>
            <equipment></equipment>
            <list></list>
        </div>
    </div>
</template>

<style scoped>
    .inventory_container {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 70%;
        height: 70%;
        margin: 0 auto;
        align-self: center;
    }

@media (min-width: 1024px) {
  
}
</style>
