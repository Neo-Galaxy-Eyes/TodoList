<template>
  <div>
    <a-input placeholder="请输入任务" class="my_ipt" :value="inputValue" @change="handleInputChange">

    <a-button type="primary" @click="addItemToList">添加事项</a-button>

    <a-list bordered :dataSource="infoList" class="dt_list">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- 复选框 -->
        <!-- 里面的内容发送改变，change函数被触发 -->
        <a-checkbox :checked="item.done" @change="(e)=>{cbStatusChanged(e,item.id)}">{{item.info}}</a-checkbox>
        <!-- 删除链接 -->
        <a slot="actions" @click="removeItemById(item.id)">删除</a>
      </a-list-item>

      <div slot="footer" class="footer">
        <span>{{unDoneLength}} 条剩余</span>

        <a-button-group>
          <!-- primary用在此处表示为按钮高亮 -->
          <a-button :type="viewKey === 'all'?'primary':'default'" @click="changeList('all')">全部</a-button>
          <a-button :type="viewKey === 'undone'?'primary':'default'" @click="changeList('undone')">未完成</a-button>
          <a-button :type="viewKey === 'done'?'primary':'default'" @click="changeList('done')">已完成</a-button>
        </a-button-group>

        <a @click="clean">清除已完成</a>
      </div>
    </a-list>

  </div>
</template>

<script>
// 使vuex里面的数据源可以在此使用
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'app',
  data () {
    return {
    }
  },
  // 在created阶段触发actions函数，从而获取数据列表
  created () {
    this.$store.dispatch('getList')
  },
  computed: {
    ...mapState(['inputValue', 'viewKey']),
    ...mapGetters(['unDoneLength', 'infoList'])
  },
  methods: {
    // 监听文本和内容变化
    handleInputChange (e) {
      // 触发mutations里面的setInputValue函数
      this.$store.commit('setInputValue', e.target.value);
    },
    // 向列表中新增item项
    addItemToList () {
      // 不能新增的情况
      if (this.inputValue.trim().length <= 0) {
        // Antd组件库会自动往每个组件的this上绑定$message函数，支持调用里面的warning
        return this.$message.warning('文本框内容不能为空');
      }
      // 触发mutations里的addItem函数
      this.$store.commit('addItem');
    },
    // 根据Id删除对应的事项
    removeItemById (id) {
      this.$store.commit('removeItem', id);
    },
    // 监听复选框选中状态变化的事件，难点
    cbStatusChanged (e, id) {
      // 先保存这些数据
      const param = {
        id: id,
        // 通过e.target.checked可以接受到最新的选中状态
        status: e.target.checked
      }
      this.$store.commit('changeStatus', param);
    },
    // 清除已经完成的任务
    clean () {
      this.$store.commit('clearDone');
    },
    // 修改页面上展示的高亮按钮
    changeList (key) {
      this.$store.commit('changeViewKey', key);
    }
  }
}
</script>

<style scoped>
#app{
  padding:10px;
}
.my_ipt{
  width: 500px;
  margin-right: 10px;
}
.dt_list{
  width: 500px;
  margin-top: 10px;
}
.footer{
	display:flex;
	justify-content:space-between;
	align-items:center;
}
</style>
