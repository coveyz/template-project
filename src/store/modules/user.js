import { defineStore } from 'pinia';
import { getToken, removeToken } from '@/utils';
import { getInfo, logout } from '@/api/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    name: '',
    account: '', //todo delete
    avatar: '',
    roles: [],
    permissions: [],
  }),
  actions: {
    /** 获取用户信息 */
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            const user = res.data.user;
            if (res.data.roles && res.data.roles.length) {
              this.roles = res.data.roles;
            }
            if (res.data.permissions && res.data.permissions) {
              this.roles = ['ROLE_DEFAULT'];
            }
            this.permissions = res.data.permissions;
            this.name = user.name;
            this.account = user.name;
            this.account = user.account;
            resolve(res.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    logout() {
      return new Promise((resolve) => {
        logout(this.token).then(res => {
          this.token = '';
          this.roles = [];
          this.permissions = [];

          removeToken();
          resolve(res);
        })
      })
    }
  },
});
