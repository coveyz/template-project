
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


/**
 * @deprecated 是否为空，针对 数组、对象、字符串、new Map()、new Set()、null、undefined 进行判断，null、undefined 直接返回 true，也就是直接等于空
 * @param {*} data 
 * @returns boolean
 */
export const isEmpty = (data) => {
  if (data === null || data === undefined) return true;
  if (typeof data === 'string') return data.trim() === '';
  if (data instanceof Map || data instanceof Set) {
    return data.size === 0;
  }
  if (typeof data === 'object' || Array.isArray(data)) {
    for (const key in data) {
      return false;
    }
    return true;
  }
  return false;
}


/**
 * @description 判断两者是否相等
 * @param {Unknown} a 前者
 * @param {Unknown} b 后者
 * @returns Boolean
 */
export const isEqual = (a, b) => {
  // 基础类型判断，两值严格想等 则他们想等
  if (a === b) return true;

  // 如果其中一个值是对象，而另一个不是，则它们不相等
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }

  // 如果都是数组
  if (Array.isArray(a) && Array.isArray(b)) {
    // 比较长短
    if (a.length !== b.length) return false;
    // 逐一比较
    for (let index = 0; index < a.length; index++) {
      if (!isEqual(a[index], b[index])) {
        return false
      }
    }
    return true;
  }

  // 如果都是对象
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a), keysB = Object.keys(b);
    // 比较属性数量
    if (keysA.length !== keysB.length) return false;
    // 逐一比较属性
    for (const key of keysA) {
      if (!keysB.includes(key) || !isEqual(a[key], b[key])) return false;
    }

    return true;
  }

  return true;
}