import Vue from "vue"
import Vuex from "vuex"
// 登录
import logIn from "./modules/login.js"
// 主题切换
import theme from "./modules/theme.js"
import draw from "./modules/draw.js"
import user from "./modules/user.js"

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    theme,
    logIn,
    draw,
    user,
  }
})

export default store
