<script setup>
import { Hamburger } from './components';
import { useNav } from '@/Layout/hooks/useNav';

const { app, toggleSideBar } = useNav();
</script>

<template>
	<div class="navbar">
		<Hamburger 
      id="hamburger-container" 
      class="hamburger-container" 
      :is-active="app.sidebar.opened"
      @toggleClick="toggleSideBar"
    />
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
}
</style>
