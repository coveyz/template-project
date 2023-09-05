<script setup>
import { useTags } from '@/Layout/hooks/useTags';
import { emitter, isEmpty, isEqual } from '@/utils';

const { instance, route, router, multiTags, onMounted } = useTags();

onMounted(() => {
	if (!instance) return;
	/** 根据当前路由初始化操作标签页的禁用状态 */
	showMenuModel(route.fullPath);
});

/** 检查当前右键的菜单两边是否存在别的菜单，如果左侧的菜单是顶级菜单，则不显示关闭左侧标签页，如果右侧没有菜单，则不显示关闭右侧标签页 */
const showMenuModel = (currentPath, query = {}, refresh = false) => {
	// console.log('currentPath=>', currentPath);
	const allRoute = multiTags.value,
		routeLength = multiTags.value.length;
	console.log('allRoute=>', allRoute);

};
</script>

<template>
	<div id="tags-view-container" class="tags-view-container">
		<!-- todo -->
		<div ref="scrollPane" class="tags-view-wrapper"></div>
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
