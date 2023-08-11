import { createRouter, createWebHashHistory } from 'vue-router';

import Layout from '@/Layout/index.vue';

export const constantRoutes = [
	{
		path: '/404',
		component: () => import('@/views/error-page/404.vue'),
		hidden: true,
	},
	{
		path: '/401',
		component: () => import('@/views/error-page/401.vue'),
		hidden: true,
	},
	{
		path: '',
		component: Layout,
		redirect: 'index',
		children: [
			{
				path: 'index',
				component: () => import('@/views/dashboard/index.vue'),
				name: '首页',
				meta: { title: '首页', noCache: true, affix: true },
			},
		],
	},
];

export const asyncRoutes = [];

const scrollBehavior = (_to, _form, savePosition) => {
	if (savePosition) return savePosition;
	return { top: 0, left: 0 };
};

const routerFactory = () =>
	createRouter({
		scrollBehavior: scrollBehavior,
		history: createWebHashHistory(),
		routes: constantRoutes,
	});

const router = routerFactory();

/**  reset router */
export const resetRouter = () => {
	const newRouter = createRouter();
	router.matcher = newRouter.matcher; // reset router
};

export default router;
