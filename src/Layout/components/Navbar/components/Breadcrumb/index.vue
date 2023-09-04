<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute(),
	router = useRouter();
const levelList = ref([]);

onMounted(() => {
	getBreadcrumb();
});

/** 是否 首页 */
const isDashboard = (route) => {
	const name = route && route.name;
	if (!name) return false;
	return name.trim() === '首页';
};

/** 获取 面包屑数据 */
const getBreadcrumb = () => {
	let matched = route.matched.filter((item) => item.meta && item.meta.title);
	const first = matched[0];
  
	if (!isDashboard(first)) {
		matched = [{ path: '/index', meta: { title: '首页' } }].concat(matched);
	}

	levelList.value = matched.filter((item) => item.meta && item.meta.title && item.meta.breadcrumb !== false);
};

/** 点击 跳转 */
const handleLink = (item) => {
	console.log('handleLink=>', item);
	const { redirect, path } = item;

	if (redirect) {
		router.push(redirect);
	} else {
		router.push(path);
	}
};

watch(
	() => route.path,
	() => {
		if (route.path.startsWith('/redirect/')) {
			return;
		}
		getBreadcrumb();
	}
);
</script>

<template>
	<el-breadcrumb class="app-breadcrumb" separator="/">
		<transition-group name="breadcrumb">
			<el-breadcrumb-item v-for="item in levelList" :key="item.path">
				<span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
				<a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
			</el-breadcrumb-item>
		</transition-group>
	</el-breadcrumb>
</template>

<style scoped lang="scss">
.app-breadcrumb.el-breadcrumb {
	display: inline-block;
	font-size: 14px;
	line-height: 50px;
	margin-left: 8px;

	.no-redirect {
		color: #97a8be;
		cursor: text;
	}
}
</style>
