import Vue from 'vue'
import { get } from 'lodash'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from './firebase'
import vuetify from './plugins/vuetify'
import '../public/style/critical.css'
import './middlewares'

Vue.prototype.$get = get
Vue.prototype.$firebase = firebase

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
