import { createRouter, createWebHashHistory } from 'vue-router';

import Layout from '@/Layout/index.vue';

export const constantRoutes = [];

export const asyncRoutes = [];

const scrollBehavior = (_to, _form, savePosition) => {
	if (savePosition) return savePosition;
	return { top: 0, left: 0 };
};

const routerFactory = () => {
	createRouter({
		scrollBehavior: scrollBehavior,
		history: createWebHashHistory(),
		routes: constantRoutes,
	});
};

const router = routerFactory();

/**  reset router */
export const resetRouter = () => {
	const newRouter = createRouter();
	router.matcher = newRouter.matcher; // reset router
};

export default router;
