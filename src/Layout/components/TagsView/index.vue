<script setup>
import path from 'path-browserify';
import { ref, computed, onMounted, reactive, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTagsViewStore, usePermissionStore } from '@/store';
import ScrollPane from './ScrollPane.vue';
import { Close } from '@element-plus/icons-vue';
import { isEmpty } from '@/utils';

const scrollPane = ref(),
	tag = ref(),
	container = ref();

const route = useRoute(),
	router = useRouter();

const state = reactive({
	visible: false,
	top: 0,
	left: 0,
	selectedTag: {},
	affixTags: [],
});

const visitedViews = computed(() => {
	return useTagsViewStore().visitedViews;
});

const routes = computed(() => {
	return usePermissionStore().routes;
});

const handleScroll = () => {
	closeMenu();
};

const closeMenu = () => {
	state.visible = false;
};

const isAffix = (tag) => {
	if (isEmpty(tag)) return;
	return tag.meta && tag.meta.affix;
};

const isActive = (routeInfo) => {
	return routeInfo.path === route.path;
};
const closeSelectedTag = async (view) => {
	const { visitedViews } = await useTagsViewStore().delView(view);
	console.log('closeSelectedTag-visitedViews', visitedViews);

	if (isActive(view)) {
		toLastView(visitedViews, view);
	}
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

const openMenu = (tag, e) => {
	const menuMinWidth = 105;
	const offsetLeft = container.value.getBoundingClientRect().left; // container margin left
	const offsetWidth = container.value.offsetWidth; // container width
	const maxLeft = offsetWidth - menuMinWidth; // left boundary
	const left = e.clientX - offsetLeft; // 15: margin right

	if (left > maxLeft) {
		state.left = maxLeft;
	} else {
		state.left = left;
	}

	state.top = e.clientY - 40;
	state.visible = true;
	state.selectedTag = tag;
};

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

const initTags = () => {
	const affixTags = (state.affixTags = filterAffixTags(routes.value));
	for (const tag of affixTags) {
		if (tag.name) {
			useTagsViewStore().addVisitedView(tag);
		}
	}
};

const addTags = () => {
	const { name } = route;
	if (name) {
		useTagsViewStore().addView(route);
	}
	return false;
};

const moveToCurrentTag = () => {
	const tags = tag.value;
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

//todo
const refreshSelectedTag = async (view) => {
	return console.log('todo redirect');
	await useTagsViewStore().delCachedView(view);
	const { fullPath } = view;
	router.replace({
		path: '/redirect' + fullPath,
	});
};

const closeOthersTags = async () => {
	router.push(state.selectedTag).catch(() => {});

	await useTagsViewStore().delOthersViews(state.selectedTag);

	moveToCurrentTag();
};

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
});

watch(
	() => route.path,
	() => {
		addTags();
		moveToCurrentTag();
	}
);

watch(
	() => state.visible,
	(value) => {
		if (value) {
			document.body.addEventListener('click', closeMenu);
		} else {
			document.body.removeEventListener('click', closeMenu);
		}
	}
);
</script>

<template>
	<div ref="container" id="tags-view-container" class="tags-view-container">
		<scroll-pane ref="scrollPane" @scroll="handleScroll" class="tags-view-wrapper">
			<router-link
				v-for="tag in visitedViews"
				ref="tag"
				:key="tag.path"
				:class="isActive(tag) ? 'active' : ''"
				:to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
				tag="div"
				class="tags-view-item"
				@click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
				@contextmenu.prevent.native="openMenu(tag, $event)"
			>
				<div class="tags-icon" />
				<div class="tags-title" :title="tag.title">
					{{ tag.title }}
				</div>
				<div class="icon-wrap">
					<el-icon v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)">
						<Close />
					</el-icon>
				</div>
			</router-link>
		</scroll-pane>
		<ul v-show="state.visible" :style="{ left: state.left + 'px', top: state.top + 'px' }" class="contextmenu">
			<!-- <li @click="refreshSelectedTag(state.selectedTag)">刷新页面</li> -->
			<li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(state.selectedTag)">关闭当前</li>
			<li @click="closeOthersTags">关闭其他</li>
			<li @click="closeAllTags(state.selectedTag)">关闭所有</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
.tags-view-container {
	height: 40px;
	width: 100%;
	background: #f8f9fa;
	position: relative;

	::v-deep {
		.el-scrollbar__view {
			display: flex;
		}
	}

	&::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 1px;
		bottom: 0;
		background: #eaeaea;
	}

	.el-icon-close {
		&:hover {
			&::after {
				content: '';
				position: absolute;
				width: 12px;
				height: 12px;
				transform: scale(1.4);
				background: #edeff2;
				border-radius: 50%;
				top: 2px;
				left: 0;
				z-index: -1;
			}
		}
	}

	.tags-view-wrapper {
		.tags-view-item {
			padding: 0 10px;
			height: 40px;
			display: flex;
			align-items: center;
			font-size: 14px;
			cursor: pointer;
			position: relative;
			flex-shrink: 0;
			color: #999;

			&::after {
				content: '';
				width: 1px;
				height: 50%;
				top: 50%;
				transform: translateY(-50%);
				right: -1px;
				position: absolute;
				background: #eaeaea;
			}

			.tags-title {
				width: 84px;
				overflow: hidden;
				position: relative;
				white-space: nowrap;
				&::after {
					content: '';
					position: absolute;
					right: 0;
					width: 15px;
					height: 100%;
					background: linear-gradient(to right, rgba(248, 249, 250, 0) 1%, #f8f9fa 83%);
				}
			}

			.tags-icon {
				width: 16px;
				height: 16px;
				background: #eaeaea;
				margin-right: 10px;
			}

			.icon-wrap {
				position: relative;
				margin-left: 5px;
				font-size: 12px;
				z-index: 3;
				.el-icon-close {
					&:hover {
						&::after {
							content: '';
							position: absolute;
							width: 12px;
							height: 12px;
							transform: scale(1.4);
							background: #edeff2;
							border-radius: 50%;
							top: 1px;
							left: 0;
							z-index: -1;
						}
					}
				}
			}

			&.active {
				color: #666;
				background: #fff;
				border-left: 1px solid #eaeaea;
				border-right: 1px solid #eaeaea;
				&:first-of-type {
					border-left: none;
				}
				.tags-icon {
					background: #fb8c61;
				}
				.tags-title {
					&::after {
						background: linear-gradient(to right, rgba(248, 249, 250, 0) 1%, #fff 83%);
					}
				}
			}
		}
	}

	.contextmenu {
		margin: 0;
		background: #fff;
		z-index: 3000;
		position: absolute;
		list-style-type: none;
		padding: 5px 0;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 400;
		color: #333;
		box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
		li {
			margin: 0;
			padding: 7px 16px;
			cursor: pointer;
			&:hover {
				background: #eee;
			}
		}
	}
}
</style>
