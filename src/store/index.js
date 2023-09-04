import { createPinia } from 'pinia';

const store = createPinia();

export const setupStore = (app) => {
	app.use(store);
};

export * from './modules/user'; //🥥 userModules
export * from './modules/setting'; //🥥 settingsModules
export * from './modules/permission'; //🥥 permissionModules
export * from './modules/app'; //🥥 appModules
export * from './modules/tagsView'; //🥥 tagsModules

export default store;
