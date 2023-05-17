<!-- 
  @description 服务资源-服务授权-批量授权
  @date 
 -->
<template>
  <div class="batchEmpower" v-loading="loading">
    <div class="protitle">批量授权</div>
    <div class="promain">
      <div class="batchEmpower-table">
        <el-table ref="singleTable" highlight-current-row border stripe height="100%" :data="tableData">
          <el-table-column class="overflow-point" v-for="(item, index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" :min-width="item.width" :fixed="item.fixed">
            <template slot-scope="scope">
              <template v-if="item.prop === 'iAuthorizeStatus'">
                {{ getStatusList(scope.row[item.prop]) }}
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="batchEmpower-form">
        <el-form :model="formData" :rules="rules" label-position="left" ref="ruleForm" size="small" class="demo-ruleForm">
          <el-row :gutter="10" class="el-row-class">
            <el-col v-for="(value, key) in formList" :key="key" :span="value.span">
              <el-form-item :label="value.label || ''" :label-width="value.labelWidth" :prop="value.prop" :required="value.required">
                <template v-if="value.type === 'textarea'">
                  <el-input type="textarea" v-model="formData[value.prop]" show-word-limit :placeholder="value.placeholder" :disabled="value.disabled" :maxlength="value.maxlength" :autosize="value.autosize" @change="changeFuc"></el-input>
                </template>
                <template v-else-if="value.type === 'datetimerange'">
                  <el-date-picker v-model="formData[value.prop]" type="datetimerange" range-separator="至" :format="value.format" :value-format="value.valueFormat || ''" :start-placeholder="value.startPlaceholder" :end-placeholder="value.endPlaceholder" :disabled="value.disabled" @change="changeFuc">
                  </el-date-picker>
                </template>
                <template v-else-if="value.type === 'transfer'">
                  <el-transfer v-model="formData[value.prop]" :data="orgList" filterable :props="{
                    key: 'code',
                    label: 'name',
                  }" :titles="value.titles" :format="value.format" :filter-placeholder="value.filterPlaceholder" @change="changeFuc"></el-transfer>
                </template>
                <template v-else>
                  <el-input v-model="formData[value.prop]" :placeholder="value.placeholder" :disabled="value.disabled"></el-input>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="batchEmpower-btn">
        <el-button size="small" @click="cancelFuc">取消</el-button>
        <el-button type="primary" size="small" @click="sureFuc">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrgList, batchSaveServiceEpm } from "api/serviceEmpower.js";

export default {
  name: "batchEmpower",
  data() {
    return {
      loading: false,
      statusList: [
        {
          label: "未授权",
          value: 0,
        },
        {
          label: "已授权",
          value: 1,
        },
      ],
      params: {},
      tableColumn: [
        { prop: "sBelongDirec", label: "所属目录", width: "120" },
        { prop: "sService", label: "服务名称", width: "120" },
        { prop: "sCode", label: "服务编码", width: "180" },
        { prop: "iAuthorizeStatus", label: "状态", width: "90" },
        { prop: "iAuth", label: "操作人", width: "100" },
        { prop: "sBelongDirec", label: "发布方", width: "100" },
        { prop: "sPublishTime", label: "发布时间", width: "150" },
        { prop: "orgStr", label: "授权机构", width: "120" },
        { prop: "iAuthorizeTime", label: "授权时间", width: "150" },
      ],
      tableData: [],
      formList: [
        {
          label: "授权机构",
          labelWidth: "80px",
          prop: "orgCodeRList",
          type: "transfer",
          filterPlaceholder: "请输入搜索内容",
          titles: ["机构列表", "授权机构"],
          format: {
            noChecked: "0/${total}条",
            hasChecked: "${checked}/${total}条",
          },
          required: true,
          disabled: false,
          span: 24,
        },
        {
          label: "有效日期",
          labelWidth: "80px",
          prop: "date",
          type: "datetimerange",
          format: "yyyy-MM-dd HH:mm:ss",
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: "开始有效日期",
          endPlaceholder: "结束有效日期",
          required: true,
          disabled: false,
          span: 24,
        },
        // {
        //   label: "备注",
        //   labelWidth: "80px",
        //   prop: "remark",
        //   type: "textarea",
        //   placeholder: "备注",
        //   required: false,
        //   disabled: false,
        //   span: 24,
        //   autosize: { minRows: 2, maxRows: 4 },
        //   maxlength: 200,
        // },
      ],
      // 机构列表
      orgList: [],
      rules: {
        orgCodeRList: [
          {
            required: true,
            message: "请选择授权机构",
            trigger: ["blur", "change"],
          },
        ],
        date: [
          {
            required: true,
            message: "请选择有效日期",
            trigger: ["blur", "change"],
          },
        ],
      },
      formData: {
        orgCodeRList: [],
        date: [],
        // remark: "",
      },
      isChange: false,
    };
  },
  computed: {
    proEnv() {
      return window.g.VUE_APP_ENVIRONMENT;
    },
  },
  created() {
    this.getOrgList();
  },
  mounted() {
    this.params = this.$route.params;
    if (this.params.from == "empower") {
      this.tableData = JSON.parse(this.params.selections);
    }
    this.$nextTick(() => {
      this.$refs.ruleForm && this.$refs.ruleForm.clearValidate();
    });
  },
  methods: {
    // 获取机构数据
    async getOrgList() {
      try {
        let params = { keyword: 1 };
        let { result, code } = await getOrgList(params);
        /* let { result, code } = {
          code: 0,
          desc: "成功",
          result: [
            { code: "12345", id: "12345", name: "一级组织", parentId: "0001" },
            {
              code: "1adafdafda5",
              id: "1adafdafda5",
              name: "一级组织名称2",
              parentId: "0001",
            },
            {
              code: "6daaaadd6ff1491f8604d25ffafcd117",
              id: "6daaaadd6ff1491f8604d25ffafcd117",
              name: "test2",
              parentId: "befc2c01734c4b61b224df9bc55f63f8",
            },
            {
              code: "1a17176432e742c5968ff7e0087125b9",
              id: "1a17176432e742c5968ff7e0087125b9",
              name: "test6-1",
              parentId: "568d7901fd4c41e8b757479fe749f4cd",
            },
            {
              code: "2c6369d6069b4a3b8c75a808c1e405e6",
              id: "2c6369d6069b4a3b8c75a808c1e405e6",
              name: "test4",
              parentId: "befc2c01734c4b61b224df9bc55f63f8",
            },
            {
              code: "f134eee27f4e46a49f2aa91bf7f4a925",
              id: "f134eee27f4e46a49f2aa91bf7f4a925",
              name: "test1-1",
              parentId: "ac5d9aa9865e443d827b0873b8ab36a2",
            },
            {
              code: "7e2fa18c4a434a21a6cc0b5113f84763",
              id: "7e2fa18c4a434a21a6cc0b5113f84763",
              name: "test1-2",
              parentId: "ac5d9aa9865e443d827b0873b8ab36a2",
            },
            {
              code: "54106b3b99234bd883eb1a06a7328c57",
              id: "54106b3b99234bd883eb1a06a7328c57",
              name: "test3",
              parentId: "befc2c01734c4b61b224df9bc55f63f8",
            },
            {
              code: "1ed2084f8ec441e08b658b3b0f9b87c1",
              id: "1ed2084f8ec441e08b658b3b0f9b87c1",
              name: "test1",
              parentId: "befc2c01734c4b61b224df9bc55f63f8",
            },
            {
              code: "edab1140438d4048adb177c959748c16",
              id: "edab1140438d4048adb177c959748c16",
              name: "1111",
              parentId: "03542b01b1994808b5f14c528dfcd720",
            },
            {
              code: "365e7932a8dc442cb3b1ff31da8b8403",
              id: "365e7932a8dc442cb3b1ff31da8b8403",
              name: "test",
              parentId: "befc2c01734c4b61b224df9bc55f63f8",
            },
          ],
          total: 11,
        }; */
        if (code === 0) {
          console.log("机构列表数据：", result);
          this.orgList = result;
        }
      } catch (error) {}
    },
    // 表单有改动
    changeFuc() {
      this.isChange = true;
    },
    sureFuc() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            let sidList = this.tableData.map((item) => {
              return item.sId;
            });
            let orgCodeRList = this.formData.orgCodeRList.map((item) => {
              let obj = this.orgList.find((val) => {
                return val.code == item;
              });
              return {
                orgCode: item,
                orgDesc: obj.name,
                startTime: this.formData.date[0],
                endTime: this.formData.date[1],
              };
            });
            let params = {
              sidList,
              orgCodeRList,
            };
            let { result, code } = await batchSaveServiceEpm(params);
            if (code === 0) {
              this.$message.success("操作成功");
              this.isChange = false;
              this.$emit("closeFuc", true);
            }
          } catch (error) {
          } finally {
            this.loading = false;
          }
        }
      });
    },
    cancelFuc() {
      this.$router.push({ name: "serviceEmpower" });
    },
    // 状态反显
    getStatusList(val) {
      let list = this.statusList;
      let obj = list.find((item) => {
        return item.value == val;
      });
      return obj.label || "";
    },
  },
  // 路由守卫
  beforeRouteLeave(to, from, next) {
    if (this.isChange) {
      this.$confirm("您有未保存的记录，确认要离开吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        next();
      });
      return;
    }
    next();
  },
};
</script>

<style lang="less" scoped>
.batchEmpower {
  height: 100%;
  .batchEmpower-table {
    height: 300px;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #fff;
  }
  .batchEmpower-form {
    height: calc(100% - 370px);
    margin-bottom: 10px;
    padding: 10px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    ::v-deep .el-form {
      width: 550px;
    }
    ::v-deep .el-transfer {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    ::v-deep .el-transfer-panel {
      width: 176px;
      height: 235px;
      border-radius: 3px;
      background-color: #fff;
      border: 1px solid #d9d9d9;
    }
    ::v-deep .el-transfer__buttons {
      width: 44px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 10px;
    }
    ::v-deep .el-transfer__button:nth-child(1) {
      margin-bottom: 5px;
    }
    ::v-deep .el-transfer__button:nth-child(2) {
      margin: 0 !important;
    }
    ::v-deep .el-transfer__button.el-button {
      height: 24px;
      width: 24px;
      padding: 0;
      text-align: center;
    }
    ::v-deep .el-transfer-panel .el-transfer-panel__header {
      background: #fff;
    }
    ::v-deep .el-transfer-panel .el-transfer-panel__body {
      height: calc(100% - 40px);
      padding: 2px 5px 0 5px;
    }
    ::v-deep .el-checkbox__label {
      color: #5d5d5d;
      font-size: 14px;
      font-family: SourceHanSansSC-regular;
      text-overflow: initial;
      overflow: visible;
      span {
        color: #949494;
      }
    }
    ::v-deep .el-transfer-panel__filter {
      margin: 0;
      height: 30px;
    }
    ::v-deep .el-transfer-panel__filter .el-input__inner {
      height: 28px;
      border-radius: 4px;
    }
    ::v-deep
      .el-form-item.is-error
      .el-transfer-panel__filter
      .el-input__inner {
      border-color: #dcdfe6;
    }
    ::v-deep .el-input__prefix {
      height: calc(100% - 2px);
    }
    ::v-deep .el-input--small .el-input__icon {
      line-height: 28px;
    }
    ::v-deep .el-transfer-panel__list.is-filterable {
      height: calc(100% - 30px);
    }
    ::v-deep .el-transfer-panel__item {
      padding-left: 10px;
    }
  }
  .batchEmpower-btn {
    height: 50px;
    padding: 10px;
    background-color: #fff;
    display: flex;
    justify-content: flex-end;
  }
}
</style>