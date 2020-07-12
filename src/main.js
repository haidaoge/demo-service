import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'

Vue.use(ElementUI);

// Vue.config.productionTip = false

import router from './router'

// 导入amap
import AmapVue from '@amap/amap-vue';
AmapVue.config.version = '2.0'; // 默认2.0，这里可以不修改
AmapVue.config.key = 'cd18de5b6a25a69d73f53187cd016ed6';
AmapVue.config.plugins = [
  'AMap.ToolBar',
  'AMap.MoveAnimation',
  // 在此配置你需要预加载的插件，如果不配置，在使用到的时候会自动异步加载
];
Vue.use(AmapVue);


// 引入axios
import axios from 'axios'
// 修改参数，由于后台接收的参数是formData类型，所以这里需要将发送的json参数全部转formData，
// 1. 将get、post请求头设置为：'application/x-www-form-urlencoded'
// 2. 在请求发送前进行格式转换

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 2000;
axios.defaults.transformRequest = [function (data) {
    let ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
}]
// 把axios绑定到vue实例的属性$axios
Vue.prototype.$axios = axios
if (process.env.NODE_ENV == 'development') {  
    //开发环境
    axios.defaults.baseURL = 'api/';
    
} else if (process.env.NODE_ENV == 'production') {  
    //生产环境
    axios.defaults.baseURL = '/';
}

import basePms from '@/utils/data'
Vue.prototype.$basePms = basePms;


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
