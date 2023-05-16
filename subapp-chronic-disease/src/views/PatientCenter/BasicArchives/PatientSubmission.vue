<!--
 * @Author: Nic
 * @Date: 2023-03-29 10:30:11
 * @LastEditTime: 2023-04-12 16:43:15
 * @LastEditors: Nic
 * @Description: PatientSubmission
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/PatientCenter/BasicArchives/PatientSubmission.vue
-->
<template>
  <div class="PatientSubmission">
    <header class="header">
      <div class="title">患者档案整理</div>
      <!-- <div>
          <el-button type="primary">提交</el-button>
        </div> -->
    </header>
    <main class="main">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <el-scrollbar style="height: 100%">
          <div class="card-main">
            <header class="header">
              <div class="title">
                <span>基本信息</span>
                <span class="date">{{ patBaseMes.submitDate }}</span>
              </div>
              <div class="icon">
                <img
                  v-if="patBaseMes.syncBtnFlg"
                  @click="onSynchronizeData(0)"
                  src="@/assets/outline-file-sync-true.png"
                  alt=""
                />
                <img v-else src="@/assets/outline-file-sync-false.png" alt="" />
              </div>
            </header>
            <div v-for="v in patBaseMes.desList" class="card-main-main">
              <div class="label">{{ v.label }}</div>
              <div class="value">{{ v.value }}</div>
            </div>
            <div class="ps-center" v-if="!patBaseMes.desList">
              <el-empty></el-empty>
            </div>
          </div>
          <div class="card-main">
            <header class="header">
              <div class="title">
                <span>个人情况</span>
                <span class="date">{{ patInfo.submitDate }}</span>
              </div>
              <div class="icon">
                <img
                  v-if="patInfo.syncBtnFlg"
                  @click="onSynchronizeData(1)"
                  src="@/assets/outline-file-sync-true.png"
                  alt=""
                />
                <img v-else src="@/assets/outline-file-sync-false.png" alt="" />
              </div>
            </header>
            <div v-for="v in patInfo.desList" class="card-main-main">
              <div class="label">{{ v.label }}</div>
              <div class="value">{{ v.value }}</div>
            </div>
            <div class="ps-center" v-if="!patInfo.desList">
              <el-empty></el-empty>
            </div>
          </div>
        </el-scrollbar>
      </el-card>
      <el-card class="box-card" style="height: 440px">
        <div slot="header" class="clearfix">
          <span>个人史&生活方式</span>
        </div>
        <div class="card-main">
          <header class="header">
            <div class="title">
              <span>个人史</span>
              <span class="date">{{ patFamilyDisease.submitDate }}</span>
            </div>
            <div class="icon">
              <img
                v-if="patFamilyDisease.syncBtnFlg"
                @click="onSynchronizeData(2)"
                src="@/assets/outline-file-sync-true.png"
                alt=""
              />
              <img v-else src="@/assets/outline-file-sync-false.png" alt="" />
            </div>
          </header>
          <div v-for="v in patFamilyDisease.desList" class="card-main-main">
            <div class="label">{{ v.label }}</div>
            <div class="value">{{ v.value }}</div>
          </div>
          <div class="ps-center" v-if="!patFamilyDisease.desList">
            <el-empty></el-empty>
          </div>
        </div>
        <div class="card-main">
          <header class="header">
            <div class="title">
              <span>生活方式</span>
              <span class="date">{{ patLife.submitDate }}</span>
            </div>
            <div class="icon">
              <img
                v-if="patLife.syncBtnFlg"
                @click="onSynchronizeData(3)"
                src="@/assets/outline-file-sync-true.png"
                alt=""
              />
              <img v-else src="@/assets/outline-file-sync-false.png" alt="" />
            </div>
          </header>
          <div v-for="v in patLife.desList" class="card-main-main">
            <div class="label">{{ v.label }}</div>
            <div class="value">{{ v.value }}</div>
          </div>
          <div class="ps-center" v-if="!patLife.desList">
            <el-empty></el-empty>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-select v-model="medicalRecordValue" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              {{ item.name }}
            </el-option>
          </el-select>
        </div>
        <el-scrollbar style="height: 100%">
          <div v-for="(item, index) in patPastHistorysList" :key="item.id + index + ''" class="text item">
            <div class="card-main">
              <header class="seekMedicalAttentionheader">
                <div class="icon">
                  <img src="@/assets/xiconPark-hourglass-null.png" alt="" v-if="item.syncBtnFlg" />
                  <img src="@/assets/xfarfa-check-circle.png" alt="" v-else />
                </div>
                <div class="title">
                  <span>{{ item.admType === 'I' ? '住院记录' : '门诊记录' }}</span>
                  <span class="date">{{ item.submitDate }}</span>
                </div>
              </header>
              <div v-for="v in item.desList" class="card-main-main">
                <div class="label">{{ v.label }}</div>
                <div class="value2" v-if="v.key === 'fileQty'" @click="onInformationExtraction(item)">
                  <div class="value2-title">可提取</div>
                  <div class="value2-text">{{ v.value }}张</div>
                  <div class="value2-icon">
                    <img src="@/assets/xmd-chevron_right Copy.png" alt="" />
                  </div>
                </div>
                <div class="value" v-else>{{ v.value }}</div>
              </div>
            </div>
          </div>
          <div class="card-main ps-center" v-if="patPastHistorysList.length === 0">
            <el-empty></el-empty>
          </div>
        </el-scrollbar>
      </el-card>
    </main>
    <!-- 同步 -->
    <ProDialog
      :visible.sync="syncDialogVisible"
      title="个人史同步对照"
      width="720px"
      :before-close="handleSyncResetClose"
      :close-on-click-modal="false"
      top="20vh"
    >
      <el-table :data="syncDialogData" height="400" border style="width: 100%">
        <el-table-column label="对照结果" width="80">
          <template slot-scope="scope">
            <img src="@/assets/xfarfa-check-circle.png" v-if="scope.row.isSame" style="width: 17px" />
            <img src="@/assets/xarcoDesign-close-circle.png" v-else style="width: 17px" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="对照内容" width="100"> </el-table-column>
        <el-table-column prop="oldValue" label="患者已确认数据" width="190"> </el-table-column>
        <el-table-column prop="newValue" label="换着新提交数据" width="190"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <div @click.prevent="tableOperation(scope.row)">
              <el-checkbox v-model="scope.row.checkbox" :disabled="scope.row.isSame"></el-checkbox>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <el-button @click="syncDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onConfirmSynchronization">确认同步</el-button>
      </template>
    </ProDialog>
    <!-- 就医记录 -->
    <InformationExtractionDialog  v-model="vagueSearchSelectDialogVisible" :seekDialogData="seekDialogData" />
    <!-- <ProDialog
    
      :visible.sync="seekDialogVisible"
      title="个人史同步对照"
      width="1000px"
      :before-close="handleSeekResetClose"
      :close-on-click-modal="false"
      style="margin-top: 5vh; width: 1000px"
    >
      <div>
        <pre>
           {{ seekDialogData }}
        </pre>
        <pre>
           {{ seekDialogData }}
        </pre>
        <pre>
           {{ seekDialogData }}
        </pre>
      </div>
      <template #footer>
        <el-button @click="seekDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onConfirmSeekhronization">确认同步</el-button>
      </template>
    </ProDialog> -->
  </div>
</template>

<script>
import { ProDialog } from 'anx-vue'
import InformationExtractionDialog from './InformationExtractionDialog.vue'
import {
  getPatSubmitMes,
  onCompareSyncData,
  onSyncPatData,
  getPatPastHistoryByIdForPC,
} from '@/api/modules/BasicArchives/index.js'
import { patBaseMap, patFamilyDiseaseMap, patLifeMap, patInfoMap, patPastHistorysMap } from './map'
export default {
  components: {
    ProDialog,
    InformationExtractionDialog,
  },
  data() {
    return {
      vagueSearchSelectDialogVisible: false,
      options: [
        {
          value: '1',
          label: '就医记录-全部',
          name: '全部',
        },
        {
          value: '2',
          label: '就医记录-待处理',
          name: '待处理',
        },
        {
          value: '3',
          label: '就医记录-已同步',
          name: '已同步',
        },
      ],
      medicalRecordValue: '1',
      patBaseMes: {},
      patFamilyDisease: {},
      patInfo: {},
      patLife: {},
      patPastHistorysList: [],
      // 对比同步
      syncDialogVisible: false,
      syncDialogData: [],
      seekDialogVisible: false,
      seekDialogData: {},
      tempSelecteds: [],
      tempType: 0,
    }
  },
  created() {
    this.getPatSubmitMes()
  },
  methods: {
    // 就医记录
    async onInformationExtraction(row) {
      console.log(`row`, row)
      this.seekDialogVisible = true
      try {
        const res = await getPatPastHistoryByIdForPC({
          id: row.id,
          fileBaseUrl: window.g.VUE_APP_FILE_API,
        })
        this.seekDialogData = res.result
        this.vagueSearchSelectDialogVisible = true
      } catch (error) {
        console.log(`error`, error)
      }
    },
    // 确认同步就医记录
    onConfirmSeekhronization() {},
    // 确认同步
    async onConfirmSynchronization() {
      try {
        const res = await onSyncPatData({
          patId: this.$route.query.patId,
          syncFields: this.tempSelecteds.map((el) => el.syncField),
          syncFlg: 0,
          type: this.tempType,
        })
        this.syncDialogVisible = false
        this.$message.success('同步成功')
        this.getPatSubmitMes()
      } catch (error) {
        console.log(`error`, error)
      }
    },
    // 表格操作
    tableOperation(row) {
      console.log(`row`, row)
      row.checkbox = !row.checkbox
      if (row.checkbox) {
        this.tempSelecteds.push(row)
      } else {
        this.tempSelecteds = this.tempSelecteds.filter((el) => el.id !== row.id)
      }
      console.log(`this.tempSelecteds`, this.tempSelecteds)
    },
    // 获取同步数据
    async onSynchronizeData(type) {
      try {
        this.tempType = type
        const res = await onCompareSyncData({
          patId: this.$route.query.patId,
          type,
        })
        this.syncDialogData = res.result.map((el) => {
          return {
            ...el,
            checkbox: false,
          }
        })
        this.syncDialogVisible = true
      } catch (error) {
        console.log(`error`, error)
      }
    },
    // 关闭同步弹窗
    handleSyncResetClose() {
      this.syncDialogVisible = false
      this.syncDialogData = []
      this.tempSelecteds = []
      this.tempType = 0
    },
    handleSeekResetClose() {
      this.seekDialogVisible = false
    },
    // 获取患者提交信息
    async getPatSubmitMes() {
      try {
        const res = await getPatSubmitMes({
          patId: this.$route.query.patId,
          type: '',
          // 就医记录同步状态 : unFinish - 待处理，finish - 已同步
          syncStatus: 'unFinish',
        })

        this.patBaseMes = this.formatData(res.result.patBaseMes, patBaseMap)
        this.patFamilyDisease = this.formatData(res.result.patFamilyDisease, patFamilyDiseaseMap)
        this.patLife = this.formatData(res.result.patLife, patLifeMap)
        this.patInfo = this.formatData(res.result.patInfo, patInfoMap)
        this.patPastHistorysList = res.result.patPastHistorys.map((el) =>
          this.formatData(el, patPastHistorysMap, 'patPastHistorysList'),
        )
        console.log(`this.patPastHistorysList`, JSON.parse(JSON.stringify(this.patPastHistorysList)))
      } catch (error) {
        console.log(`error`, error)
      }
    },
    // 格式化数据
    formatData(data, patBaseMap, type) {
      // 判断data 是否为null 或者 undefined 或者 length === 0
      if (!data) {
        return {}
      }
      let result = {
        id: data.id ? data.id : '',
        syncBtnFlg: data.syncBtnFlg,
        submitDate: data.submitDate,
        admType: data.admType,
        quickUpload: data.quickUpload,
        fileQty: data.fileQty,
        desList: [],
      }
      for (let key in patBaseMap) {
        // 如果 data[key] === '' 则不push
        if (type === 'patPastHistorysList' && data[key] === '') {
          continue
        }
        result.desList.push({
          key,
          label: patBaseMap[key],
          value: data[key],
        })
      }
      return result
    },
  },
}
</script>

<style lang="scss" scoped>
.PatientSubmission {
  background: #fff;
  height: calc(100% - 50px);
  .header {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // header 左侧画一个宽度4px 高度16px 的竖线
    .title {
      color: rgba(48, 49, 51, 1);
      font-size: 14px;
      display: flex;
      align-items: center;
      font-weight: 500;
    }
    .title::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 20px;
      margin-right: 8px;
      border-radius: 1px;
      background-color: rgba(68, 105, 189, 1);
    }
    .icon {
      width: 18px;
      margin-right: 5px;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .seekMedicalAttentionheader {
    padding: 0 0 10px 0;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    // header 左侧画一个宽度4px 高度16px 的竖线
    .title {
      color: rgba(48, 49, 51, 1);
      font-size: 14px;
      display: flex;
      align-items: center;
      font-weight: 500;
    }
    .icon {
      display: flex;
      align-items: center;
      width: 18px;
      margin-right: 5px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .main {
    display: flex;
    padding: 0 15px;
    height: calc(100% - 55px);
    .box-card + .box-card {
      margin-left: 20px;
    }
    .box-card {
      padding: 0;
      width: 380px;
      background: #f5f5f5;
      height: 100%;
      ::v-deep .el-card__body {
        padding: 0px;
        height: calc(100% - 30px);
        overflow: auto;
      }
      ::v-deep .el-card__header {
        padding: 10px 20px;
        border-bottom: 1px solid #ebeef5;
        box-sizing: border-box;
      }
      ::v-deep .el-input__inner {
        width: 130px;
        // 清除边框
        border: none;
        height: 23px;
        line-height: 23px;
        padding-left: 0;
        background: #f5f5f5;
      }
      ::v-deep .el-input__suffix {
        position: absolute;
        height: 100%;
        right: 5px;
        top: 5px;
        text-align: center;
        color: #c0c4cc;
        transition: all 0.3s;
        pointer-events: none;
      }
      .card-main {
        margin: 10px 10px 15px 10px;
        padding: 10px 10px 0 10px;
        background: #fff;
        border-radius: 4px;
        .header {
          padding: 0;
          color: rgba(51, 51, 51, 1);
          font-size: 14px;
          .title {
            font-weight: 400;
          }
          .title::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 16px;
            margin-right: 8px;
            border-radius: 1px;
            background-color: rgba(68, 105, 189, 1);
          }
          .date {
            padding-left: 10px;
            color: rgba(145, 145, 145, 1);
            font-size: 12px;
          }
        }
      }
      .card-main-main {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(243, 243, 245, 1);
        height: 48px;
        line-height: 48px;
        padding: 0 10px;
        .label {
          color: rgba(145, 145, 145, 1);
          font-size: 14px;
          min-width: 110px;
        }
        .value {
          color: rgba(51, 51, 51, 1);
          font-size: 14px;
          // 超过一行显示省略号
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .value2 {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          cursor: pointer;
          .value2-title {
            border-radius: 17px;
            background-color: rgba(238, 242, 253, 1);
            color: rgba(68, 104, 189, 1);
            font-size: 11px;
            height: 22px;
            line-height: 22px;
            padding: 0 4px;
            margin-right: 5px;
          }
          .value2-text {
            color: rgba(51, 51, 51, 1);
            font-size: 14px;
          }
          .value2-icon {
            width: 20px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          // color: rgba(51, 51, 51, 1);
          // font-size: 14px;
          // // 超过一行显示省略号
          // overflow: hidden;
          // text-overflow: ellipsis;
          // white-space: nowrap;
        }
      }
      // 最后一个card-main-main不加下边框
      .card-main-main:last-child {
        border-bottom: none;
      }
    }
  }
  .ps-center {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20px;
    height: 100%;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    padding: 10px !important;
  }

  ::v-deep .ProDialog .title:before {
    left: -10px;
  }
  ::v-deep .el-dialog__headerbtn {
    top: 12px !important;
  }
}
</style>
