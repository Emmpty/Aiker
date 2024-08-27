/*
 * @author: Jay
 * @description: 主题相关配置
 * @createTime: 2022-12-12 17:45:09
 */

export default {
  /* 
    系统主题列表
  */
  themeList() {
    return [{
      title: "白天",
      name: "day-theme",
      navBg: "#FFFFFF",
      navBgApp: "#FFFFFF", // 导航背景颜色
      tabBg: "#FFFFFF", // 底部背景颜色
      tabSeleText: "#1AFFE8",   // 底部文字选中颜色
      tabText: "#666666",  // 底部文字默认颜色
    }, {
      title: "黑夜",
      name: "night-theme",
      navBg: '#141416',
      navBgApp: "#141416",  // 导航背景颜色
      tabBg: '#141416',  // 底部背景颜色
      tabSeleText: "#1AFFE8",// 底部文字选中颜色
      tabText: "#666666", // 底部文字默认颜色
    },
      // {
      //   title: "玉红",
      //   name: "jade-theme",
      //   navBg: variables.jadeBg,
      //   navBgApp: "#c04851", // 导航背景颜色
      //   tabBg: variables.jadeBg,  // 底部背景颜色
      //   tabSeleText: "",// 底部文字选中颜色
      //   tabText: "", // 底部文字默认颜色
      // }
    ]
  },
  //根据主题 返回背景色
  systemThemeBg(name) {
    let color = ''
    this.themeList().map((item, index) => {
      if (item.name === name) {
        color = item.navBgApp
      }
    })
    return color
  },
  //根据主题 修改系统 导航栏 底部 tab
  setSystemTheme(name) {
    this.themeList().map((item, index) => {
      if (item.name === name) {
        // 设置页面导航条颜色
        this.setNavigationColor(item.name, item.navBgApp)
        // 设置 tabBar 样式
        this.setTabBarColor(item.tabBg, item.tabSeleText, item.tabText)
      }
    })
  },
  /* 
    设置页面导航条颜色 
    name 主题名字  该颜色值只支持2种 故判断对于白天 为 #000 其他均为 #FFF
    bgClor 背景色  可以随意修改
  */
  setNavigationColor(name, bgClor) {
    let fontColor = name == 'day-theme' ? "#000000" : "#ffffff"
    let backgroundColor = bgClor || "#141416"

    let navigationBar = {
      // 前景颜色值 仅支持 #ffffff 和 #000000
      frontColor: fontColor,
      // 背景颜色值
      backgroundColor: backgroundColor,
      backgroundColorTop: backgroundColor,
      backgroundColorBottom: backgroundColor,
    }

    uni.setNavigationBarColor(navigationBar)
    // #ifdef MP
    uni.setBackgroundColor(navigationBar)
    // #endif
  },

  /* 
    动态 设置 tabBar 样式
  */
  setTabBarColor(bgColor, seleColor, color) {
    // console.log(bgColor,seleColor,color,'21111111111111111')
    let tabBar = {
      // 背景色
      backgroundColor: bgColor || '#ffffff',
      // 文字选中时的颜色
      selectedColor: seleColor || '#3cc51f',
      // 文字默认颜色
      color: color || '#7A7E83',
    }
    uni.setTabBarStyle(tabBar)
  }
}
