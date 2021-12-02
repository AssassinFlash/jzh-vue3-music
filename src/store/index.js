import { createStore } from 'vuex'
import state from './state'
import mutations from '@/store/mutations'
import * as getters from './getters'
import * as actions from './actions.js'
/*
* Vuex：全局状态管理工具
* stete：数据仓库，存储全局数据
* getters：state的计算属性
* mutations：对state的数据进行修改，并不能直接对state的数据进行修改
* actions：对mutations的一些封装
* */
export default createStore({
  state,
  getters,
  mutations,
  actions
})
