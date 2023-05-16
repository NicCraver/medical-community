<template>
  <ProDialog
    title="纳入随访"
    width="520px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    top="10vh"
    v-bind="$attrs"
    :visible="joinVisible"
    class="dia"
  >
    <div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="机构范围" prop="name">
          <el-radio-group v-model="ruleForm.org">
            <el-radio v-for="v in orgExtent" :key="v.value" :label="v.id">
              {{ v.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="机构列表" prop="name">
          <el-tree
            style="margin-top: 7px"
            ref="instLevelTree"
            :show-checkbox="ruleForm.org !== 'ALL'"
            default-expand-all
            check-strictly
            :expand-on-click-node="false"
            check-on-click-node
            :data="orgTrees"
            node-key="value"
            @check-change="checkChange"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <div style="margin-top: 50px; color: rgba(90, 90, 90, 100); font-size: 12px">
        <i class="el-icon-warning-outline"></i>
        机构列表中被勾选的机构都能为患者提供随访管理服务。
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm()">确认</el-button>
    </template>
  </ProDialog>
</template>

<script>
import { ProDialog } from 'anx-vue'
import {
  onInitFollowup,
  joinFollowUp,
  getPatIsExistFollowupPlanOver,
} from '../../api/modules/PatientCenter'

export default {
  name: 'JionDialog',
  components: { ProDialog },
  props: {
    joinVisible: Boolean,
    joinDataList: Array,
    joinData: Object,
    onInquire: Function,
    clearFun: Function,
  },
  data() {
    return {
      ruleForm: {
        org: 'ALL',
        orgIds: [],
      },
      rules: {
        org: [{ required: true, message: '请选择', trigger: 'blur' }],
      },
      orgExtent: [],
      orgTrees: [],
      allIds: [],
      selectOrgIds: [],
    }
  },
  mounted() {
    this.onInitFollowup()
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(`this.ruleForm`, this.ruleForm)
          this.joinFollowUp()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async joinFollowUp() {
      try {
        if (this.ruleForm.org === 'ALL') {
          this.ruleForm.orgIds = this.allIds
          // this.$set(this.ruleForm, 'orgIds', this.allIds)
        } else {
          if ( this.$refs.instLevelTree.getCheckedKeys().length === 0) {
            this.$message.error('请选择机构！')
            return
          }
          this.ruleForm.orgIds = this.$refs.instLevelTree.getCheckedKeys()
          // this.$set(this.ruleForm, 'orgIds', this.$refs.instLevelTree.getCheckedKeys())
        }
        const res = await joinFollowUp({
          patIds: this.joinDataList,
          orgIds: this.ruleForm.orgIds,
          followupIncludeUserId: window.sessionStorage.getItem('userId'),
          followupIncludeUserName: window.sessionStorage.getItem('loginName'),
        })
        this.$message.success('保存成功')
        this.$emit('onInquire')
        this.$emit('clearFun')
        this.handleClose()
      } catch (err) {
        console.error(err)
      }
    },
    checkChange(data, flag) {
      // console.log(`data`, data)
      // console.log(`flag`, flag)
      let temp = this.selectOrgIds.filter((el) => el === data.value)
      if (temp.length === 1 && !flag) {
        console.log(`data`, data)
        this.getPatIsExistFollowupPlanOver(data.label, data.value)
      }
    },
    async onInitFollowup() {
      try {
        const res = await onInitFollowup(this.joinDataList)
        this.orgExtent = res.result.orgExtent
        this.orgTrees = res.result.orgTrees
        this.allIds = res.result.allIds
        this.selectOrgIds = res.result.selectOrgIds
        if (res.result.selectOrgIds.length > 0) {
          console.log(`11111111`, 11111111)
          if (res.result.selectOrgIds.length === res.result.allIds.length) {
            this.ruleForm.org = 'ALL'
            console.log(`22222222`, 22222222)
          } else {
            console.log(`33333333`, 33333333)
            this.ruleForm.org = 'SELECT'
            this.$refs.instLevelTree.setCheckedKeys(res.result.selectOrgIds, false)
          }
        }
      } catch (error) {
        console.log(`error`, error)
      }
    },
    async getPatIsExistFollowupPlanOver(hosName, hosId) {
      try {
        const res = await getPatIsExistFollowupPlanOver({ hosId, patId: this.joinData.patId })
        if (res.result === 'Y') {
          var htmlText =
            '患者在被删除机构<span style="font-size:14px;font-weight:bold;color:#4C67B7">' +
            hosName +
            '</span>有待启动/进行中随访任务。删除机构后不影响以上随访任务的进行。'
          this.$confirm(htmlText, '提示', {
            confirmButtonText: '编辑机构',
            cancelButtonText: '返回',
            dangerouslyUseHTMLString: true,
            type: 'warning',
          })
            .then(() => {
              // this.joinFollowUp(row)
            })
            .catch(() => {
              let temp = []
              temp.push(hosId)
              this.$refs.instLevelTree.setCheckedKeys(temp, false)
            })
        }
      } catch (error) {
        console.log(`error`, error)
      }
    },
    handleClose() {
      this.visible = false
      this.$emit('update:joinVisible', false)
    },
  },
  watch: {},
}
</script>

<style lang="scss">
.red {
  color: red;
}
</style>
<style lang="scss" scoped>
.title {
  background-color: #f5f5f5;
  color: #101010;
  margin-bottom: 20px;
  // padding: 5px;
}
.dia {
  ::v-deep.el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    padding: 15px !important;
  }
  ::v-deep.ProDialog .title:before {
    content: '';
    position: absolute;
    left: -15px;
    width: 4px;
    border-radius: 0 1px 1px 0;
    height: 20px;
    background-color: #134796;
  }
}
</style>
