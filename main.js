import App from './App.vue'

// #ifndef VUE3
import Vue from 'vue'
// import store from './store'
import uView from '@/uni_modules/uview-ui'
// import mpShare from '@/uni_modules/uview-ui/libs/mixin/mpShare'

//引入store
import store from 'store/index.js'

//注册全局导航栏组件
import zhouWeiNavBar from "@/components/zhouWei-navBar";
import EModel from '@/components/e-model/EModel';

//监听主题变化    
import theme from './theme/cue-theme.js'
Vue.use(theme)

Vue.use(uView);
Vue.config.productionTip = false;

// 引入uView对小程序分享的mixin封装
// Vue.mixin(mpShare)
Vue.prototype.$store = store
// 生产环境
// Vue.prototype.$baseURL = "https://app.drawai.cn";
// 测试环境
Vue.prototype.$baseURL = "https://ymapi.lingchuang.art/api04";

// Vue.prototype.$baseURL = "http://127.0.0.1:8888";

Vue.component("nav-bar", zhouWeiNavBar);
Vue.component("e-model", EModel);

App.mpType = 'app'
const app = new Vue({
  store,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
export function createApp() {
  const app = createSSRApp(App);
  return {
    app
  }
}
// #endif


