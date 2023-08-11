import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import router from '@/router';
import settings from '@/settings';
import { getToken, setToken, getAdminWebUrl, parseOriginUrl } from '@/utils';

import { useUserStore, useSettingStore, usePermissionStore } from '@/store';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const getRoutes = async (router, next, to) => {
	const { roles, getInfo } = useUserStore();

	if (!roles.length) {
		const { roles, permissions } = await getInfo();
		const accessRoutes = await usePermissionStore().generateRoutes();
		accessRoutes.forEach((route) => {
			router.addRoute(route);
		});

		let originTo = parseOriginUrl();
		console.log('originTo=>', originTo);
		if (originTo) {
			next({ ...originTo, replace: true });
		} else if (permissions.length === 0) {
			console.log('无 permissions 权限', permissions);
			next(false);
		} else {
			console.log('xxx=>');
			next({ ...to, replace: true });
		}
	} else {
		next();
	}
};

router.beforeEach(async (to, form, next) => {
	NProgress.start();

	if (to.query.platform === 'subview') {
		settings.platform = 'subview';
	}
	if (to.query.brandMdCode) {
		useSettingStore().changeSetting({
			key: 'brandMdCode',
			value: to.query.brandMdCode,
		});
		settings.brandMdCode = to.query.brandMdCode;
	}
	console.log('=============project=============enhanceRouter:', to.query);

	if (to.query.platform === 'subview' && !to.query.brandMdCode) {
		window.location.href = `${window.location.origin}/#/404`;
	}

	// 支持 query.token 的方式获取登录凭证
	if (to.query.token) {
		// window.__POWERED_BY_JOYMO__ = "JOYMO";
		sessionStorage.setItem('from', to.query.from);
		setToken(to.query.token);

		if (to.query.from !== 'admin') {
			delete to.query.token;
		}
		await getRoutes(router, next, to);
	} else {
		if (window.location.href.includes('from=admin')) {
			const message = {
				action: 'goto',
				path: to.path,
				fullPath: to.fullPath,
			};
			let targetOrigin = getAdminWebUrl();
			window.top.postMessage(message, targetOrigin);
			console.log('=======>子应用保存刷新逻辑，记录 FROM_URL', location.href);
			window.sessionStorage.setItem('FROM_URL', window.location.href);
			console.log('=======>postMessage', message);
			next(false);
			NProgress.done();
			return;
		}

		if (!getToken()) {
			console.log('未登录系统');
			await useUserStore().getInfo();
		} else {
			await getRoutes(router, next, to);
		}
	}
});

router.afterEach(() => {
	NProgress.done();
});
