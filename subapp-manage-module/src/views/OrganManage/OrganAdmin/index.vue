<!--
 * @Author: Nic
 * @Date: 2022-10-18 17:11:13
 * @LastEditTime: 2023-02-15 11:59:43
 * @LastEditors: Nic
 * @Description: 组织管理
 * @FilePath: /medical-community/subapp-manage-module/src/views/OrganManage/OrganAdmin/index.vue
-->
<template>
  <div>
    <ProLayout mainBgColor="#F5F5F5" padding="0" margin="0">
      <template #title>组织管理</template>
      <template #main>
        <div class="organ-detail">
          <div class="tree">
            <div class="title">
              <span class="title-text">组织目录</span>
              <i class="el-icon el-icon-refresh" @click="getOrgTree"></i>
              <span class="count">{{ orgTotalCount }}条</span>
              <div class="right">
                <span class="add" @click="resetOrganDetail">
                  <i class="el-icon el-icon-plus"></i>
                </span>
                <span @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
                  <i class="el-icon el-icon-more"></i>
                  <div class="actions" v-show="showFlag" @mouseenter="handleMouseEnter">
                    <div class="action-item" @click="toggleExpand(true)">展开全部</div>
                    <div class="action-item" @click="toggleExpand(false)">折叠全部</div>
                  </div>
                </span>
              </div>
            </div>
            <div class="content">
              <el-input v-model="keyword" placeholder="请输入目录名称" class="keyword-input">
                <el-button slot="append" icon="el-icon-search" @click="getOrgTree"></el-button>
              </el-input>
              <el-tree :data="orgTreeData" default-expand-all @node-click="handleNodeClick" ref="tree" node-key="id" class="el-tree">
                <span class="custom-tree-node" slot-scope="{ node }">
                  <span :title="node.label">{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </div>
          <div class="detail">
            <div class="title">组织详情</div>
            <el-form class="el-form" label-width="100px" :model="organDetail" :rules="rules">
              <el-form-item label="组织Id" prop="code" v-if="mode === 'edit'">
                <el-input placeholder="系统生成" v-model="organDetail.code" disabled />
              </el-form-item>
              <el-form-item label="组织类型" prop="type">
                <el-select v-model="organDetail.type" clearable :disabled="mode === 'edit'" @change="$set(organDetail, 'parentId', '')">
                  <el-option :disabled="!$IS_ROOT_ADMIN" label="集团" value="_ORG_" />
                  <el-option label="医院" value="_HOS_" :disabled="$IS_ROOT_ADMIN" />
                </el-select>
              </el-form-item>
              <el-form-item label="组织名称" prop="name">
                <el-input placeholder="组织名称" v-model="organDetail.name" />
              </el-form-item>
              <el-form-item label="上级目录">
                <el-cascader
                  v-model="organDetail.parentId"
                  :options="orgOptionsData"
                  :props="{ checkStrictly: true }"
                  :show-all-levels="false"
                  :disabled="organDetail.type === '_ORG_'"
                />
              </el-form-item>
              <el-form-item label="排序" prop="seq" v-if="mode === 'edit'">
                <el-input placeholder="排序" v-model="organDetail.seq" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input placeholder="备注" v-model="organDetail.description" type="textarea" :rows="3" maxlength="200" show-word-limit />
              </el-form-item>
            </el-form>
            <div class="actions">
              <el-button class="delete" type="danger" v-show="organDetail.id" @click="deleteOrg">删除</el-button>
              <el-button class="submit" type="primary" @click="saveOrg">保存</el-button>
            </div>
          </div>
        </div>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import { getOrgTree, saveOrg, getOrgOptions, deleteOrg } from '@/api/modules/systemAdmin'

export default {
  components: {
    ProLayout,
  },
  data() {
    return {
      showFlag: false,
      keyword: '',
      orgTreeData: [],
      orgOptionsData: [],
      organDetail: {},
      rules: {
        code: [{ required: true, message: '请输入组织编码', trigger: 'blur' }],
        type: [{ required: true, message: '请选择组织类型', trigger: 'blur' }],
        name: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
      },
      mode: 'add',
      orgTotalCount: 0,
    }
  },
  mounted() {
    this.getOrgTree()
    this.getOrgOptions('')
  },
  methods: {
    // 获取左侧结构树
    async getOrgTree() {
      try {
        const res = await getOrgTree({ name: this.keyword })
        console.log('getOrgTree==', res)
        this.orgTreeData = res.result.treeData
        this.orgTotalCount = res.result.tot
      } catch (err) {
        console.error(err)
      }
    },

    // 获取上级目录
    async getOrgOptions(orgId) {
      try {
        const res = await getOrgOptions({ id: orgId })
        console.log('getOrgOptions==', res)
        this.orgOptionsData = res.result
      } catch (err) {
        console.error(err)
      }
    },

    // 保存机构详情
    async saveOrg() {
      let parentId
      if (typeof this.organDetail.parentId === 'string') {
        parentId = this.organDetail.parentId
      } else {
        parentId = this.organDetail.parentId ? this.organDetail.parentId[this.organDetail.parentId.length - 1] : ''
      }
      try {
        const res = await saveOrg({
          ...this.organDetail,
          parentId,
        })
        this.$message.success('保存成功！')
        console.log('saveOrg==', res)
        this.getOrgTree()
      } catch (err) {
        console.error(err)
      }
    },

    // 点击新增机构按钮
    resetOrganDetail() {
      this.mode = 'add'
      this.organDetail = {}
      this.getOrgOptions('')
    },

    // 点击机构
    async handleNodeClick(data) {
      console.log('handleNodeClick', data)
      this.mode = 'edit'
      await this.getOrgOptions(data.id)
      this.organDetail = {
        code: data.code,
        id: data.id,
        type: data.type,
        name: data.label,
        parentId: data.parentId || '',
        description: data.description,
        seq: data.seq,
      }
    },
    // 删除机构
    deleteOrg() {
      this.$confirm('确定要删除该组织吗', '提示', {}).then(async () => {
        try {
          const res = await deleteOrg({ orgId: this.organDetail.id })
          console.log('deleteOrg==', res)
          this.getOrgTree()
          this.organDetail = {}
          this.mode = 'add'
        } catch (err) {
          console.error(err)
        }
      })
    },
    handleMouseLeave() {
      this.timer = setTimeout(() => {
        this.showFlag = false
      }, 100)
    },
    handleMouseEnter() {
      clearTimeout(this.timer)
      this.showFlag = true
    },
    toggleExpand(flag) {
      const nodes = this.$refs.tree.store._getAllNodes()
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].expanded = flag
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.organ-detail {
  height: calc(100vh - 115px);
  // background: #ccc;
  // height: 800px;
  padding: 15px 15px 0 15px;
  box-sizing: border-box;
  display: flex;
  .tree {
    width: 260px;
    background: #fff;
    margin-right: 15px;
    padding: 0px 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .custom-tree-node {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .title {
      border-bottom: 1px solid #ccc;
      padding: 16px 0;
      position: relative;
      .title-text {
        font-size: 16px;
      }
      .el-icon {
        color: #446abd;
        &.el-icon-refresh {
          margin: 0 3px;
          cursor: pointer;
        }
      }
      .count {
        color: #949494;
        font-size: 12px;
      }
      .right {
        float: right;
        .add {
          display: inline-block;
          width: 22px;
          height: 22px;
          border-radius: 2px;
          border: 1px solid #446abd;
          font-size: 16px;
          text-align: center;
          line-height: 22px;
          margin-right: 5px;
          cursor: pointer;
        }
        .el-icon-more {
          transform: rotate(90deg);
          color: #303133;
          cursor: pointer;
        }
      }
      .actions {
        position: absolute;
        right: -35px;
        top: 50px;
        background: #fff;
        width: 75px;
        text-align: center;
        line-height: 32px;
        box-shadow: 0 0 5px #ccc;
        color: #303133;
        font-size: 12px;
        z-index: 100;
        .action-item {
          cursor: pointer;
          &:first-child {
            border-bottom: 1px solid #ccc;
          }
        }
      }
    }
    .content {
      margin-top: 14px;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding-bottom: 10px;
      .keyword-input {
        margin-bottom: 5px;
      }
      .el-tree {
        flex: 1;
        overflow: auto;
      }
    }
  }
  .detail {
    flex: 1;
    background: #fff;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
      padding: 15px 14px;
      line-height: 16px;
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
    .el-form {
      width: 500px;
      margin: 30px auto;
      ::v-deep .el-form-item {
        margin-bottom: 22px !important;
      }
      ::v-deep .el-cascader,
      ::v-deep .el-select {
        width: 100%;
      }
    }
    .actions {
      text-align: center;
    }
  }
}
</style>
