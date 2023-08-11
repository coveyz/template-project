<script setup>
import { ref } from 'vue';
import settings from '@/settings.js';

const title = ref(settings.title);

</script>

<template>
	<div class="app-container home">
		<h3 style="padding: 20px; width: 100%; text-align: center">欢迎使用{{ title }}后台管理系统</h3>
	</div>
</template>

<style lang="scss" scoped></style>
