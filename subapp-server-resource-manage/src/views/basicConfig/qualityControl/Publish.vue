<!--
  @description 采集监控-基础配置-质控方案-发布
  @date 2022/03/14
-->
<template>
  <div>
    <el-dialog class="publish" width="520px" :visible.sync="isVisible" :before-close="close" :close-on-click-modal="false" :show-close="false" v-el-drag-dialog>
      <div slot="title" class="head">发布</div>
      <el-form ref="form" size="small" label-width="80px" :model="form" :rules="rules" :validate-on-rule-change="false">
        <el-alert title="方案信息" type="info" :closable="false"></el-alert>
        <el-form-item label="方案名称" prop="name">
          <el-input v-model="form.name" disabled></el-input>
        </el-form-item>
        <el-alert title="发布范围" type="info" :closable="false"></el-alert>
        <el-form-item label="规则范围" prop="targetData">
          <el-select v-model="form.targetData">
            <el-option v-for="item in dataTypeData" :key="item.value" :value="parseInt(item.value)" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据范围" prop="timeRangeType" style="margin-bottom:5px">
          <el-radio-group v-model="form.timeRangeType" @change="timeRangeChange">
            <el-radio label="1">累计</el-radio>
            <el-radio label="2">自定义</el-radio>
          </el-radio-group>
          <el-tooltip content="数据范围：指质控方案生效的采集时间周期。" placement="right">
            <i class="iconfont icon-info-circle"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="" prop="timeRange">
          <el-date-picker v-model="form.timeRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="form.timeRangeType=='1'"></el-date-picker>
        </el-form-item>
        <el-alert title="发布配置" type="info" :closable="false"></el-alert>
        <el-form-item label="生效时间" prop="configTimeRange">
          <el-date-picker v-model="form.configTimeRange" type="daterange" range-separator="至" start-placeholder="生效开始日期" end-placeholder="生效截至日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item label="执行配置" prop="cron">
          <el-button type="text" @click="configClick" :disabled="configDisabled">配置</el-button>
        </el-form-item>
        <el-form-item label="手工执行" prop="manualExecute">
          <el-radio-group v-model="form.manualExecute">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>
    <PublishConfig ref="config" @configSave="configSave" @configClose="configDisabled=false"></PublishConfig>
  </div>

</template>

<script>
import { publishQualityControl } from "api/basicConfig";
import PublishConfig from "./PublishConfig.vue";
import elDragDialog from "@/directive/el-dragDialog";

export default {
  components: { PublishConfig },
  data() {
    return {
      isVisible: false,
      form: {
        id: "",
        name: "", //方案名称
        targetData: 0, //规则范围
        timeRangeType: "1", //数据范围类型
        timeRange: [], //数据范围
        configTimeRange: [], //生效时间
        cron: "", //执行配置
        manualExecute: 1, //手工执行
      },
      rules: {
        targetData: [
          { required: true, message: "请选择规则范围", trigger: "change" },
        ],
        timeRangeType: [
          { required: true, message: "请选择数据范围", trigger: "change" },
        ],
        cron: [
          { required: true, message: "请选择执行配置", trigger: "change" },
        ],
        configTimeRange: [
          { required: true, message: "请选择生效时间", trigger: "change" },
        ],
        manualExecute: [
          { required: true, message: "请选择手工执行", trigger: "change" },
        ],
      },
      dataTypeData: [
        { value: "0", label: "全部" },
        ...this.$store.state.ruleConfigTypeData,
      ], //规则范围下拉
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        },
      },
      configDisabled: false,
    };
  },
  directives: {
    elDragDialog,
  },
  methods: {
    // 数据范围类型 change
    timeRangeChange(val) {
      this.rules = {
        ...this.rules,
        timeRange: [
          {
            required: val == "2",
            message: "请选择数据范围",
            trigger: "change",
          },
        ],
      };
      if (val == 1) this.form.timeRange = [];
    },
    // 保存
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let param = {
            ...this.form,
            effectiveStartDate: this.form.configTimeRange[0],
            effectiveEndDate: this.form.configTimeRange[1],
          };
          if (this.form.timeRangeType == "2") {
            param.dataRangeStartTime = this.form.timeRange[0];
            param.dataRangeEndTime = this.form.timeRange[1];
          }
          publishQualityControl(param).then(({ code }) => {
            if (code === 0) {
              this.$emit("publishSave");
              this.$message.success("发布成功");
              this.close();
            }
          });
        } else {
          this.$message.warning("缺少必填项内容，无法保存");
        }
      });
    },
    // 配置
    configClick() {
      this.$refs.config.open(this.form.name, this.form.cron);
      this.configDisabled = true;
    },
    // 配置保存
    configSave(val) {
      this.form.cron = val;
      this.configDisabled = false;
    },
    open(data) {
      this.form.id = data.id;
      this.form.name = data.name;
      this.isVisible = true;
    },
    close() {
      this.$refs.form.resetFields();
      this.$refs.form.clearValidate();
      this.isVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-dialog {
  margin-left: 300px;
}
::v-deep .el-dialog__header {
  padding: 5px 0;
  border-bottom: 1px solid #e9e9e9;
}
::v-deep .el-dialog__body {
  padding: 10px;
}
.el-form {
  height: 520px;
  .el-alert {
    color: #101010;
    margin-bottom: 10px;
  }
  & > .el-form-item {
    margin-bottom: 16px;
    ::v-deep .el-input.is-disabled .el-input__inner {
      color: #919191;
    }
    .el-input,
    .el-select,
    .el-date-editor {
      width: 300px;
    }
    .el-tooltip {
      color: #446abd;
      vertical-align: middle;
      margin-left: 10px;
    }
  }
}
::v-deep .el-dialog__footer {
  padding: 10px;
  border-top: 1px solid #e9e9e9;
  margin-top: 30px;
}
</style>