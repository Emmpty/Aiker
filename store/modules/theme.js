//主题相关配置
import system from '../../theme/system-theme'

const theme = {
  namespaced: true,
  state: {
    theme: "night-theme",
    //页面背景色
    pageColor: "",

  },
  mutations: {
    //设置主题色
    GET_THEME(state, provider) {
      state.theme = provider
      //修改导航栏 底部 tab
      system.setSystemTheme(state.theme)
    },
    //设置主题缓存
    SET_THEME_CACHE(state, provider) {
      uni.setStorage({
        key: 'themeType',
        data: provider
      });
    },
    //设置主题缓存
    SET_PAGE_COLOR(state, provider) {
      state.pageColor = provider
      //缓存
      uni.setStorage({
        key: 'pageColor',
        data: provider
      });
    },
  },
  getters: {
    theme: state => state.theme,
    pageColor: state => state.pageColor,
  },
  actions: {

  }
}

export default theme
