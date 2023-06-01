import { createApp } from 'vue';
import { Chart, registerables } from 'chart.js';
import VueChartkick from 'vue-chartkick';
import 'chartkick/chart.js';

import App from './App.vue';

const app = createApp(App);

// Register Chart.js and VueChartkick
Chart.register(...registerables);
app.use(VueChartkick, { adapter: Chart });

app.mount('#app');
