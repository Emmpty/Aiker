const logIn = {
	namespaced: true,
	state: {
		//是否登录
		hasLodin: true,
		// 用户数据
		userInfo: {},
	},
	mutations: {
		//登录
		LOG_IN(state, provider) {
			state.hasLodin = true;
			state.userInfo = provider;
			uni.setStorage({
				key: 'userInfo',
				data: provider
			});
			// console.log('用户登录数据', state.userInfo);
		},
		//退出登录
		LOG_OUT(state) {
			state.hasLodin = false;
			state.userInfo = {};
			uni.removeStorage({
				key: 'userInfo',
			});
		}
	},
	getters: {},
	actions: {}
}

export default logIn
