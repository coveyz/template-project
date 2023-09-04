<template>
	<span v-if="props.title" :style="getMenuTextStyle"> {{ props.title }} </span>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
	icon: {
		type: String,
		default: '',
	},
	title: {
		type: String,
		default: '',
	},
});

const getMenuTextStyle = computed(() => {
	return {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		outline: 'none',
	};
});
</script>

<style lang="scss" scoped></style>
