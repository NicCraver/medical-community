<!-- 
  @description 服务资源-服务管理-查看
  @date 2022/1/26
 -->
<template>
  <div class="service-manage-show">
    <div class="protitle">{{protitle}}</div>
    <div class="promain">
      <el-card>
        <el-form ref="form" :model="form" size="small" label-width="80px">
          <el-scrollbar>
            <div style="padding: 0 10px">
              <el-alert title="基本信息" type="info" :closable="false"></el-alert>
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="所属目录" prop="belongDirec">
                    <el-input v-model="form.belongDirec" readonly></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="发布机构" prop="publishOrg">
                    <el-input v-model="form.publishOrg" readonly></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="服务来源" prop="serviceSource">
                    <el-input v-model="form.serviceSource" readonly></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="服务名称" prop="serviceName">
                    <el-input v-model="form.serviceName" readonly></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="服务说明" prop="serviceExplain">
                    <el-input v-model="form.serviceExplain" readonly></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="有效日期" prop="effectiveData">
                    <el-date-picker v-model="form.effectiveData" type="daterange" range-separator="至" value-format="yyyy-MM-dd" readonly></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="服务编码" prop="serviceCode">
                    <el-input v-model="form.serviceCode" readonly></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-alert title="请求信息" type="info" :closable="false"></el-alert>
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="发布服务" prop="publishService">
                    <el-input v-model="form.publishService" readonly></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="发布地址" prop="publishPath">
                    <el-input v-model="form.publishPath" readonly></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="返回格式" prop="returnFormat">
                    <el-input v-model="form.returnFormat" readonly></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="请求方式" prop="agreementSubType">
                    <el-input v-model="form.agreementSubType" readonly></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="table-title">
                <span>请求参数</span>
              </el-row>
              <el-table ref="requestParam" size="small" :data="requestParamData" border max-height="250">
                <el-table-column label="名称" prop="parameterName"></el-table-column>
                <el-table-column label="必填">
                  <template slot-scope="{ row }">{{ row.parameterRequire == 'Y' ? '必填':'非必填' }}</template>
                </el-table-column>
                <el-table-column label="类型">
                  <template slot-scope="{ row }">{{getType(row.parameterType)}}</template>
                </el-table-column>
                <el-table-column label="说明" min-width="200" prop="parameterDesc"></el-table-column>
              </el-table>
              <el-row class="table-title" style="margin-top:10px;">
                <span>返回参数</span>
              </el-row>
              <el-table ref="returnParam" size="small" max-height="250" row-key="id" :data="returnParamData" :tree-props="{children: 'childFields'}" border>
                <el-table-column label="名称" prop="fieldName"></el-table-column>
                <el-table-column label="必填">
                  <template slot-scope="{ row }">{{ row.fieldRequire == 'Y' ? '必填':'非必填' }}</template>
                </el-table-column>
                <el-table-column label="类型">
                  <template slot-scope="{ row }">{{getType(row.fieldType)}}</template>
                </el-table-column>
                <el-table-column label="说明" min-width="200" prop="fieldDesc"></el-table-column>
              </el-table>
              <el-form-item label="返回示例" prop="returnExample" style="margin: 10px 0 0 0">
                <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" v-model="form.returnExample" readonly></el-input>
              </el-form-item>
            </div>
          </el-scrollbar>
        </el-form>
        <footer class="actions">
          <el-button size="small" type="text" @click="showEmpower" v-show="params.from == 'empower'">授权</el-button>
          <el-button size="small" class="back-btn" @click="back">返回</el-button>
        </footer>
      </el-card>
    </div>
    <!-- 授权抽屉 -->
    <template v-if="empowerDrawer">
      <empower :visible.sync="empowerDrawer" title="授权" direction="rtl" size="520px" :before-close="handleClose" :editData="form" @closeFuc="handleClose"></empower>
    </template>
  </div>
</template>

<script>
import empower from "../components/ServiceEmpower/empower.vue";
import {
  getServiceDetail,
  getResponseTypes,
  getRequestMethods,
  getParamTypes,
} from "api/serviceResource";

export default {
  components: { empower },
  data() {
    return {
      params: {},
      form: {
        belongDirec: "", //所属目录
        publishOrg: "", //发布机构
        serviceSource: "", //服务来源
        serviceName: "", //服务名称
        serviceExplain: "", //服务说明
        effectiveData: [], //有效日期
        serviceCode: "", //服务编码
        publishPath: "", //发布地址
        returnFormat: "", //返回格式
        agreementSubType: "", //请求方式
        returnExampleType: "", //返回示例类型
        returnExample: "", //返回示例
      },
      // catalogData: [], //所属目录下拉
      returnFormatData: [], //返回格式下拉
      requestMethodData: [], //请求方式下拉
      requestParamData: [], //请求参数
      typeData: [], //类型下拉
      returnParamData: [], //返回参数
      // 授权
      empowerDrawer: false,
      protitle: "查看",
    };
  },
  computed: {
    proEnv() {
      return window.g.VUE_APP_ENVIRONMENT;
    },
  },
  mounted() {
    // 获取返回格式下拉
    getResponseTypes().then((res) => {
      this.returnFormatData = res.result;
    });
    // 获取请求方式下拉
    getRequestMethods({ partentId: "1" }).then((res) => {
      this.requestMethodData = res.result;
    });
    // 获取请求参数类型下拉
    getParamTypes().then((res) => {
      this.typeData = res.result;
    });

    this.params = this.$route.params;
    if (this.params.from == "empower") {
      this.protitle = "服务详情";
    } else {
      this.protitle = "查看";
    }
    getServiceDetail({ id: this.params.id }).then((res) => {
      let row = res.result;
      row.serviceSource = row.serviceSource == 1 ? "内部开发" : "第三方提供";
      row.effectiveData =
        row.startTime == null ? [] : [row.startTime, row.endTime];
      if (row.returnFormat !== "") {
        let returnFormatArr = JSON.parse(row.returnFormat);
        row.returnFormat = returnFormatArr
          .map((item) => this.getResponseType(item))
          .join(",");
      }
      row.agreementSubType = row.agreementSubType
        ? this.getRequestMethod(row.agreementSubType.toString())
        : "";
      this.form = row;
      this.requestParamData = row.params;
      this.returnParamData = row.result;
    });
  },
  methods: {
    // 返回
    back() {
      this.$refs.form.resetFields();
      if (this.params.from == "manage") {
        this.$router.push({ name: "serviceManage" });
      } else if (this.params.from == "overview") {
        this.$router.push({ name: "overview" });
      } else if (this.params.from == "empower") {
        this.$router.push({ name: "serviceEmpower" });
      }
    },
    getType(val) {
      return this.typeData.find((item) => item.id == val)?.name;
    },
    getRequestMethod(val) {
      return this.requestMethodData.find((item) => item.id == val)?.name;
    },
    getResponseType(val) {
      return this.returnFormatData.find((item) => item.id == val)?.name;
    },
    // 授权抽屉
    showEmpower() {
      this.empowerDrawer = true;
    },
    handleClose() {
      this.empowerDrawer = false;
    },
  },
};
</script>

<style lang="less" scoped>
.service-manage-show {
  height: 100%;
}
.el-card {
  height: 100%;
  width: 100%;
  ::v-deep .el-card__body {
    padding: 10px 0;
  }
  .el-form {
    height: calc(100% - 42px);
    .el-form-item {
      margin-bottom: 16px;
    }
    .el-alert {
      color: #101010;
      margin-bottom: 10px;
    }
    .el-select,
    .el-date-editor {
      width: 100%;
    }
    .table-title {
      height: 32px;
      line-height: 32px;
      span {
        display: inline-block;
        color: #606266;
        width: 68px;
        text-align: right;
        margin-right: 10px;
      }
    }
  }
  footer {
    margin-top: 10px;
    .el-button {
      float: left;
    }
    .back-btn {
      float: right;
      margin: 0 10px;
    }
  }
}
</style>