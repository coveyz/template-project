import path from 'path-browserify';
import { reactive, computed, toRefs, onMounted, watch, ref, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTagsViewStore, usePermissionStore } from '@/store';
import { isEmpty } from '@/utils';

export const useTags = () => {
  const route = useRoute(), router = useRouter();

  const state = reactive({
    visible: false,
    top: 0,
    left: 0,
    selectedTag: {},
    affixTags: [],
  });

  const scrollPane = ref(), tag = ref();

  const visitedViews = computed(() => {
    return useTagsViewStore().visitedViews;
  });

  const routes = computed(() => {
    return usePermissionStore().routes;
  });

  const isAffix = (tag) => {
    if (isEmpty(tag)) return;
    return tag.meta && tag.meta.affix;
  };

  const isActive = (routeInfo) => {
    return routeInfo.path === route.path;
  };

  // 过滤 tag
  const filterAffixTags = (routes, basePath = '/') => {
    let tags = [];
    routes.forEach((route) => {
      if (route.meta && route.meta.affix) {
        const tagPath = path.resolve(basePath, route.path);
        tags.push({
          fullPath: tagPath,
          path: tagPath,
          name: route.name,
          meta: { ...route.meta },
        });
      }
      if (route.children) {
        const tempTags = filterAffixTags(route.children, route.path);
        if (tempTags.length >= 1) {
          tags = [...tags, ...tempTags];
        }
      }
    });
    return tags;
  };

  // 初始化
  const initTags = () => {
    const affixTags = (state.affixTags = filterAffixTags(routes.value));
    for (const tag of affixTags) {
      if (tag.name) {
        useTagsViewStore().addVisitedView(tag);
      }
    }
  };
  /** 添加 tag */
  const addTags = () => {
    const { name } = route;
    if (name) {
      useTagsViewStore().addView(route);
    }
    return false;
  };

  // refresh 刷新
  const refreshSelectedTag = () => {

  }

  /** 初始化 菜单 */
  const initMenuPosition = (tag, e, { maxLeft, containerInnerLeft }) => {
    if (containerInnerLeft > maxLeft) {
      state.left = maxLeft;
    } else {
      state.left = containerInnerLeft;
    }

    state.top = e.clientY - 40;
    state.visible = true;
    state.selectedTag = tag;
  }

  // 关闭 菜单
  const closeMenu = () => {
    state.visible = false;
  };

  /** 移动到当前标记 */
  const moveToCurrentTag = () => {
    const tags = tag.value;
    if (isEmpty(tags)) return;
    nextTick(() => {
      for (const tag of tags) {
        if (tag.to.path === route.path) {
          scrollPane.value.moveToTarget(tag);
          if (tag.to.fullPath !== route.fullPath) {
            useTagsViewStore().updateVisitedView(route);
          }
          break;
        }
      }
    });
  };

  const toLastView = (visitedViewss, view) => {
    const latestView = visitedViewss.slice(-1)[0];
    if (latestView) {
      router.push(latestView.fullPath);
    } else {
      // now the default is to redirect to the home page if there is no tags-view,
      // you can adjust it according to your needs.
      if (view.name === 'Dashboard') {
        // to reload home page
        router.replace({ path: '/redirect' + view.fullPath });
      } else {
        router.push('/');
      }
    }
  };

  /** 关闭 tags */
  const closeSelectedTag = async (view) => {
    const { visitedViews } = await useTagsViewStore().delView(view);

    if (isActive(view)) {
      toLastView(visitedViews, view);
    }
  };

  /** 关闭其他 */
  const closeOthersTags = async () => {
    router.push(state.selectedTag).catch(() => { });
    await useTagsViewStore().delOthersViews(state.selectedTag);
    moveToCurrentTag();
  };

  /** 关闭全部 tags */
  const closeAllTags = async (view) => {
    const { visitedViews } = await useTagsViewStore().delAllViews();
    if (state.affixTags.some((tag) => tag.path === route.path)) {
      return;
    }
    toLastView(visitedViews, view);
  };

  onMounted(() => {
    initTags();
    addTags();
  })

  watch(
    () => state.visible,
    (visible) => {
      if (visible) {
        document.body.addEventListener('click', closeMenu);
      } else {
        document.body.removeEventListener('click', closeMenu);
      }
    }
  );

  return {
    scrollPane, tag,
    ...toRefs(state),
    visitedViews,
    routes,
    isAffix,
    isActive,
    /** 添加 tag */
    addTags,
    initMenuPosition,
    closeMenu,
    closeOthersTags,
    /** 移动到当前标记 */
    moveToCurrentTag,
    toLastView,
    closeAllTags,
    closeSelectedTag
  }
}