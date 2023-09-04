import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      withoutAnimation: false
    },
    device: 'desktop',
    size: Cookies.get('size') || 'medium'
  }),
  getters: {
    getSidebarStatus() {
      return this.sidebar.opened;
    }
  },
  actions: {
    TOGGLE_SIDEBAR() {
      this.sidebar.opened = !this.sidebar.opened;
      this.withoutAnimation = false;

      if (this.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }

    },
    /**
     * 切换边栏
     */
    toggleSideBar() {
      console.log('actions-toggleSideBar=>')
      this.TOGGLE_SIDEBAR();
    }
  }
})