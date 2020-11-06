import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 所有的任务列表
    list: [],
    // 文本框的内容
    inputValue: 'aaa',
    // 下一个id
    nextId: 5,
    viewKey: 'all'
  },
  mutations: {
    // 将异步请求得来的数据保存在state中的list里面
    initList (state, list) {
      state.list = list;
    },
    // 记录输入框所输入的值
    // 为store中的inputValue赋值
    setInputValue (state, val) {
      state.inputValue = val;
    },
    addItem (state) {
      const obj = {
        // 当前序号，难点
        id: state.nextId,
        // 数据内容
        info: state.inputValue.trim(),
        // 默认表示当前事件未完成
        done: false
      }
      // 往list添加数据
      state.list.push(obj);
      // 当前序号已用，序号变为下一个
      state.nextId++;
      // 清空输入框
      state.inputValue = '';
    },
    // 根据Id删除对应的任务事项
    removeItem (state, id) {
      // 根据Id查找对应项的索引，难点
      const i = state.list.findIndex(x => x.id === id);
      // 根据索引，删除对应的元素
      if (i !== -1) {
        // 删除索引所对应的那一项
        state.list.splice(i, 1);
      }
    },
    // 修改列表项的选中状态
    changeStatus (state, param) {
      // 筛选出符合条件的数据项
      const i = state.list.findIndex(x => x.id === param.id);
      if (i !== -1) {
        // 新值为param里面的status属性值
        state.list[i].done = param.status;
      }
    },
    // 清除已经完成的任务
    clearDone (state) {
      state.list = state.list.filter(x => x.done === false);
    },
    // 修改视图的关键字
    changeViewKey (state, key) {
      state.viewKey = key;
    }
  },
  actions: {
    getList (context) {
      axios.get('/list.json').then((data) => {
        // 请求到data数据以后，将数据保存在state的list里面
        // 需要调用mutations里面的函数来实现这一步
        context.commit('initList', data);
      })
    }
  },
  getters: {
    // 统计未完成的任务的条数
    unDoneLength (state) {
      // 筛选出符合条件的数据项个数
      return state.list.filter(x => x.done === false).length;
    },
    // 按需切换列表数据
    infoList (state) {
      if (state.viewKey === 'all') {
        return state.list;
      }
      if (state.viewKey === 'undone') {
        return state.list.filter(x => !x.done);
      }
      if (state.viewKey === 'done') {
        return state.list.filter(x => x.done);
      }
      return state.list;
    }
  }
})
