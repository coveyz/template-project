let appConfig = {
	appCode: 'i18n-admin', //修改为业务应用编码，加载菜单用到
	title: '库存系统', //系统名称，菜单上方系统名称显示
	baseURL: import.meta.env.VITE_APP_BASE_API, //勿动
};

export default appConfig;

/**
 * 出海计划 🧀️ @author：Saturday<吴彦祖>
 */
module.exports = {
	baseURL: import.meta.env.VITE_APP_BASE_API, //勿动
	/**
	 * 系统路径名称
	 */
	appCode: 'i18n-admin',

	/**
	 * 系统名称
	 */
	title: '多语言平台',

	/**
	 * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
	 */
	sideTheme: 'theme-dark',

	/**
	 * 是否系统布局配置
	 */
	showSettings: false,

	/**
	 * 是否显示 tagsView
	 */
	tagsView: true,

	/**
	 * 是否固定头部
	 */
	fixedHeader: false,

	/**
	 * 是否显示logo
	 */
	sidebarLogo: true,
	/**
	 * 框架平台类型
	 * subapp 子应用
	 * subview 子应用页面
	 * mainapp 独立应用
	 * joymolib UI页面
	 * */
	platform: 'mainapp',
	/**
	 * @type {string | array} 'production' | ['production', 'development']
	 * @description Need show err logs component.
	 * The default is only used in the production env
	 * If you want to also use it in dev, you can pass ['production', 'development']
	 */
	errorLog: 'development',
	/**
	 * brandMdCode
	 * 品牌code
	 */
	brandMdCode: '20200000006',
};
