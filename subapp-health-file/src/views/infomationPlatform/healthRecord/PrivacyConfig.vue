<!--
  @description 健康档案共享调阅-系统配置-隐私配置
  @date 2022/1/13
-->

<template>
  <div class="privacy-config">
    <ProLayout mainBgColor="#F5F5F5" padding="0" margin="10">
      <template #title>隐私配置</template>
      <template #main>
        <el-card>
          <div class="form" v-loading="loading">
            <el-scrollbar>
              <el-alert
                title="访问权限（居民Web端安全控制）"
                type="info"
                :closable="false"
              ></el-alert>
              <el-row>
                <el-checkbox
                  v-model="data.passwordAccess"
                  true-label="1"
                  false-label="0"
                  >备选项</el-checkbox
                >
              </el-row>
              <el-row>
                <el-col :span="5">
                  <el-checkbox
                    v-model="data.sendMessage"
                    true-label="1"
                    false-label="0"
                    >发送访问验证码短信</el-checkbox
                  >
                </el-col>
                <el-col :offset="1" :span="16">
                  <span>免接收验证码用户名单</span>
                  <el-select
                    v-model="data.unSendMessageUsers"
                    multiple
                    clearable
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入用户姓名/证件编号"
                    :remote-method="remoteMethod"
                    :loading="userLoading"
                    :disabled="data.sendMessage == '0'"
                  >
                    <el-option
                      v-for="item in sendMessageData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-alert
                title="居民隐私"
                type="info"
                :closable="false"
              ></el-alert>
              <el-row class="privacy">
                <el-col :span="7">
                  <el-checkbox
                    v-model="data.namePrivacyEnable"
                    true-label="1"
                    false-label="0"
                    >居民姓名隐私</el-checkbox
                  >
                  <el-select
                    v-model="data.namePrivacy"
                    placeholder="请选择"
                    :disabled="data.namePrivacyEnable == '0'"
                  >
                    <el-option
                      v-for="item in namePrivacyData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="7" :offset="2">
                  <el-checkbox
                    v-model="data.idPrivacyEnable"
                    true-label="1"
                    false-label="0"
                    >身份证号码隐私</el-checkbox
                  >
                  <el-select
                    v-model="data.idPrivacy"
                    placeholder="请选择"
                    :disabled="data.idPrivacyEnable == '0'"
                  >
                    <el-option
                      v-for="item in idPrivacyData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row class="privacy">
                <el-col :span="7">
                  <el-checkbox
                    v-model="data.telPrivacyEnable"
                    true-label="1"
                    false-label="0"
                    >联系电话隐私</el-checkbox
                  >
                  <el-select
                    v-model="data.telPrivacy"
                    placeholder="请选择"
                    :disabled="data.telPrivacyEnable == '0'"
                  >
                    <el-option
                      v-for="item in telPrivacyData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="7" :offset="2">
                  <el-checkbox
                    v-model="data.addPrivacyEnable"
                    true-label="1"
                    false-label="0"
                    >居住地址隐私</el-checkbox
                  >
                  <el-select
                    v-model="data.addPrivacy"
                    placeholder="请选择"
                    :disabled="data.addPrivacyEnable == '0'"
                  >
                    <el-option
                      v-for="item in addPrivacyData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-alert
                title="医生隐私"
                type="info"
                :closable="false"
              ></el-alert>
              <el-row class="privacy">
                <el-col :span="7">
                  <el-checkbox
                    v-model="data.doctorNamePrivacyEnable"
                    true-label="1"
                    false-label="0"
                    >医生姓名隐私</el-checkbox
                  >
                  <el-select
                    v-model="data.doctorNamePrivacy"
                    placeholder="请选择"
                    :disabled="data.doctorNamePrivacyEnable == '0'"
                  >
                    <el-option
                      v-for="item in namePrivacyData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="7" :offset="2">
                  <el-checkbox
                    v-model="data.doctorIdPrivacyEnable"
                    true-label="1"
                    false-label="0"
                    >身份证号码隐私</el-checkbox
                  >
                  <el-select
                    v-model="data.doctorIdPrivacy"
                    placeholder="请选择"
                    :disabled="data.doctorIdPrivacyEnable == '0'"
                  >
                    <el-option
                      v-for="item in idPrivacyData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-alert
                title="疾病隐私"
                type="info"
                :closable="false"
              ></el-alert>
              <el-row class="privacy">
                <el-col :span="22">
                  <el-checkbox
                    v-model="data.illPrivacyEnable"
                    true-label="1"
                    false-label="0"
                    >隐私疾病名称</el-checkbox
                  >
                  <el-select
                    v-model="data.illPrivacies"
                    multiple
                    clearable
                    placeholder="请选择"
                    :disabled="data.illPrivacyEnable == '0'"
                  >
                    <el-option
                      v-for="item in $store.state.base.healthRecordData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-radio
                    v-model="data.illPrivacyType"
                    label="1"
                    :disabled="data.illPrivacyEnable == '0'"
                    >不展示隐私疾病就诊记录</el-radio
                  >
                </el-col>
                <el-col :span="6">
                  <el-radio
                    v-model="data.illPrivacyType"
                    label="2"
                    :disabled="data.illPrivacyEnable == '0'"
                    >不展示隐私疾病就诊记录和既往史</el-radio
                  >
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
          <el-row class="actions">
            <el-button plain @click="getConfig">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </el-row>
        </el-card>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from "anx-vue";
import {
  getPrivacyConfig,
  savePrivacyConfig,
  getResidentList,
} from "api/infomationPlatform/healthRecord.js";

export default {
  components: { ProLayout },
  data() {
    return {
      data: {
        passwordAccess: "1", //密码访问
        sendMessage: "1", //发送访问验证码短信
        unSendMessageUsers: [], //免接收验证码用户名单
        namePrivacyEnable: "1", //居民姓名隐私
        namePrivacy: "",
        idPrivacyEnable: "1", //身份证号码隐私
        idPrivacy: "",
        telPrivacyEnable: "1", //联系电话隐私
        telPrivacy: "",
        addPrivacyEnable: "1", //居住地址隐私
        addPrivacy: "",
        doctorNamePrivacyEnable: "1", //医生姓名隐私
        doctorNamePrivacy: "",
        doctorIdPrivacyEnable: "1", //医生身份证号码隐私
        doctorIdPrivacy: "",
        illPrivacyEnable: "1", //隐私疾病名称
        illPrivacies: [],
        illPrivacyType: "1",
      },
      sendMessageData: [], //免接收验证码用户名单下拉
      namePrivacyData: [
        { value: "1", label: "隐藏第1个字" },
        { value: "2", label: "隐藏第2个字" },
        { value: "3", label: "隐藏第2个及以后的字" },
      ], //居民姓名隐私下拉
      idPrivacyData: [
        { value: "1", label: "隐藏后4位" },
        { value: "2", label: "隐藏8-15位" },
      ], //身份证号码隐私下拉
      telPrivacyData: [
        { value: "1", label: "隐藏后4位" },
        { value: "2", label: "隐藏后8位" },
      ], //联系电话隐私下拉
      addPrivacyData: [
        { value: "1", label: "隐藏全部" },
        { value: "2", label: "隐藏区及以后" },
        { value: "3", label: "隐藏乡镇/街道及以后" },
      ], //居住地址隐私下拉
      doctorNamePrivacyData: [], //医生姓名隐私下拉
      doctorIdPrivacyData: [], //医生身份证号码隐私下拉
      illPrivacyData: [], //隐私疾病名称下拉
      loading: false,
      userLoading: false,
    };
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    // 获取隐私配置
    getConfig(change = false) {
      this.loading = true;
      getPrivacyConfig()
        .then((res) => {
          let result = res.result;
          result.illPrivacies = JSON.parse(result.illPrivacies);
          result.unSendMessageUsers = JSON.parse(result.unSendMessageUsers);
          this.data = result;
          this.loading = false;
          if (change) {
            this.$store.commit("base/SET_PRIVACY_CONFIG", result);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 保存
    save() {
      savePrivacyConfig(this.data).then((res) => {
        this.$message.success("保存成功");
        this.getConfig(true);
      });
    },
    // 免接收验证码用户名单-远程搜索
    remoteMethod(query) {
      if (query !== "") {
        this.userLoading = true;
        getResidentList({ keyword: query })
          .then((res) => {
            let data = res.result.records;
            this.sendMessageData = data.map((item) => {
              return {
                value: item.name,
                label: item.name,
              };
            });
            this.userLoading = false;
          })
          .catch(() => {
            this.userLoading = false;
          });
      } else {
        this.sendMessageData = [];
      }
    },
  },
};
</script>

<style src="@/assets/css/infomationPlatform.css" scoped></style>
<style lang="scss" scoped>
.privacy-config {
  height: 100%;
  .el-card {
    height: 100%;
    padding: 10px;
    .form {
      height: calc(100% - 42px);
      .el-alert {
        color: #101010;
        margin-bottom: 16px;
        ::v-deep .el-alert__title {
          font-size: 14px;
        }
        &:not(:first-child) {
          margin-top: 16px;
        }
      }
      .el-row {
        height: 32px;
        line-height: 32px;
        margin-bottom: 16px;
        padding: 0 10px;
        span {
          float: left;
          margin-right: 10px;
        }
        .el-checkbox {
          float: left;
          color: #303133;
        }
        .el-select {
          display: flex;
          margin-bottom: 10px;
          ::v-deep .el-select__tags {
            max-height: 62px;
            overflow: auto;
          }
        }
      }
      .privacy {
        .el-checkbox {
          width: 130px;
        }
      }
    }
    .actions {
      margin-top: 10px;
      .el-button {
        float: right;
        margin-left: 10px;
      }
    }
  }
}
</style>