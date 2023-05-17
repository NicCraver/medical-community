<!--
  @description 质控board-区域总览-方案卡片-查看
  @date 2022/04/07
-->
<template>
  <el-dialog width="520px" :visible.sync="isVisible" :before-close="close" :close-on-click-modal="false">
    <div slot="title" class="head">方案详情</div>
    <div class="title">
      <span>方案名称：</span>
      <el-button type="text" @click="showScheme">{{projectData.name}}</el-button>
    </div>
    <el-row>
      <el-col :span="4">数据对象：</el-col>
      <el-col :span="14">{{projectData.targetData}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4">数据范围：</el-col>
      <el-col :span="2" v-if="!projectData.dataRange||projectData.dataRange.length==0">累计</el-col>
      <el-col :span="14" v-else>
        <el-date-picker size="small" v-model="projectData.dataRange" type="daterange" range-separator="至" value-format="yyyy-MM-dd" disabled></el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-tooltip content="数据范围：指质控方案生效的采集时间周期。" placement="right">
          <i class="iconfont icon-info-circle"></i>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">启动时间：</el-col>
      <el-col :span="14">{{projectData.executeTime}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4">得分设置：</el-col>
      <el-col :span="2">{{projectData.scoreType==1?'小数':'整数'}}</el-col>
      <el-col :span="2">
        <el-tooltip :content="projectData.scoreType==1?'质控得分将直接使用质量指数(满分为1 .00), 非满分展示如0.85。':'质控得分将使用质量指数乘以100，如0.85展示为85.00。'" placement="right">
          <i class="iconfont icon-info-circle"></i>
        </el-tooltip>
      </el-col>
    </el-row>
    <div class="footer">
      <el-button size="small" class="fr" @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getProjectDetail } from "api/qualityControl";

export default {
  data() {
    return {
      isVisible: false,
      projectData: {},
      dataTypeData: [
        { value: "0", label: "全部" },
        ...this.$store.state.ruleConfigTypeData,
      ], //数据对象类型
    };
  },
  methods: {
    open(data) {
      this.projectData = data;
      getProjectDetail({ id: data.id }).then(({ result, code }) => {
        if (code === 0) {
          this.projectData = {
            ...this.projectData,
            targetData: this.dataTypeData.find(
              (item) => item.value == result.targetData
            )?.label,
            dataRange: result.dataRangeStartTime
              ? [result.dataRangeStartTime, result.dataRangeEndTime]
              : [],
            executeTime: result.executeTime,
          };
        }
      });
      this.isVisible = true;
    },
    close() {
      this.isVisible = false;
    },
    // 跳转到方案详情
    showScheme() {
      this.$router.push({
        name: "configQualityControlShow",
        params: { id: this.projectData.id, projectState: "release" },
      });
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-dialog__header {
  padding: 5px 0;
  border-bottom: 1px solid #e9e9e9;
}
::v-deep .el-dialog__body {
  padding: 10px;
}
.title {
  height: 35px;
  line-height: 35px;
  background-color: #f4f4f5;
  color: #101010;
  padding: 0 10px;
  margin-bottom: 10px;
}
.el-row {
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
  margin-bottom: 10px;
  color: #303133;
}
.el-date-editor {
  width: 240px;
}
.el-tooltip {
  color: #446abd;
  line-height: 31px;
}
.footer {
  height: 32px;
}
</style>