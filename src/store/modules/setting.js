import { defineStore } from 'pinia';
import settings from '@/settings';

export const useSettingStore = defineStore('setting', {
	state: () => ({
		brandMdCode: settings.brandMdCode,
	}),
	actions: {
		changeSetting(data) {
			const { key, value } = data;
			if (key in this) {
				this[key] = value;
			}
		},
	},
});
