import request from '@/utils/request';
import settings from '@/settings';

// 获取用户详细信息
export function getInfo() {
	return request({
		url: '/getInfo',
		method: 'get',
	});
}
