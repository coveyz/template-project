import { resolve } from 'path-browserify';
import { defineStore } from 'pinia';
// import { isUrl, isBoolean, isEqual } from '@/utils';


export const useTagsViewStore = defineStore('tagsViews', {
  state: () => ({
    /** 存储标签页 路由信息 */
    visitedViews: [],
    cachedViews: []
  }),
  actions: {
    ADD_VISITED_VIEW(view) {
      const isExist = this.visitedViews.some(v => v.path == view.path)
      if (isExist) return;

      const viewData = Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
      this.visitedViews.push(viewData);
    },
    ADD_CACHED_VIEW(view) {
      const isExist = this.cachedViews.some(v => v.path == view.path)
      if (isExist) return;
      if (!view.meta.noCache) {
        this.cachedViews.push(view.name)
      }
    },
    UPDATE_VISITED_VIEW(view) {
      for (const v of this.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    },
    DEL_VISITED_VIEW(view) {
      for (const [i, v] of this.visitedViews.entries()) {
        if (v.path === view.path) {
          this.visitedViews.splice(i, 1)
          break
        }
      }
    },
    DEL_CACHED_VIEW(view) {
      const index = this.cachedViews.indexOf(view.name)
      index > -1 && this.cachedViews.splice(index, 1)
    },
    DEL_OTHERS_VISITED_VIEWS(view) {
      this.visitedViews = this.visitedViews.filter(v => {
        return v.meta.affix || v.path === view.path
      })
    },
    DEL_OTHERS_CACHED_VIEWS(view) {
      const index = this.cachedViews.indexOf(view.name)
      if (index > -1) {
        this.cachedViews = this.cachedViews.slice(index, index + 1)
      } else {
        this.cachedViews = []
      }
    },
    DEL_ALL_VISITED_VIEWS() {
      // keep affix tags
      const affixTags = this.visitedViews.filter(tag => tag.meta.affix)
      this.visitedViews = affixTags;
    },
    DEL_ALL_CACHED_VIEWS() {
      this.cachedViews = []
    },
    addView(view) {
      // console.log('actions-view', view);
      this.addVisitedView(view);
      this.addCachedView(view);
    },
    addVisitedView(view) {
      this.ADD_VISITED_VIEW(view);
    },
    addCachedView(view) {
      this.ADD_CACHED_VIEW(view);
    },
    updateVisitedView(view) {
      this.UPDATE_VISITED_VIEW(view)
    },
    delView(view) {
      return new Promise(async (resolve) => {
        await this.delVisitedView(view);
        await this.delCachedView(view);

        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },
    delVisitedView(view) {
      return new Promise(resolve => {
        this.DEL_VISITED_VIEW(view)
        resolve([...this.visitedViews])
      })
    },
    delCachedView(view) {
      return new Promise(resolve => {
        console.log('view=>', view)
        this.DEL_CACHED_VIEW(view)
        resolve([...this.cachedViews])
      })
    },
    delOthersViews(view) {
      return new Promise(async (resolve) => {
        await this.delOthersVisitedViews(view)
        await this.delOthersCachedViews(view)

        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },
    delOthersVisitedViews(view) {
      return new Promise((resolve) => {
        this.DEL_OTHERS_VISITED_VIEWS(view);
        resolve([...this.visitedViews])
      })
    },
    delOthersCachedViews(view) {
      return new Promise((resolve) => {
        this.DEL_OTHERS_CACHED_VIEWS(view)
        resolve([...this.cachedViews])
      })
    },
    delAllViews() {
      return new Promise(async (resolve) => {
        await this.delAllVisitedViews();
        await this.delAllCachedViews();

        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },
    delAllVisitedViews() {
      return new Promise(resolve => {
        this.DEL_ALL_VISITED_VIEWS();
        resolve([...this.visitedViews])
      })
    },
    delAllCachedViews() {
      return new Promise(resolve => {
        this.DEL_ALL_CACHED_VIEWS();
        resolve([...this.cachedViews])
      })
    }
  }
})