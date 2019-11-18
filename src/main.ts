import Vue from 'vue';

import router from '@/common/router';
import store from '@/common/store';

import app from '@/app.vue';

import ElementUI from 'element-ui';

import 'font-awesome/css/font-awesome.min.css';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';

import { ApiServicePlugin } from '@/common/api.service';

Vue.use(ElementUI);
Vue.use(ApiServicePlugin);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h: any): any => h(app)
}).$mount('#app');
