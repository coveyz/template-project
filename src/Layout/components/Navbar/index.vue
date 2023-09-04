<script setup>
import { computed } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useNav } from '@/Layout/hooks/useNav';
import { useUserStore } from '@/store';
import { Hamburger, Breadcrumb } from './components';

const { app, toggleSideBar } = useNav();

const userName = computed(() => {
	return useUserStore().name;
});

/** 退出登录 */
const logout = () => {
	console.log('logout');
	ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		const result = await useUserStore().logout();
		console.log('退出登录->>>>', result);
		window.location.href = result.data;
	});
};
</script>

<template>
	<div class="navbar">
		<Hamburger id="hamburger-container" class="hamburger-container" :is-active="app.sidebar.opened" @toggleClick="toggleSideBar" />
		<Breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

		<div class="right-menu">
			<el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
				<div class="avatar-wrapper">
					<div class="user-avatar">欢迎您: {{ userName }}</div>
				</div>

				<template #dropdown>
					<el-dropdown-item @click="logout"> 退出登录 </el-dropdown-item>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.navbar {
	height: 50px;
	overflow: hidden;
	position: relative;
	background: #fff;
	box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
	z-index: 1;

	.hamburger-container {
		line-height: 46px;
		height: 100%;
		float: left;
		cursor: pointer;
		transition: background 0.3s;
		-webkit-tap-highlight-color: transparent;

		&:hover {
			background: rgba(0, 0, 0, 0.025);
		}
	}

	.breadcrumb-container {
		float: left;
	}

	.errLog-container {
		display: inline-block;
		vertical-align: top;
	}

	.right-menu {
		float: right;
		height: 100%;
		line-height: 50px;

		&:focus {
			outline: none;
		}

		.right-menu-item {
			display: inline-block;
			padding: 0 8px;
			// height: 100%;
			font-size: 18px;
			color: #5a5e66;
			vertical-align: text-bottom;

			&.hover-effect {
				cursor: pointer;
				transition: background 0.3s;

				&:hover {
					background: rgba(0, 0, 0, 0.025);
				}
			}
		}

		.avatar-container {
			margin-right: 5px;

			.avatar-wrapper {
				position: relative;
				font-size: 14px;

				.user-avatar {
					cursor: pointer;
					max-width: 200px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 14px;
				}

				.el-icon-caret-bottom {
					cursor: pointer;
					position: absolute;
					right: -20px;
					top: 25px;
					font-size: 12px;
				}
			}
		}
	}
}
</style>
