import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const resolve = (dir) => {
	return path.resolve(__dirname, dir);
};

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		port: '9527',
	},
	resolve: {
    alias: {
		'@': resolve('src'),
    }
	},
});
