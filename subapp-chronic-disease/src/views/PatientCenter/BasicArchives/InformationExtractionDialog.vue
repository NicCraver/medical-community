<template>
  <div class="InformationExtractionDialog">
    <el-dialog class="abow_dialog" :visible.sync="dialogVisible" width="85vw" :close-on-click-modal="false">
      <template #title>
        <div class="ie-dialog-header">
          <div>信息提取</div>
          <div class="text">通过患者上传的就诊资料，提取档案信息</div>
        </div>
      </template>
      <div class="ie-dialog-content">
        <!-- <TableA /> -->
        <!-- 左右布局 -->
        <ImagePreview class="ImagePreview" ref="preview" :seekDialogData="seekDialogData" />
        <div class="form-entry">
          <el-scrollbar style="height: calc(100% - 40px)">
            <div class="form-main">
              <div class="form-card">
                <header class="form-card-header">
                  <div>
                    <i class="el-icon-refresh"></i>
                    门诊记录
                    <i class="el-icon-arrow-down"></i>
                  </div>
                  <div class="btn">
                    <img src="@/assets/xantOutline-delete.png" alt="" />
                    <img src="@/assets/xiconPark-add.png" alt="" />
                  </div>
                  <!-- <el-button type="primary" icon="el-icon-plus" @click="addUser">添加</el-button>
                  <el-button type="danger" icon="el-icon-delete" @click="removeUser">删除</el-button> -->
                </header>
                <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                  <span v-for="(item, index) in form.users" v-bind:key="index">
                    <el-form-item
                      label="疾病名称:"
                      :rules="rules.medName"
                      :prop="'users.' + index + '.name'"
                      label-width="80px"
                    >
                      <el-input size="small" v-model="item.name" placeholder="请输入序号"> </el-input>
                    </el-form-item>
                    <el-form-item label="疾病描述:" :prop="'users.' + index + '.name'" label-width="80px">
                      <el-input size="small" v-model="item.name" placeholder="请输入序号"> </el-input>
                    </el-form-item>
                    <el-form-item label="确诊时间:" :prop="'users.' + index + '.name'" label-width="80px">
                      <el-input size="small" v-model="item.name" placeholder="请输入序号"> </el-input>
                    </el-form-item>
                    <el-form-item
                      label="关联资料:"
                      :rules="rules.fileIds"
                      :prop="'users.' + index + '.fileIds'"
                      label-width="80px"
                    >
                      <el-select v-model="item.fileIds" multiple placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </span>
                </el-form>
                <el-button type="primary" @click="submitForm('form')">提交</el-button>
              </div>
            </div>
          </el-scrollbar>
          <div style="height: 40px; background: #000"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableA from './table.vue'
import ImagePreview from './ImagePreview.vue'

export default {
  components: { ImagePreview, TableA },
  props: {
    seekDialogData: {
      type: Object,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogVisible: this.value,
      options: [],
      form: {
        users: [
          {
            icdId: '',
            medName: '',
            medDesc: '',
            confirmTime: '',
            fileIds: [],
          },
        ],
      },
      rules: {
        medName: [{ required: true, message: '请输入疾病名称', trigger: 'blur' }],
        fileIds: [{ required: true, message: '请选择关联资料', trigger: 'blur' }],
      },
    }
  },
  watch: {
    value(newValue) {
      this.dialogVisible = newValue
    },
    dialogVisible(newVisible) {
      this.$emit('input', newVisible)
    },
  },
  computed: {},
  mounted() {
    console.log(`this.seekDialogData`,this.seekDialogData)
  },
  methods: {
    addUser() {
      this.form.users.push({ name: '', age: '', gender: '' })
    },
    removeUser() {
      if (this.form.users.length > 1) {
        this.form.users.pop()
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!')
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.InformationExtractionDialog {
  // ::v-deep .el-dialog__body {
  //   height: 90vh;
  //   overflow-y: hidden;
  // }
  .abow_dialog {
    display: flex;
    justify-content: center;
    align-items: Center;
    overflow: hidden;
    ::v-deep .el-dialog {
      margin: 0 auto !important;
      height: 90%;
      // overflow: hidden;
    }
    ::v-deep .el-dialog__body {
      position: absolute;
      left: 0;
      top: 45px;
      bottom: 0;
      right: 0;
      padding: 10px;
      z-index: 1;
      overflow: hidden;
      overflow-y: auto;
      height: 100% !important;
    }
    .ie-dialog-header {
      display: flex;
      align-items: center;
      color: rgba(48, 49, 51, 1);
      font-size: 14px;
      .text {
        color: rgba(145, 145, 145, 1);
        font-size: 12px;
        margin-left: 12px;
      }
      &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 16px;
        background-color: #4469bd;
        margin-right: 10px;
      }
    }

    .ie-dialog-content {
      display: flex;
      height: 100%;
      .ImagePreview {
        height: 100%;
        flex: 1;
      }
      .form-entry {
        height: calc(100% - 45px);
        width: 500px;
        background-color: #f7f7f7;
        .form-main {
          padding: 10px;
          .form-card {
            background-color: #fff;
            padding: 10px;
            .form-card-header {
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              padding: 0 0 10px 0;
              border-bottom: 1px solid #ebeef5;
              .btn {
                position: absolute;
                right: 0;
                img {
                  width: 24px;
                }
              }
              // justify-content: space-between;
              // padding: 10px;
              // border-bottom: 1px solid #ebeef5;
              // font-size: 14px;
              // color: rgba(48, 49, 51, 1);
              // font-weight: 500;
            }
            // .el-form-item {
            //   margin-bottom: 0;
            //   margin-top: 0;
            //   padding: 0 10px;
            //   .el-form-item__label {
            //     font-size: 12px;
            //     color: rgba(48, 49, 51, 1);
            //   }
            //   .el-form-item__content {
            //     .el-input {
            //       width: 100%;
            //       height: 30px;
            //       font-size: 12px;
            //       color: rgba(48, 49, 51, 1);
            //       border: 1px solid #ebeef5;
            //       border-radius: 4px;
            //       padding: 0 10px;
            //     }
            //   }
            // }
            // .el-button {
            //   margin: 10px;
            // }
          }
        }
      }
    }
  }
}
</style>
