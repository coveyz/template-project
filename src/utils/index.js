const TokenKey = 'Admin-Token';

export function getToken() {
	return window.sessionStorage.getItem(TokenKey);
}

export function setToken(token) {
	return window.sessionStorage.setItem(TokenKey, token);
}

export function removeToken() {
	return window.sessionStorage.removeItem(TokenKey);
}

export function getAdminWebUrl() {
	let adminWebUrl = '*';
	let env = '';
	//拼凑adminweb地址
	return adminWebUrl + env;
}

export const requestCodeEnum = {
	401: '认证失败，无法访问系统资源',
	403: '当前操作没有权限',
	404: '访问资源不存在',
	default: '系统未知错误，请反馈给管理员',
};

// 解析重新登录前的 url
export const parseOriginUrl = () => {
	let hash = localStorage.getItem('hash');
	if (!hash) {
		return;
	}

	let tmp = hash.replace(/#/, '').split('?');
	let path = tmp[0];
	let queryStr = tmp[1];
	let query = {};

	if (queryStr) {
		let queryArr = queryStr.split('&');
		queryArr.forEach((v) => {
			let item = v.split('=');
			const key = item[0];
			if (key !== 'token') {
				//@ts-ignore
				query[key] = item[1];
			}
		});
	}

	localStorage.removeItem('hash');

	return {
		path,
		query,
	};
};
