<script setup>
import { computed } from 'vue';

const props = defineProps({
	to: {
		type: String,
		required: true,
	},
});
const type = computed(() => {
	//todo
	return 'router-link';
});

const linkProps = (to) => {
	//todo
	return {
		to,
	};
};
</script>

<template>
	<component :is="type" v-bind="linkProps(props.to)">
		<slot />
	</component>
</template>

<style lang="scss" scoped></style>
