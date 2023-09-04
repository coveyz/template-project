import { defineStore } from 'pinia';

export const useTagsViewStore = defineStore('tagsViews', {
  state: () => ({
    /** 存储标签页 路由信息 */
    multiTags: [],
    multiTagsCache: []
  }),
  getters: {
    getMultiTagsCache() {
      return this.multiTagsCache;
    }
  },
  actions: {

  }
})