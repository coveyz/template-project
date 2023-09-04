import { computed } from 'vue';
import { useAppStore } from '@/store';

export const useNav = () => {
  const app = useAppStore();

  /** 切换边栏 */
  const toggleSideBar = () => {
    return app.toggleSideBar();
  }
  /** 是否折叠 */
  const isCollapse = computed(() => {
    return !app.getSidebarStatus
  })
  
  return {
    app,
    isCollapse,
    toggleSideBar
  }
}