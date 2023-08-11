import axios from 'axios';
import { getToken, getAdminWebUrl, requestCodeEnum } from '@/utils';
import settings from '@/settings';

const request = axios.create({
	baseURL: import.meta.env.VITE_APP_BASE_API,
	timeout: 10000,
});

request.interceptors.request.use(
	(config) => {
		const isToken = (config.headers || {}).isToken === false;

		if (getToken() && !isToken) {
			config.headers['Authorization'] = 'Bearer ' + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
			config.headers['token'] = getToken();
		}

		config.headers['Request-Ajax'] = 'true';
		settings.brandMdCode && (config.headers['brandMdCode'] = settings.brandMdCode);
		config.headers['terminalCode'] = 1;

		// get请求映射params参数
		if (config.method === 'get' && config.params) {
			let url = config.url + '?';
			for (const propName of Object.keys(config.params)) {
				const value = config.params[propName];
				var part = encodeURIComponent(propName) + '=';
				if (value !== null && typeof value !== 'undefined') {
					if (typeof value === 'object') {
						for (const key of Object.keys(value)) {
							let params = propName + '[' + key + ']';
							var subPart = encodeURIComponent(params) + '=';
							url += subPart + encodeURIComponent(value[key]) + '&';
						}
					} else {
						url += part + encodeURIComponent(value) + '&';
					}
				}
			}
			url = url.slice(0, -1);
			config.params = {};
			config.url = url;
		}

		return config;
	},
	(error) => {
		console.log('request-error->', error);
		Promise.reject(error);
	}
);

request.interceptors.response.use(
	(res) => {
		// alert(`interceptors.response0: ${JSON.stringify(res.data)}`)
		// 未设置状态码则默认成功状态
		const code = res.data.code || 200;
		let status = res.data.status;
		if (typeof status == 'undefined') {
			console.log(
				`${res.config.url}接口：请改造后台业务Result包装类,参考文档：https://i7drsi3tvf.feishu.cn/docs/doccn1dObN82KpIKVseKQjcSXth#pTyZhL`
			);
			if (code == '401') {
				status = -1;
			}
			if (code == '200') {
				status = 0;
			}
		}
		// 获取错误信息
		//@ts-ignore
		const msg = requestCodeEnum[code] || res.data.msg || requestCodeEnum['default'];

		if (code === '401' && status === -1) {
			if (window != top && location.href.includes('from=admin')) {
				let targetOrigin = getAdminWebUrl();
				window.top.postMessage({ action: 'logout' }, targetOrigin);
			} else {
				localStorage.removeItem('hash');
				sessionStorage.removeItem('FROM_URL');
				localStorage.removeItem('REFRESH_INFO');
				window.location.href = res.data.data.loginUrl;
			}
			return Promise.reject(new Error(msg));
		} else if (status === 0) {
			return res.data;
		} else {
			console.error('response-msg', msg);
			return Promise.reject(new Error(msg));
		}
	},
	(error) => {
		console.log('err' + error);
		let { message } = error;
		if (message == 'Network Error') {
			message = '啊哦！你网断了！';
		} else if (message.includes('timeout')) {
			message = '系统接口请求超时';
		} else if (message.includes('Request failed with status code')) {
			message = '系统接口' + message.substr(message.length - 3) + '异常';
		}
		console.error('response-error-msg', message);
		return Promise.reject(error);
	}
);

export default request;
