import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import Slot from './components/slot.vue';
import weapon_slot from './components/weapon_slot.vue';
import equipment from './components/equipment.vue';
import list from './components/list.vue';

const pinia = createPinia();
const app = createApp(App);

app.component('Slot', Slot)
    .component('WeaponSlot', weapon_slot)
    .component('Equipment', equipment)
    .component('List', list);

app.use(pinia);
app.mount('#app');
