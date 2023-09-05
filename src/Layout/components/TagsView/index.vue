<script setup>
import { nextTick, ref } from 'vue';
import { useTags } from '@/Layout/hooks/useTags';
import { useTagsViewStore } from '@/store';
import { emitter, isEqual, isEmpty, debounce } from '@/utils';
import { useResizeObserver } from '@vueuse/core';

const { instance, route, router, multiTags, tagsViews, onMounted } = useTags();

const scrollbarDom = ref();

onMounted(() => {
	if (!instance) return;
	/** 根据当前路由初始化操作标签页的禁用状态 */
	showMenuModel(route.fullPath);
	//todo 触发隐藏标签页
	//todo 改变标签风格
	// 接收侧边栏切换传递过来的参数
	emitter.on('changLayoutRoute', (indexPath) => {
		console.log('接收侧边栏切换传递过来的参数=');
		dynamicRouteTag(indexPath);
		setTimeout(() => {
			showMenuModel(indexPath);
		});
	});

	useResizeObserver(
		scrollbarDom,
		debounce(() => dynamicTagView())
	);
});

// 动态标记视图
const dynamicTagView = async () => {
	await nextTick();
	const index = multiTags.value.findIndex((item) => {
		if (!isEmpty(route.query)) {
			return isEqual(route.query, item.query);
		} else if (!isEmpty(route.params)) {
			return isEqual(route.params, item.params);
		} else {
			return route.path === item.path;
		}
	});

	moveToView(index);
};

// 移动 视图
const moveToView = async (index) => {
	await nextTick();
	const tabNavPadding = 10;
	if (!instance.refs['dynamic' + index]) return;
	const tabItemEl = instance.refs['dynamic' + index][0];
	const tabItemElOffsetLeft = tabItemEl?.offsetLeft;
	const tabItemOffsetWidth = tabItemEl?.offsetWidth;
	// 标签页导航栏可视长度（不包含溢出部分）
	const scrollbarDomWidth = scrollbarDom.value ? scrollbarDom.value?.offsetWidth : 0;

	// 已有标签页总长度（包含溢出部分）
	const tabDomWidth = tabDom.value ? tabDom.value?.offsetWidth : 0;

	scrollbarDomWidth <= tabDomWidth ? (isShowArrow.value = true) : (isShowArrow.value = false);
	if (tabDomWidth < scrollbarDomWidth || tabItemElOffsetLeft === 0) {
		translateX.value = 0;
	} else if (tabItemElOffsetLeft < -translateX.value) {
		// 标签在可视区域左侧
		translateX.value = -tabItemElOffsetLeft + tabNavPadding;
	} else if (tabItemElOffsetLeft > -translateX.value && tabItemElOffsetLeft + tabItemOffsetWidth < -translateX.value + scrollbarDomWidth) {
		// 标签在可视区域
		translateX.value = Math.min(0, scrollbarDomWidth - tabItemOffsetWidth - tabItemElOffsetLeft - tabNavPadding);
	} else {
		// 标签在可视区域右侧
		translateX.value = -(tabItemElOffsetLeft - (scrollbarDomWidth - tabNavPadding - tabItemOffsetWidth));
	}
};

const dynamicRouteTag = (value) => {
	const hasValue = multiTags.value.some((item) => {
		return item.path === value;
	});
	const concatPath = (arr, value) => {
		console.log('dynamicRouteTag-concatPath', arr, value);
		if (!hasValue) {
			arr.forEach((item) => {
				if (item.path === value) {
					useTagsViewStore().handleTags('push', {
						path: value,
						meta: item.meta,
						name: item.name,
					});
				} else {
					if (item.children && item.children.length) {
						concatPath(item.children, value);
					}
				}
			});
		}
	};

	concatPath(router.options.routes, value);
};

const showMenus = (status) => {
	Array.of(1, 2, 3, 4, 5).forEach((v) => {
		tagsViews[v].show = status;
	});
};

const disabledMenus = (status) => {
	Array.of(1, 2, 3, 4, 5).forEach((v) => {
		tagsViews[v].disabled = status;
	});
};

/** 检查当前右键的菜单两边是否存在别的菜单，如果左侧的菜单是顶级菜单，则不显示关闭左侧标签页，如果右侧没有菜单，则不显示关闭右侧标签页 */
const showMenuModel = (currentPath, query = {}, refresh = false) => {
	// console.log('currentPath=>', currentPath);
	const allRoute = multiTags.value,
		routeLength = multiTags.value.length;

	let currentIndex = -1;

	if (isEmpty(query)) {
		currentIndex = allRoute.findIndex((v) => v.path === currentPath);
	} else {
		currentIndex = allRoute.findIndex((v) => isEqual(v.query, query));
	}

	showMenus(true);

	if (refresh) {
		tagsViews[0].show = true;
	}

	/**
	 * currentIndex为1时，左侧的菜单顶级菜单，则不显示关闭左侧标签页
	 * currentIndex = routeLength - 1 右侧没有菜单 不显示关闭右侧标签页
	 */
	if (currentIndex === 1 && routeLength !== 2) {
		// 左侧菜单是顶级菜单 右侧存在别的菜单
		tagsViews[2].show = false;
		Array.of(1, 3, 4, 5).forEach((v) => {
			tagsViews[v].disabled = false;
		});
		tagsViews[2].disabled = true;
	} else if (currentIndex === 1 && routeLength === 2) {
		disabledMenus(false);
		// 左侧的菜单是顶级 右侧不存在别的菜单
		Array.of(2, 3, 4).forEach((v) => {
			tagsViews[v].show = false;
			tagsViews[v].disabled = true;
		});
	} else if (currentIndex === routeLength - 1 && currentIndex !== 0) {
		// 当前路由是所有路由中的最后一个
		tagsViews[3].show = false;
		Array.of(1, 2, 4, 5).forEach((v) => {
			tagsViews[v].disabled = false;
		});
		tagsViews[3].disabled = true;
	} else {
		disabledMenus(false);
	}
};
</script>

<template>
	<div id="tags-view-container" class="tags-view-container">
    {{ multiTags }}
		<div ref="scrollbarDom" class="scroll-container">
			<div v-for="(item, index) in multiTags" :key="index" :ref="'dynamic' + index"></div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import url('./index.scss');
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
