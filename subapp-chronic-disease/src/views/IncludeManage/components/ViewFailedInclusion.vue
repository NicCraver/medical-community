<template>
  <div class="ViewFailedInclusion">
    <main class="vfi-main">
      <header class="vfi-header">
        <div class="line"></div>
        <div class="title">{{ isOne ? '单条纳入' : '查看' }}</div>
        <div style="margin-top: 5px">
          <IconSvg :iconClass="isOne ? 'hint-r' : 'prompt'" width="16" style="" />
        </div>
        <div class="text" :style="{ color: isOne ? '#FC6D64' : '#5E84D7' }">该患者已建档，将不予进行2次纳入</div>
      </header>
      <div class="vfi-body">
        <div style="padding: 10px">
          <div style="font-size: 14px; color: #303133">诊断：{{ checkTempData.diagnosesStr }}</div>
          <div style="display: flex; justify-content: space-between; align-items: center"></div>
          <div class="tab-list">
            <div :class="['tab-item', { active: activeTab === 'phone' }, { no: len === 0 }]" @click="activeTabChange('phone')">手机号</div>
            <div
              :class="['tab-item', { active: activeTab === 'identityCard' }, { no: len2 === 0 }]"
              @click="activeTabChange('identityCard')"
            >
              身份证号
            </div>
          </div>
        </div>
        <div v-if="activeTab === 'phone'">
          <transition name="el-fade-in-linear">
            <div class="container" v-show="activeTab === 'phone'">
              <div class="essentialInformation">
                <div>基本信息</div>
                <div
                  style="font-size: 14px; color: #fba751; font-weight: bold"
                  v-if="Object.keys(checkTempData).length !== 0 && checkTempData.phoneOutlierData.length !== 0"
                >
                  {{ len }}个对照异常点，请确认
                </div>
              </div>
              <div style="padding: 10px">
                <el-form label-width="90px">
                  <template v-for="(v, index) in checkTempData.phoneOutlierData">
                    <el-form-item :label="v.desc + ':'" v-if="v.desc === '身份证号' || v.desc === '联系电话'">
                      <div style="display: flex; align-items: center">
                        <input
                          class="input"
                          type="text"
                          v-model="v.value"
                          readonly
                          :style="{
                            backgroundColor:
                              v.desc === '联系电话' ? '#F7D1CD' : v.outlierFlg && v.desc === '身份证号' ? '#FFEBD7' : '#f5f5f5',
                            paddingLeft: '5px',
                          }"
                        />
                        <div style="" v-if="v.desc === '联系电话'" style="margin: 5px 0 0 10px">该号已建档</div>
                        <IconSvg v-if="v.outlierFlg && v.desc === '身份证号'" iconClass="hint-y" width="16" style="margin: 5px 0 0 10px" />
                      </div>
                    </el-form-item>
                    <el-form-item
                      :label="v.desc + ':'"
                      v-else-if="index !== checkTempData.phoneOutlierData.length - 1 && v.desc !== '身份证号' && v.desc !== '联系电话'"
                    >
                      <div style="display: flex; align-items: center">
                        <input
                          class="input"
                          type="text"
                          v-model="v.value"
                          readonly
                          :style="{
                            backgroundColor: v.outlierFlg ? '#FFEBD7' : '#f5f5f5',
                            paddingLeft: '5px',
                          }"
                        />
                        <IconSvg v-if="v.outlierFlg" iconClass="hint-y" width="16" style="margin: 5px 0 0 10px" />
                      </div>
                    </el-form-item>
                    <el-form-item :label="v.desc + ':'" v-else>
                      <div style="display: flex; align-items: center">
                        <input
                          class="input"
                          type="textarea"
                          v-model="v.value"
                          readonly
                          :style="{
                            backgroundColor: v.outlierFlg ? '#FFEBD7' : '#f5f5f5',
                            paddingLeft: '5px',
                            height: '120px',
                          }"
                        />
                        <IconSvg v-if="v.outlierFlg" iconClass="hint-y" width="16" style="margin: 5px 0 0 10px" />
                      </div>
                    </el-form-item>
                  </template>
                </el-form>
              </div>
            </div>
          </transition>
        </div>
        <div v-else>
          <transition name="el-fade-in-linear">
            <div class="container" v-show="activeTab === 'identityCard'">
              <div class="essentialInformation">
                <div>基本信息</div>
                <div
                  style="font-size: 14px; color: #fba751; font-weight: bold"
                  v-if="Object.keys(checkTempData).length !== 0 && checkTempData.idNoOutlierData.length !== 0"
                >
                  {{ len2 }}个对照异常点，请确认
                </div>
              </div>

              <div style="padding: 10px">
                <el-form label-width="90px">
                  <template v-for="(v, index) in checkTempData.idNoOutlierData">
                    <el-form-item :label="v.desc + ':'" v-if="v.desc === '身份证号' || v.desc === '联系电话'">
                      <div style="display: flex; align-items: center">
                        <input
                          class="input"
                          type="text"
                          v-model="v.value"
                          readonly
                          :style="{
                            backgroundColor:
                              v.desc === '身份证号' ? '#F7D1CD' : v.outlierFlg && v.desc === '联系电话' ? '#FFEBD7' : '#f5f5f5',
                            paddingLeft: '5px',
                          }"
                        />
                        <span v-if="v.desc === '身份证号'" style="margin: 5px 0 0 10px">该号已建档</span>
                        <IconSvg v-if="v.outlierFlg && v.desc === '联系电话'" iconClass="hint-y" width="16" style="margin: 5px 0 0 10px" />
                      </div>
                    </el-form-item>
                    <el-form-item
                      :label="v.desc + ':'"
                      v-else-if="index !== checkTempData.idNoOutlierData.length - 1 && v.desc !== '身份证号' && v.desc !== '联系电话'"
                    >
                      <div style="display: flex; align-items: center">
                        <input
                          class="input"
                          type="text"
                          v-model="v.value"
                          readonly
                          :style="{
                            backgroundColor: v.outlierFlg ? '#FFEBD7' : '#f5f5f5',
                            paddingLeft: '5px',
                          }"
                        />
                        <IconSvg v-if="v.outlierFlg" iconClass="hint-y" width="16" style="margin: 5px 0 0 10px" />
                      </div>
                    </el-form-item>
                    <el-form-item :label="v.desc + ':'" v-else>
                      <div style="display: flex; align-items: center">
                        <input
                          class="input"
                          type="textarea"
                          v-model="v.value"
                          readonly
                          :style="{
                            backgroundColor: v.outlierFlg ? '#FFEBD7' : '#f5f5f5',
                            paddingLeft: '5px',
                            height: '120px',
                          }"
                        />
                        <IconSvg v-if="v.outlierFlg" iconClass="hint-y" width="16" style="margin: 5px 0 0 10px" />
                      </div>
                    </el-form-item>
                  </template>
                </el-form>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  props: {
    checkTempData: {
      type: Object,
    },
    isOne: {
      type: Boolean,
    },
  },
  computed: {
    len() {
      let len = 0;
      if (this.checkTempData && this.checkTempData.phoneOutlierData) {
        this.checkTempData.phoneOutlierData.forEach((el) => {
          if (el.outlierFlg) {
            len++;
          }
        });
      }
      return len;
    },
    len2() {
      let len = 0;
      if (this.checkTempData && this.checkTempData.idNoOutlierData) {
        this.checkTempData.idNoOutlierData.forEach((el) => {
          if (el.outlierFlg) {
            len++;
          }
        });
      }
      return len;
    },
  },
  data() {
    return {
      activeTab: 'phone',
      form: {},
    };
  },
  watch: {
    checkTempData: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (Object.keys(newValue).length !== 0) {
          if (this.checkTempData.phoneOutlierData.length !== 0) {
            this.activeTab = 'phone';
          } else if (this.checkTempData.idNoOutlierData.length !== 0) {
            this.activeTab = 'identityCard';
          } else {
            this.activeTab = 'phone';
          }
        }
      },
    },
  },
  methods: {
    activeTabChange(val) {
      if (val === 'phone') {
        if (this.checkTempData.phoneOutlierData.length !== 0) {
          this.activeTab = val;
        }
      } else {
        if (this.checkTempData.idNoOutlierData.length !== 0) {
          this.activeTab = val;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ViewFailedInclusion {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .vfi-main {
    // display: flex;
    .vfi-header {
      display: flex;
      height: 48px;
      // line-height: 48px;
      align-items: center;
      border-bottom: 1px solid #e9e9e9;
      .line {
        width: 3px;
        height: 16px;
        border-radius: 1px;
        background-color: rgba(19, 71, 150, 100);
      }
      .title {
        font-size: 16px;
        font-weight: bold;
        margin-left: 10px;
        margin-right: 15px;
      }
      .text {
        margin-top: 4px;
        font-size: 12px;
        margin-left: 2px;
      }
    }
    .vfi-body {
      // padding: 20px 12px;
      .el-input {
        width: 300px;
      }
      .el-textarea {
        width: 300px;
      }
      .input {
        margin-top: 5px;
        height: 32px;
        width: 300px;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
      }
      .tab-list {
        width: 260px;
        margin: 20px auto;
        background-color: #f7f7f7;
        border-radius: 130px;
        line-height: 40px;
        font-size: 14px;
        display: flex;
        margin-bottom: 20px;
        .tab-item {
          width: 130px;
          color: #333333;
          text-align: center;
          cursor: pointer;
          &.active {
            background-color: #4469bd;
            color: #fff;
            border-radius: 130px;
          }
          &.no {
            cursor: not-allowed;
          }
        }
      }
      .essentialInformation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f5f5f5;
        font-size: 14px;
        color: #111111;
        font-weight: bold;
        // margin: 20px 10px;
        height: 40px;
        padding: 0 10px;
      }
    }
  }
  .vfi-footer {
    border-top: 1px solid #e9e9e9;
    text-align: right;
    height: 55px;
    line-height: 55px;
    padding-right: 10px;
  }
}
</style>
