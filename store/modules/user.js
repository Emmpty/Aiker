
import { getUserInfo } from "@/static/api/user.js";

const user = {
  namespaced: true,
  state: {
    // 用户信息
    userInfo: uni.getStorageSync('userInfo') || {},
    token: uni.getStorageSync('token') || '',
    myInviter: uni.getStorageSync('myInviter') || '',
  },
  mutations: {
    changeUserInfo(state, data) {
      state.userInfo = data
      uni.setStorageSync('userInfo', data)
    },
  },
  getters: {},
  actions: {
    async getUserInfo(context) {
      try {
        const { code, result } = await getUserInfo()
        if (code == 200) {
          context.commit('changeUserInfo', result.user)
        }
      } catch (error) {
        console.error('获取用户信息', error);
      }
    },
    clearUserInfo(context) {
      context.commit('changeUserInfo', {})
      uni.removeStorageSync('userInfo'); // 清除用户信息
    }
  }
}

export default user
