import request from '@/utils/request';
import settings from '@/settings';

/** 获取 路由 */
export const getRouters = () => {
	return request({
		url: '/getRouters',
		params: { appCode: settings.appCode },
		method: 'get',
	});
};
