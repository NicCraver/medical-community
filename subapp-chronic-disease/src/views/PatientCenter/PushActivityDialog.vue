<template>
  <ProDialog
    title="推送活动"
    width="520px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    top="10vh"
    v-bind="$attrs"
    :visible="pushVisible"
    class="push-activity-dialog"
  >
    <div>
      <div class="name" v-if="pushData.name !== '/'">
        <span style="color: #303133">{{ pushData.name }}</span>
        <span style="color: #919191">
          <span style="padding: 0 10px">|</span>
          <span>{{ pushData.sexDesc }}</span>
          <span style="padding: 0 10px">|</span>
          <span>{{ pushData.age }}</span>
        </span>
      </div>
      <div class="name" v-else>{{ pushData.phoneNo }}</div>
      <div style="padding: 20px">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="活动推送模式">
            <el-select v-model="ruleForm.pushType" disabled>
              <el-option label="手动推送" value="HAND" />
              <el-option label="自动推送" value="AUTO" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动名称" prop="activityId">
            <UniversalSelect
              v-model="ruleForm.activityId"
              ref="couponUserIdRef"
              placeholder="活动名称"
              url="/ygt-marketing/tbAActivityPush/queryActivityDownInfo"
              :params="{
                pushType: ruleForm.pushType,
              }"
            />
          </el-form-item>
        </el-form>
        <div style="color: rgba(90, 90, 90, 100); font-size: 12px">
          <i class="el-icon-warning-outline"></i>
          仅支持满足活动“适用人群"要求的患者参与活动。
        </div>
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
  batchPushActivity,
} from '../../api/modules/PatientCenter'

export default {
  name: 'JionDialog',
  components: { ProDialog },
  props: {
    pushVisible: Boolean,
    pushData: Object,
    onInquire: Function,
    clearFun: Function,
  },
  data() {
    return {
      ruleForm: {
        pushType: 'HAND',
        patIds: [],
      },
      rules: {
        activityId: [{ required: true, message: '请选择', trigger: 'blur' }],
      },
      orgExtent: [],
      orgTrees: [],
      allIds: [],
      selectOrgIds: [],
    }
  },
  mounted() {
    // this.onInitFollowup()
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(`this.ruleForm`, this.ruleForm)
          this.ruleForm.patIds.push(this.pushData.patId)
          this.batchPushActivity()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async batchPushActivity() {
      try {
        const res = await batchPushActivity(this.ruleForm)
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
      this.$emit('update:pushVisible', false)
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
.name {
  height: 40px;
  line-height: 40px;
  background: #f5f5f5;
  font-size: 16px;
  padding-left: 15px;
}
.push-activity-dialog {
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    padding: 15px !important;
  }
  ::v-deep .ProDialog .title:before {
    content: '';
    position: absolute;
    left: -15px;
    width: 4px;
    border-radius: 0 1px 1px 0;
    height: 20px;
    background-color: #134796;
  }
  ::v-deep .el-dialog__body {
    padding: 0 !important;
  }
}
</style>
