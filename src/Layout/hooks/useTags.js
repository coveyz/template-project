


import { computed, onMounted, getCurrentInstance, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useTagsViewStore } from '@/store'


export const useTags = () => {
  const instance = getCurrentInstance();

  const route = useRoute(), router = useRouter();

  const multiTags = computed(() => {
    return useTagsViewStore().multiTags
  })

  const tagsViews = reactive([
    {
      icon: '',
      text: '重新加载',
      divided: false,
      disabled: false,
      show: true,
    },
    {
      icon: "",
      text: '关闭当前页签',
      divided: false,
      disabled: multiTags.value.length > 1,
      show: true
    },
    {
      icon: '',
      text: '关闭左侧标签页',
      divided: true,
      disabled: multiTags.value.length > 1 ? false : true,
      show: true
    },
    {
      icon: '',
      text: '关闭右侧标签页',
      divided: false,
      disabled: multiTags.value.length > 1 ? false : true,
      show: true
    },
    {
      icon: '',
      text: '关闭其他标签页',
      divided: true,
      disabled: multiTags.value.length > 2 ? false : true,
      show: true
    },
    {
      icon: '',
      text: '关闭全部标签页',
      divided: false,
      disabled: multiTags.value.length > 1 ? false : true,
      show: true
    },
  ])

  onMounted(() => {
    //todo=>
    console.log('xxx=1', instance)
  })

  return {
    instance,
    route, router,
    multiTags,
    tagsViews,
    onMounted
  }
}