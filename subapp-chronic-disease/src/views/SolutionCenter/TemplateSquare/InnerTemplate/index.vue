<!--
 * @Author: Nic
 * @Date: 2023-01-31 17:38:13
 * @LastEditTime: 2023-02-28 16:13:10
 * @LastEditors: Nic
 * @Description: 院内模板
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/InnerTemplate/index.vue
-->
<template>
  <div class="InnerTemplate">
    <el-collapse
      v-model="activeNames"
      v-if="
        getValTest.startData &&
        getValTest.stopData &&
        (getValTest.startData.length !== 0 || getValTest.stopData.length !== 0)
      "
    >
      <el-collapse-item title="开启中" name="1">
        <ProgramCards :cardData="getValTest.startData" @changePage="changePage" @refreshData="refreshData" />
      </el-collapse-item>
      <el-collapse-item title="关闭中" name="2">
        <ProgramCards :cardData="getValTest.stopData" @changePage="changePage" @refreshData="refreshData" />
      </el-collapse-item>
    </el-collapse>

    <div v-else class="empty">
      <div>
        <img src="@/assets/empty.png" alt="" />
      </div>
      <div>未检索到符合条件方案</div>
    </div>
    <!-- <el-button @click="go">编辑方案</el-button> -->
  </div>
</template>

<script>
import ProgramCards from '../components/ProgramCards.vue'
export default {
  inject: ['templateData'],
  components: {
    ProgramCards,
  },
  computed: {
    getValTest() {
      return this.templateData()
    },
  },
  data() {
    return {
      activeNames: ['1', '2'],
    }
  },
  methods: {
    refreshData() {
      this.$emit('refreshData')
    },
    changePage(row) {
      // this.activeComponent = DraftColumn
      // this.$router.push({
      //   name: 'DraftColumn',
      //   query: this.$route.query,
      // })
      this.$router.push({
        name: 'EditPlan', //EditPlan
        query: {
          routeName: '草稿栏',
          planId: row,
        },
      })
    },
    go() {
      console.log(`EditPlan`)
      this.$router.push({
        name: 'AddPlan', //EditPlan
        query: {
          planId: '14ab1d000b5440b9bc7bc1a8b6d43138',
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.InnerTemplate {
  height: 100%;
  padding-top: 20px;
  .empty {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(141, 148, 159, 1);
    font-size: 14px;
    flex-direction: column;
  }
  ::v-deep .el-collapse-item__wrap {
    background-color: #f5f5f5 !important;
    overflow: hidden;
    box-sizing: border-box;
    border-bottom: none;
  }

  ::v-deep .el-collapse-item__content {
    padding-top: 0 !important;
    padding-bottom: 20px !important;
  }

  ::v-deep .el-collapse-item__header {
    display: flex;
    align-items: center;
    height: 40px;
    line-height: 40px;
    background-color: #e8e8e8;
    color: #7d8899;
    cursor: pointer;
    border-bottom: 0;
    font-size: 13px;
    font-weight: 500;
    transition: none;
    outline: 0;
    border: none;
    padding-left: 10px;
  }
}
</style>
