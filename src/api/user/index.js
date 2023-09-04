import request from '@/utils/request';

/** 获取用户详细信息 */
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get',
  });
}

/** 退出登录 */
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
