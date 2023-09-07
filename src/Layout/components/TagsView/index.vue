<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ScrollPane from './ScrollPane.vue';
import { Close } from '@element-plus/icons-vue';

import { useTags } from '@/Layout/hooks/useTags';

const {
	scrollPane,
	visible,
	top,
	left,
	selectedTag,
	visitedViews,
	isAffix,
	isActive,
	addTags,
	initMenuPosition,
	closeMenu,
	closeOthersTags,
	moveToCurrentTag,
	closeAllTags,
	closeSelectedTag,
} = useTags();

const container = ref();

const route = useRoute();

const handleScroll = () => {
	closeMenu();
};

// 打开 菜单
const openMenu = (tag, e) => {
	const menuMinWidth = 105;
	const offsetLeft = container.value.getBoundingClientRect().left; // container margin left
	const offsetWidth = container.value.offsetWidth; // container width
	const maxLeft = offsetWidth - menuMinWidth; // left boundary
	const containerInnerLeft = e.clientX - offsetLeft; // 15: margin right

	initMenuPosition(tag, e, { maxLeft, containerInnerLeft });
};

watch(
	() => route.path,
	() => {
		addTags();
		moveToCurrentTag();
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
		<ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
			<!-- <li @click="refreshSelectedTag(state.selectedTag)">刷新页面</li> -->
			<li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭当前</li>
			<li @click="closeOthersTags">关闭其他</li>
			<li @click="closeAllTags(selectedTag)">关闭所有</li>
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
