import { defineStore } from 'pinia';
import Layout from '@/Layout/index.vue';
import ParentView from '@/views/parent-view/index.vue';
import { getRouters } from '@/api/user/permission';
import { constantRoutes } from '@/router';

const filterChildren = (childrenMap) => {
	var children = [];
	childrenMap.forEach((el, index) => {
		if (el.children && el.children.length) {
			if (el.component === 'ParentView') {
				el.children.forEach((c) => {
					c.path = el.path + '/' + c.path;
					if (c.children && c.children.length) {
						children = children.concat(filterChildren(c.children));
						return;
					}
					children.push(c);
				});
				return;
			}
		}
		children = children.concat(el);
	});
	return children;
};

export const loadView = (view) => {
	// 路由懒加载
	const modules = import.meta.glob('@/views/*/*.vue');
	return modules[`/src/views/${view}.vue`];
};

// 遍历后台传来的路由字符串，转换为组件对象
const filterAsyncRouter = (asyncRouterMap, isRewrite = false) => {
	return asyncRouterMap.filter((route) => {
		if (isRewrite && route.children) {
			route.children = filterChildren(route.children);
		}
		if (route.component) {
			// Layout ParentView 组件特殊处理
			if (route.component === 'Layout') {
				route.component = Layout;
			} else if (route.component === 'ParentView') {
				route.component = ParentView;
			} else {
				route.component = loadView(route.component);
			}
		}
		if (route.children != null && route.children && route.children.length) {
			route.children = filterAsyncRouter(route.children, isRewrite);
		}
		return true;
	});
};

export const usePermissionStore = defineStore('permission', {
	state: () => ({
		routes: [],
		addRoutes: [],
		sidebarRouters: [],
	}),
	actions: {
		SET_ROUTES(routes) {
			this.addRoutes = routes;
			this.routes = constantRoutes.concat(routes);
		},
		SET_SIDEBAR_ROUTERS(routes) {
			this.sidebarRouters = constantRoutes.concat(routes);
		},
		generateRoutes() {
			return new Promise((resolve, reject) => {
				getRouters().then((res) => {
					console.log('routers=>', res);
					const sdata = JSON.parse(JSON.stringify(res.data));
					const rdata = JSON.parse(JSON.stringify(res.data));

					const sidebarRoutes = filterAsyncRouter(sdata);
					const rewriteRoutes = filterAsyncRouter(rdata, true);
					// rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true }); //!???

					this.SET_ROUTES(rewriteRoutes);
					this.SET_SIDEBAR_ROUTERS(sidebarRoutes);
					resolve(rewriteRoutes);
				});
			});
		},
	},
});
