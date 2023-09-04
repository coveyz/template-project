


import { computed, onMounted, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useTagsViewStore } from '@/store'


export const useTags = () => {
  const instance = getCurrentInstance();

  const route = useRoute(), router = useRouter();

  const multiTags = computed(() => {
    return useTagsViewStore().multiTags
  })

  onMounted(() => {
    //todo=>
    console.log('xxx=1', instance)
  })

  return {
    instance,
    route, router,
    multiTags,
    onMounted
  }
}