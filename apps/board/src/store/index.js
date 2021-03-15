import Vue from 'vue'
import Vuex from 'vuex'
import AppModule from './app'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app: AppModule,
  },
})

export default store
