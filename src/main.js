import { createApp } from 'vue';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

// import '@/styles/index.scss' // global css
import router from '@/router';
import App from './App.vue';

const app = createApp(App);

const render = () => {
	app.use(router);
	app.use(ElementPlus, {
		locale: zhCn,
	});
};

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
	render();
}

app.mount('#app');
