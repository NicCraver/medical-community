<!-- 
  @description 服务资源-服务管理-新增/编辑
  @date 2022/1/26
 -->
<template>
  <div class="service-manage-add">
    <div class="protitle">{{params.title}}</div>
    <div class="promain">
      <el-card>
        <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" size="small" label-width="80px" v-loading="loading">
          <el-scrollbar>
            <div style="padding: 0 10px">
              <el-alert title="基本信息" type="info" :closable="false"></el-alert>
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="所属目录" prop="belongDirecId">
                    <el-cascader ref="belongDir" placeholder="请选择" v-model="form.belongDirecId" :options="catalogData" :props="cascaderProps" clearable @change="changeFuc">
                      <div slot="empty">无数据</div>
                    </el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="发布机构" prop="publishOrg">
                    <el-input v-model="form.publishOrg" @change="changeFuc"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="服务来源" prop="serviceSource">
                    <el-select placeholder="请选择" v-model="form.serviceSource" clearable @change="serviceSourceChange">
                      <el-option :value="1" label="内部开发"></el-option>
                      <el-option :value="2" label="第三方提供"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="服务名称" prop="serviceName">
                    <el-input v-model="form.serviceName" @change="changeFuc"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="服务说明" prop="serviceExplain">
                    <el-input v-model="form.serviceExplain" @change="changeFuc"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="有效日期" prop="effectiveData">
                    <el-date-picker v-model="form.effectiveData" type="daterange" range-separator="至" value-format="yyyy-MM-dd" :picker-options="pickerOptions" :unlink-panels="true" @change="changeFuc"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="服务编码" prop="serviceCode">
                    <el-input v-model="form.serviceCode" @change="changeFuc"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-alert title="请求信息" type="info" :closable="false"></el-alert>
              <el-row :gutter="10" v-show="isInwardDev">
                <el-col :span="8">
                  <el-form-item label="发布服务" prop="publishService" :required="isInwardDev">
                    <el-select v-model="form.publishService" @change="serviceChange">
                      <el-option v-for="(value, key) in publishServiceData" :key="key" :value="value" :label="value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="发布地址" prop="publishPath">
                    <el-select v-model="form.publishPath" @change="publishPathChange">
                      <el-option v-for="item in publishAddressData" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="8" v-show="!isInwardDev">
                  <el-form-item label="发布地址" prop="publishPath">
                    <el-input v-model="form.publishPath" @change="changeFuc"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="返回格式" prop="returnFormat">
                    <el-select placeholder="请选择" v-model="form.returnFormat" multiple clearable collapse-tags :disabled="isInwardDev" @change="changeFuc">
                      <el-option v-for="item in returnFormatData" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="请求方式" prop="agreementSubType">
                    <el-select placeholder="请选择" v-model="form.agreementSubType" clearable :disabled="isInwardDev" @change="changeFuc">
                      <el-option v-for="item in requestMethodData" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="table-title">
                <span>请求参数</span>
                <el-button type="text" @click="requestParamAdd" v-show="!isInwardDev">添加一行</el-button>
              </el-row>
              <el-table ref="requestParam" size="small" :data="requestParamData" border max-height="250">
                <el-table-column label="名称">
                  <template slot-scope="{ row }">
                    <el-input v-if="row.edit === true" v-model="row.parameterName" size="mini"></el-input>
                    <span v-else>{{ row.parameterName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="必填">
                  <template slot-scope="{ row }">
                    <el-select v-if="row.edit === true" v-model="row.parameterRequire" size="mini">
                      <el-option value="Y" label="必填"></el-option>
                      <el-option value="N" label="非必填"></el-option>
                    </el-select>
                    <span v-else>{{ row.parameterRequire == 'Y' ? '必填': '非必填'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="类型">
                  <template slot-scope="{ row }">
                    <el-select v-if="row.edit === true" v-model="row.parameterType" size="mini">
                      <el-option v-for="item in typeData" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                    <span v-else>{{ getType(row.parameterType) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="说明" min-width="200">
                  <template slot-scope="{ row }">
                    <el-input v-if="row.edit === true" v-model="row.parameterDesc" size="mini"></el-input>
                    <span v-else>{{ row.parameterDesc }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" v-if="!isInwardDev">
                  <template slot-scope="{ $index }">
                    <el-button type="text" icon="iconfont icon-delete" @click="requestParamDel($index)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row class="table-title" style="margin-top:10px;">
                <span>返回参数</span>
                <el-button type="text" @click="returnParamAdd" v-show="!isInwardDev">添加一行</el-button>
              </el-row>
              <el-table ref="returnParam" size="small" max-height="250" row-key="id" :data="returnParamData" :tree-props="{children: 'childFields'}" border>
                <el-table-column label="名称">
                  <template slot-scope="{ row }">
                    <el-input v-if="row.edit === true" v-model="row.fieldName" size="mini"></el-input>
                    <span v-else>{{ row.fieldName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="必填">
                  <template slot-scope="{ row }">
                    <el-select v-if="row.edit === true" v-model="row.fieldRequire" size="mini">
                      <el-option value="Y" label="必填"></el-option>
                      <el-option value="N" label="非必填"></el-option>
                    </el-select>
                    <span v-else>{{ row.fieldRequire == 'Y' ? '必填': '非必填' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="类型">
                  <template slot-scope="{ row }">
                    <el-select v-if="row.edit === true" v-model="row.fieldType" size="mini">
                      <el-option v-for="item in typeData" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                    <span v-else>{{ getType(row.fieldType) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="说明" min-width="200">
                  <template slot-scope="{ row }">
                    <el-input v-if="row.edit === true" v-model="row.fieldDesc" size="mini"></el-input>
                    <span v-else>{{ row.fieldDesc }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" v-if="!isInwardDev">
                  <template slot-scope="{ $index }">
                    <el-button type="text" icon="iconfont icon-delete" @click="returnParamDel($index)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-form-item label="返回示例" prop="returnExample" style="margin: 10px 0 0 0">
                <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容" v-model="form.returnExample" @change="changeFuc"></el-input>
              </el-form-item>
            </div>
          </el-scrollbar>
        </el-form>
        <footer class="actions">
          <el-button size="small" @click="back" style="margin-right:10px">返回</el-button>
          <el-button size="small" @click="save">暂存</el-button>
          <el-button size="small" type="primary" @click="publish">保存发布</el-button>
        </footer>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getCatalog,
  addService,
  getServiceDetail,
  getPublishService,
  getPublishAddress,
  getPublishAddressDetail,
  getResponseTypes,
  getRequestMethods,
  getParamTypes,
} from "api/serviceResource";

export default {
  data() {
    return {
      isChange: false,
      params: { title: "新增" },
      form: {
        belongDirecId: "", //所属目录
        publishOrg: "", //发布机构
        serviceSource: 2, //服务来源
        serviceName: "", //服务名称
        serviceExplain: "", //服务说明
        effectiveData: [
          new Date(),
          new Date(
            new Date().getFullYear() + 50,
            new Date().getMonth(),
            new Date().getDate()
          ),
        ], //有效日期 默认50年
        serviceCode: "", //服务编码
        publishService: "", //发布服务
        publishPath: "", //发布地址
        returnFormat: [], //返回格式
        agreementSubType: "", //请求方式
        returnExample: "", //返回示例
        agreementType: 1, //接口协议(固定值)
      },
      rules: {
        belongDirecId: [
          { required: true, message: "请选择所属目录", trigger: "change" },
        ],
        publishOrg: [
          { required: true, message: "请填写发布机构", trigger: "blur" },
        ],
        serviceSource: [
          { required: true, message: "请选择服务来源", trigger: "change" },
        ],
        serviceName: [
          { required: true, message: "请填写服务名称", trigger: "blur" },
        ],
        effectiveData: [
          { required: true, message: "请选择有效日期", trigger: "change" },
        ],
        serviceCode: [
          { required: true, message: "请填写服务编码", trigger: "blur" },
        ],
        publishService: [
          { required: false, message: "请选择发布服务", trigger: "change" },
        ],
        publishPath: [
          { required: true, message: "请填写发布地址", trigger: "blur" },
        ],
        returnFormat: [
          { required: true, message: "请选择返回格式", trigger: "change" },
        ],
        agreementSubType: [
          { required: true, message: "请选择请求方式", trigger: "change" },
        ],
      },
      catalogData: [], //所属目录下拉
      cascaderProps: {
        expandTrigger: "hover",
        value: "id",
        label: "name",
        children: "childNodes",
        checkStrictly: true,
        emitPath: false,
      },
      publishServiceData: [], //发布服务下拉
      publishAddressData: [], //发布地址下拉
      returnFormatData: [], //返回格式下拉
      requestMethodData: [], //请求方式下拉
      requestParamData: [], //请求参数
      typeData: [], //类型下拉
      returnParamData: [], //返回参数
      isInwardDev: false, //服务来源是否为内部开发
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        },
      },
    };
  },
  computed: {},
  watch: {
    "form.serviceSource"(val) {
      // this.isInwardDev = val == 1 ? true : false;
    },
  },
  mounted() {
    // 获取目录下拉
    getCatalog().then((res) => {
      this.catalogData = this.formatCatalog(res.result);
    });
    // 获取发布服务下拉
    getPublishService().then((res) => {
      this.publishServiceData = res.result;
    });
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
    if (this.params.state == "add") {
      this.params.title = "新增";
    } else {
      this.params.title = "编辑";
      getServiceDetail({ id: this.params.id }).then((res) => {
        let row = res.result;
        // row.belongDirec = row.belongDirec.split("/");
        this.isInwardDev = row.serviceSource == 1 ? true : false;
        row.effectiveData =
          row.startTime == null ? [] : [row.startTime, row.endTime];
        if (row.publishService !== "") {
          getPublishAddress({ service: row.publishService }).then((res) => {
            this.publishAddressData = res.result;
          });
        }
        row.returnFormat = JSON.parse(row.returnFormat);
        row.agreementSubType = row.agreementSubType
          ? row.agreementSubType.toString()
          : ""; //请求方式从服务器查出来是数字类型
        this.form = row;
        this.requestParamData = row.params;
        this.returnParamData = row.result;
      });
    }
  },
  methods: {
    // 服务来源change
    serviceSourceChange(val) {
      this.changeFuc(val);
      this.isInwardDev = val == 1 ? true : false;
      this.rules = {
        ...this.rules,
        publishService: [
          {
            required: this.isInwardDev,
            message: "请选择发布服务",
            trigger: "change",
          },
        ],
      };
      this.form = {
        ...this.form,
        publishService: "",
        publishPath: "",
        returnFormat: [],
        agreementSubType: "",
      };
      this.requestParamData = [];
      this.returnParamData = [];
    },
    // 发布服务change
    serviceChange(val) {
      this.changeFuc(val);
      this.form.publishPath = "";
      getPublishAddress({ service: val }).then((res) => {
        this.publishAddressData = res.result;
      });
    },
    // 发布地址change
    publishPathChange(val) {
      this.changeFuc(val);
      getPublishAddressDetail({ publishPath: val }).then((res) => {
        this.form = {
          ...this.form,
          returnFormat: res.result.responseTypes,
          agreementSubType: res.result.agreementSubType.toString(),
          returnExample: "",
        };
        this.requestParamData = res.result.params;
        this.returnParamData = res.result.results;
      });
    },
    // 表单相change时间
    changeFuc(val) {
      this.isChange = true;
    },
    // 请求参数-添加一行
    requestParamAdd() {
      this.requestParamData.push({
        edit: true,
      });
    },
    // 请求参数-保存
    // requestParamSave(row) {
    //   row.edit = false;
    // },
    // 请求参数-删除
    requestParamDel(index) {
      this.$confirm("是否确认删除选中的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.requestParamData.splice(index, 1);
        })
        .catch(() => {});
    },
    // 返回参数-添加一行
    returnParamAdd() {
      this.returnParamData.push({
        edit: true,
        id: this.getId(),
      });
    },
    // 返回参数-保存
    // returnParamSave(row) {
    //   row.edit = false;
    // },
    // 返回参数-删除
    returnParamDel(index) {
      this.$confirm("是否确认删除选中的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.returnParamData.splice(index, 1);
        })
        .catch(() => {});
    },
    // 保存发布
    publish() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.savePublish(1);
        } else {
          this.$message.warning("缺少必填项内容，无法保存");
        }
      });
    },
    // 暂存
    save() {
      if (this.form.serviceName == "") {
        this.$message.warning("请填写服务名称");
        return;
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.savePublish(0);
        } else {
          this.$confirm("您还有必填项未完善，确认要暂存并离开吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.savePublish(0);
            })
            .catch(() => {});
        }
      });
    },
    // 新增接口
    savePublish(saveMethod) {
      let param = { ...this.form };
      // param.belongDirec = param.belongDirec.join("/");
      if (param.belongDirecId) {
        param.belongDirec = this.$refs.belongDir
          .getCheckedNodes()[0]
          .pathLabels.join("/");
      }
      param.saveMethod = saveMethod;
      if (param.effectiveData.length > 0) {
        param.startTime = param.effectiveData[0];
        param.endTime = param.effectiveData[1];
      }
      delete param.effectiveData;
      param.params = this.requestParamData;
      this.returnParamData.forEach((item) => {
        delete item.edit;
      });
      param.result = this.returnParamData;
      // param.returnFormat = param.returnFormat.toString();
      this.loading = true;
      addService(param)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success("操作成功");
            this.isChange = false;
            this.jump();
            this.loading = false;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 返回
    back() {
      if (!this.isChange) {
        this.jump();
        return;
      }
      this.$confirm("您有未保存的记录，确认要离开吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.jump();
        })
        .catch(() => {});
    },
    // 跳转到服务管理
    jump() {
      this.$refs.form.resetFields();
      this.$refs.form.clearValidate();
      this.$router.push({ name: "serviceManage" });
    },
    //格式化目录列表: 去掉空的childNodes
    formatCatalog(data) {
      data.forEach((item) => {
        if (item.childNodes.length == 0) {
          delete item.childNodes;
        } else {
          this.formatCatalog(item.childNodes);
        }
      });
      return data;
    },
    // 根据value获取参数类型
    getType(val) {
      return this.typeData.find((item) => item.id == val)?.name;
    },
    // 根据日期和随机数生成一个id
    getId() {
      return Math.ceil(Math.random() * 1000).toString() + Date.now();
    },
  },
};
</script>

<style lang="less" scoped>
.service-manage-add {
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
    .el-cascader,
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
        // &::before {
        //   content: "*";
        //   color: #ee0c00;
        //   margin-right: 4px;
        // }
      }
    }
  }
  footer {
    margin-top: 10px;
    .el-button {
      float: right;
      margin-left: 10px;
    }
  }
}
</style>