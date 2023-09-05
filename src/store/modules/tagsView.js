import { defineStore } from 'pinia';
import { isUrl, isBoolean, isEqual } from '@/utils';


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
    tagsCache(tags) {
      localStorage.setItem('adminTags', tags)
    },
    handleTags(mode, value, position) {
      switch (mode) {
        case 'push':
          const tagVal = value;
          console.log('handleTags-push->tagVal=>', tagVal)
          // 不添加 标签页
          if (tagVal?.meta?.hiddenTag) return;
          // 如果外链无需添加信息到标签页
          if (isUrl(tagVal?.name)) return;
          // 如果title为空拒绝添加空信息到标签页
          if (tagVal?.meta?.title.length === 0) return;
          // showLink:false 不添加到标签页 //todo
          const tagPath = tagVal.path;
          // 判断 tag 是否已存在
          const tagHasExits = this.multiTags.some(tag => tag.path === tagPath);
          // 判断tag中的 query 键值是否相等
          const tagQueryHasExits = this.multiTags.some(tag => isEqual(tag?.query, tagVal?.query));
          // 判断tag中的 params 键值是否相等
          const tagParamsHasExits = this.multiTags.some(tag => isEqual(tag?.params, tagVal?.params));
          if (tagHasExits && tagQueryHasExits && tagParamsHasExits) return;
          // 动态路由可打开的最大数量 //todo
          this.multiTags.push(value);
          this.tagsCache(this.multiTags);
          break;
        default:
          break;
      }
    }
  }
})