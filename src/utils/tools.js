
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
 * @description 是否为空，针对 数组、对象、字符串、new Map()、new Set()、null、undefined 进行判断，null、undefined 直接返回 true，也就是直接等于空
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
    for (const _key in data) {
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

/**
 * 是否是外链
 * @param {string} url 
 * @returns 
 */
export const isUrl = (url) => {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

export const isBoolean = (data) => {
  return typeof data === 'boolean'
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}