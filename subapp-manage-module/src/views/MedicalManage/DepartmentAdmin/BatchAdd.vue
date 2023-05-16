<template>
  <ProDrawer
    :visible="visible"
    title="批量新建"
    direction="rtl"
    :before-close="handleClose"
    :size="600"
    :show-close="true"
  >
    <div class="batch-add">
      <div class="content">
        <el-form label-width="85px" :model="batchDetail" :rules="rules" ref="elForm">
          <el-form-item label="医院名称" prop="hosId">
            <el-cascader
              v-model="batchDetail.hosId"
              :options="hosCascaderOptions"
              ref="deptDicCascader"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="科室类型">
            <el-checkbox-group v-model="deptType" @change="handleDeptTypeChange">
              <el-checkbox
                v-for="item in deptTypeList"
                :key="item.VALUE"
                :label="item.VALUE"
                :disabled="
                  (deptType.includes(menzhenValue) && item.VALUE === zhuyuanValue) ||
                  (deptType.includes(zhuyuanValue) && item.VALUE === menzhenValue)
                "
                >{{ item.LABLE }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="科室信息" prop="deptName">
            <!-- <el-tree :data="data" nodeKey="key" :props="defaultProps" default-expand-all :height="300" show-checkbox /> -->
            <div class="dept-container">
              <div class="tree-container">
                <el-input v-model="dicDeptKeyword" @input="getDicCascaderOptionsByKeyword" />
                <el-tree
                  :height="490"
                  :expand-on-click-node="false"
                  :data="dicCascaderOptions"
                  show-checkbox
                  node-key="value"
                  ref="leftElTree"
                  @check="handleNodeClick"
                />
              </div>
              <div class="tree-container">
                <el-tree
                  :height="530"
                  :expand-on-click-node="false"
                  :data="rightDeptTreeData"
                  default-expand-all
                  ref="rightElTree"
                  node-key="value"
                >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                      <el-button type="text" size="mini" @click="() => deleteDept(data)"
                        ><i class="el-icon el-icon-close"></i
                      ></el-button>
                    </span>
                  </span>
                </el-tree>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="科室状态" prop="status">
            <el-switch v-model="batchDetail.status" active-text="开启" inactive-text="停用" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template slot="footer">
      <el-button type="default" @click="handleClose">取消</el-button>
      <el-button type="primary" @click="batchAddDept">确认</el-button>
    </template>
  </ProDrawer>
</template>

<script>
import {
  getDictionary,
  getDeptDicCascaderOptions,
  batchAddDept,
  getHosCascaderOptions,
} from '@/api/modules/systemAdmin'
import { ProDrawer } from 'anx-vue'
import debounce from 'throttle-debounce/debounce'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    function dig(path = '0', level = 3) {
      const list = []
      for (let i = 0; i < 10; i += 1) {
        const key = `${path}-${i}`
        const treeNode = {
          title: key,
          key,
        }

        if (level > 0) {
          treeNode.children = dig(key, level - 1)
        }

        list.push(treeNode)
      }
      return list
    }
    const deptNameValidate = (rule, value, callback) => {
      if (!this.rightDeptTreeData || !this.rightDeptTreeData.length) {
        callback(new Error())
      } else {
        callback()
      }
    }
    return {
      data: dig(),
      defaultProps: {
        children: 'children',
        label: 'title',
      },
      hosCascaderOptions: [],
      deptTypeList: [],
      batchDetail: {
        hosId: '',
        status: true,
      },
      rules: {
        hosId: [{ required: true, message: '请选择医院', trigger: 'blur' }],
        deptName: [{ required: true, validator: deptNameValidate, message: '请勾选科室', trigger: 'blur' }],
        status: [{ required: true, message: '', trigger: 'blur' }],
      },
      deptType: [],
      dicDeptKeyword: '',
      dicCascaderOptions: [],
      rightDeptTreeData: [],
      rightDeptListData: [],
      deleteDeptNode: null,
      result: [],
      getDicCascaderOptionsByKeyword: null,
    }
  },
  computed: {
    menzhenValue() {
      return this.deptTypeList.length ? this.deptTypeList.find((item) => item.LABLE === '门诊').VALUE : ''
    },
    zhuyuanValue() {
      return this.deptTypeList.length ? this.deptTypeList.find((item) => item.LABLE === '住院').VALUE : ''
    },
  },
  mounted() {
    this.getHosCascaderOptions()
    this.getDictionary()
    this.getDicCascaderOptionsByKeyword = debounce(300, this.getDeptDicCascaderOptions)
  },
  methods: {
    // 获取级联集团医院
    async getHosCascaderOptions() {
      try {
        const res = await getHosCascaderOptions()
        console.log('getHosCascaderOptions==', res)
        this.hosCascaderOptions = res.result
      } catch (err) {
        console.error(err)
      }
    },
    // 获取科室类型字典
    async getDictionary() {
      try {
        const res = await getDictionary({ code: 'DEPT_CLASSIFY' })
        console.log('getDictionary==', res)
        this.deptTypeList = res.result
      } catch (err) {
        console.error(err)
      }
    },

    // 获取全量级联科室
    async getDeptDicCascaderOptions(name) {
      try {
        const res = await getDeptDicCascaderOptions({ deptClassifys: this.deptType, name: name || '' })
        console.log('getDeptDicCascaderOptions==', res)
        this.dicCascaderOptions = res.result
      } catch (err) {
        console.error(err)
      }
    },

    // 科室类型勾选发生变化
    handleDeptTypeChange() {
      if (!this.deptType || !this.deptType.length) {
        this.dicCascaderOptions = []
      } else {
        this.getDeptDicCascaderOptions()
      }
      this.rightDeptTreeData = []
    },

    // 左侧字典选中状态发生变化
    handleNodeClick() {
      console.log(`11111111`,11111111)
      // 左侧选中科室的平铺数据
      const leftDeptListData = JSON.parse(JSON.stringify(this.$refs.leftElTree.getCheckedNodes(false, true)))
      // 右侧平铺科室数据
      this.rightDeptListData = this.expandRightTreeData(this.rightDeptTreeData)
      // 左右平铺科室组合
      const combineDeptListResult = this.combineLeftAndRightDeptData(leftDeptListData, this.rightDeptListData)

      // 右侧科室树形结构数据
      this.rightDeptTreeData = this.createRightTreeData(
        combineDeptListResult.filter((item) => !item.parentId),
        combineDeptListResult.filter((item) => item.parentId),
      )
    },

    // 右侧科室树数据平铺开
    expandRightTreeData(deptList, result) {
      result = result || []
      deptList.forEach((item) => {
        result.push(item)
        if (item.children && item.children.length) {
          this.expandRightTreeData(item.children, result)
        }
      })
      return result
    },

    // 获取左右机构树平铺并集
    combineLeftAndRightDeptData(leftData, rightData) {
      const result = JSON.parse(JSON.stringify(rightData))

      console.log('result==', result)
      console.log('rightData==', rightData)

      const resultValues = result.map((item) => item.value)
      leftData.forEach((item) => {
        if (!resultValues.includes(item.value)) {
          result.push(item)
        }
      })
      return result
    },

    // 创建右侧科室树数据
    createRightTreeData(patentList, children) {
      patentList.forEach((patentItem, index) => {
        const currentChildren = children.filter((item) => item.parentId === patentItem.value)
        if (currentChildren && currentChildren.length) {
          patentItem.children = currentChildren
          this.createRightTreeData(patentItem.children, children)
        }
      })
      return patentList
    },

    // 右侧点击删除科室节点
    deleteDept(nodeData) {
      this.findLeftTreeNode(this.dicCascaderOptions, nodeData.value)
      if (this.deleteDeptNode) {
        this.$refs.leftElTree.setChecked(this.deleteDeptNode, false, true)
        this.deleteDeptNode = null
      }
      this.$refs.rightElTree.remove(nodeData)
      console.log(this.rightDeptTreeData)
    },

    // 右侧点击删除节点左侧获取对应节点
    findLeftTreeNode(treeData, nodeValue, result) {
      for (let i = 0; i < treeData.length; i++) {
        if (this.deleteDeptNode) {
          break
        }
        if (treeData[i].value === nodeValue) {
          this.deleteDeptNode = treeData[i]
          break
        } else if (treeData[i].children) {
          this.findLeftTreeNode(treeData[i].children, nodeValue)
        }
      }
    },

    // 关闭drawer
    handleClose() {
      this.batchDetail = {
        hosId: '',
        status: true,
      }
      this.deptType = []
      this.dicCascaderOptions = []
      this.rightDeptTreeData = []
      this.deleteDeptNode = null
      this.$emit('update:visible', false)
    },

    // 提交
    batchAddDept() {
      this.$refs.elForm.validate(async (valid) => {
        if (valid) {
          try {
            const res = await batchAddDept({
              ...this.batchDetail,
              hosId: this.batchDetail.hosId[this.batchDetail.hosId.length - 1],
              status: this.batchDetail.status ? 'Y' : 'N',
              deptDatas: this.rightDeptTreeData,
            })
            this.handleClose()
            this.$emit('batch-add-success')
          } catch (err) {
            console.error(err)
          }
        }
      })
    },
  },
  components: {
    ProDrawer,
  },
}
</script>

<style lang="scss" scoped>
.batch-add {
  .drawer-title {
    font-size: 16px;
    line-height: 1;
    font-weight: bold;
    color: #303133;
    padding: 17px 13px;
    position: relative;
    border-bottom: 1px solid #e9e9e9;
    &:before {
      content: ' ';
      display: inline-block;
      width: 3px;
      height: 16px;
      background: #134796;
      position: absolute;
      left: 0;
    }
  }
  .content {
    padding: 20px;
    .dept-container {
      display: flex;
      .tree-container {
        flex: 1;
        padding: 10px;
        background-color: #ccc;
        max-height: 550px;
        overflow: auto;
        ::v-deep .el-tree__empty-block {
          display: none;
        }
      }
    }
  }

  ::v-deep.el-tree {
    line-height: 26px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>
