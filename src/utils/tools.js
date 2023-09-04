
export function getAdminWebUrl() {
	let adminWebUrl = '*';
	let env = '';
	//拼凑adminweb地址
	return adminWebUrl + env;
}

/**
 * 解析重新登录前的 url
 * @returns { {path,query} }
 */
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
