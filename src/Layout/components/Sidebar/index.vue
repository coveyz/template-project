<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import settings from '@/settings';
import { usePermissionStore } from '@/store';
import { useNav } from '@/Layout/hooks/useNav';
//@ts-ignore
import SidebarItem from './SidebarItem.vue';

const showLogo = ref(true),
	route = useRoute(),
	{ isCollapse } = useNav();

const activeMenu = computed(() => {
	const { meta, path } = route;
	if (meta.activeMenu) {
		return meta.activeMenu;
	}
	return path;
});

const defaultOpeneds = computed(() => {
	if (settings.platform === 'joymolib') {
		return ['/guide', '/biz-component'];
	}
	return [];
});

const uniqueOpened = computed(() => {
	return settings.platform !== 'joymolib';
});

const sidebarRouters = computed(() => {
	return usePermissionStore().sidebarRouters;
});
</script>

<template>
	<div :class="['sidebar-container', showLogo ? 'has-logo' : '']">
		<!-- Logo -->
		<el-scrollbar wrap-class="scrollbar-wrapper">
			<el-menu
				router
				:default-active="activeMenu"
				:default-openeds="defaultOpeneds"
				:collapse="isCollapse"
				:unique-opened="uniqueOpened"
				:collapse-transition="false"
        class="outer-most select-none"
				mode="vertical"
			>
				<sidebar-item v-for="(route, index) in sidebarRouters" :key="route.path + index" :item="route" :base-path="route.path" />
			</el-menu>
		</el-scrollbar>
	</div>
</template>

<style scoped></style>
