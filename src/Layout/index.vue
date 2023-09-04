<script setup>
import { computed, reactive } from 'vue';
import { useAppStore } from '@/store';
import settings from '@/settings';
import { Sidebar, Navbar, TagsView, AppMain } from './components';

const set = reactive({
	classess: computed(() => ({
		'app-wrapper': true,
		mobile: false,
		hideMenu: settings.platform === 'subview',
		hideSidebar: settings.platform !== 'subview' && !set.sidebar.opened,
		openSidebar: settings.platform !== 'subview' && set.sidebar.opened,
		withoutAnimation: set.sidebar.withoutAnimation,
	})),
	sidebar: computed(() => {
		return useAppStore().sidebar;
	}),
	platform: computed(() => {
		return settings.platform;
	}),
	needTagsView: computed(() => {
		return settings.tagsView;
	}),
	fixedHeader: computed(() => {
		return settings.fixedHeader;
	}),
});
</script>

<template>
	<div :class="set.classess">
		<Sidebar v-if="set.platform !== 'subview'" class="sidebar-container" />
		<div class="main-container" :class="{ needTagsView: set.needTagsView }">
			<!-- navbar & tags-views -->
			<div :class="{ 'fixed-header': set.fixedHeader }">
				<navbar v-if="set.platform !== 'subapp' && set.platform !== 'subview'" />
				<tagsView v-if="set.platform !== 'subview' && set.platform !== 'joymolib' && set.needTagsView" />
			</div>
			<!-- app-main -->
			<AppMain />
			<!-- right-panel -->
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '../styles/variables.module';
@import '../styles/mixin';

.app-wrapper {
	@include clearfix;
	position: relative;
	height: 100%;
	width: 100%;

	&.mobile.openSidebar {
		position: fixed;
		top: 0;
	}
}

.drawer-bg {
	background: #000;
	opacity: 0.3;
	width: 100%;
	top: 0;
	height: 100%;
	position: absolute;
	z-index: 999;
}

.fixed-header {
	position: fixed;
	top: 0;
	right: 0;
	z-index: 9;
	width: calc(100% - #{$sideBarWidth});
	transition: width 0.28s;
}

.hideSidebar .fixed-header {
	width: calc(100% - 54px);
}

.mobile .fixed-header {
	width: 100%;
}
</style>
