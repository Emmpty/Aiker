/*
 * @author: Jay
 * @description: 监听主题变化
 * @createTime: 2022-12-12 15:22:19
 */
import system from '../theme/system-theme'
import {
  mapMutations,
  mapGetters,
} from 'vuex'
export default {
  install(Vue) {
    Vue.mixin({
      onShow() {
        //修改导航栏 底部 tab
        system.setSystemTheme(this.cueTheme)
        //获取缓存 背景色
        let bgColor = uni.getStorageSync('pageColor') || '';
        if (bgColor) {
          this.getSystemBg(bgColor)
        }
        //获取缓存 主题名字
        let themeType = uni.getStorageSync('themeType') || '';
        if (themeType) {
          this.cueGetTheme(themeType)
        }
        // 监听主题状态变化
        uni.onThemeChange((res) => {
          console.log("监听主题状态变化", res.theme);
          //黑夜
          if (res.theme == 'dark') {
            this.cueGetTheme('night-theme')
          }
          //白天
          if (res.theme == 'light') {
            // 有多个主题时 判断 缓存是否为白色主题
            let type = uni.getStorageSync('themeType');
            if (type != 'day-theme') {
              this.cueGetTheme(type)
            } else {
              this.cueGetTheme('day-theme')
            }
          }
        });
      },
      computed: {
        // 获取vuex 主题参数
        ...mapGetters({
          cueTheme: 'theme/theme',
          pageBg: 'theme/pageColor',
          // currentTheme: 'theme/getCurrentTheme'
        }),
      },
      methods: {
        // 修改主题
        ...mapMutations({
          cueGetTheme: 'theme/GET_THEME',
          themeCache: 'theme/SET_THEME_CACHE',
          pageColorCache: 'theme/SET_PAGE_COLOR',
          // switchTheme: 'theme/switchTheme',
        }),
        // 设置 全局背景色
        getSystemBg() {
          //从 主题列表 获取 页面颜色
          let bgColor = system.systemThemeBg(this.cueTheme)
          // console.log(bgColor);
          //缓存 已设置 背景色
          this.pageColorCache(bgColor)
        }
      }
    })
  }
}
