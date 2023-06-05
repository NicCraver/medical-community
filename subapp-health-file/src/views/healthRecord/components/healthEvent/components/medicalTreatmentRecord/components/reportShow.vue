<template>
  <div class="page">
    <div class="title">
      <span class="titleText overflow-point" :title="reportObj.reportTitle">
        {{ reportObj.reportTitle }}
      </span>
      <!-- <i class="titleIcon" v-if="reportObj.nationwide == 1">
        <IconSvg
          iconClass="to-change"
          width="14"
          height="14"
          style="vertical-align: middle"
        ></IconSvg
        >全国互认
      </i> -->
    </div>
    <div class="nav-title">
      <el-row class="contentItem">
        <el-col class="contentItemInner" :span="12">
          <span>申请时间：</span>
          <span>{{ reportObj.applyTime }}</span>
        </el-col>
        <el-col class="contentItemInner" :span="12">
          <span>报告科室：</span>
          <span>{{ reportObj.execDeptName }}</span>
        </el-col>
      </el-row>
      <el-row class="contentItem">
        <el-col
          class="contentItemInner contentItemTitle"
          v-for="(item, index) in showColumn"
          :key="index"
          :span="item.with"
          >{{ item.name }}</el-col
        >
      </el-row>
    </div>
    <div class="main-cont">
      <!-- <el-col v-if="reportObj.results.length == 0 " style="text-align:center; margin-top: 20vh">
          暂无数据
      </el-col> -->
      <el-row
        class="contentItem"
        v-for="(item, index) in reportObj.results"
        :key="index"
      >
        <el-col
          class="contentItemInner"
          v-for="(columnItem, index) in showColumn"
          :key="index"
          :span="columnItem.with"
        >
          <span :title="item[columnItem.key]">
            {{ item[columnItem.key] }}
          </span>

          <span
            class="isHigh"
            v-if="item.abnormityTip == 3 && columnItem.key == 'result'"
          >
            <i class="el-icon-top" style="margin-left: 2px"></i>
          </span>
          <span
            class="isLow"
            v-if="item.abnormityTip == 4 && columnItem.key == 'result'"
          >
            <i class="el-icon-bottom" style="margin-left: 2px"></i>
          </span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    reportObj: {
      type: Object,
      default() {
        return {
          results: [],
        };
      },
    },
  },
  data() {
    return {
      showData: [],
      showColumn: [
        {
          name: "项目",
          key: "itemName",
          with: 8,
        },
        {
          name: "结果",
          key: "result",
          with: 3,
        },
        {
          name: "单位",
          key: "unitCode",
          with: 3,
        },
        {
          name: "参考值",
          key: "referenceValue",
          with: 4,
        },
        {
          name: "检测方法",
          key: "testMethod",
          with: 5,
        },
      ],
    };
  },
  components: {},
};
</script>

<style scoped lang="scss">
.page {
  border: 1px solid rgba(217, 217, 217, 100);
  height: calc(100% - 2px);
}

.isHigh {
  width: 16px;
  height: 16px;
  font-size: 16px;
  color: #ff4d4f;
}

.isLow {
  width: 16px;
  height: 16px;
  font-size: 16px;
  color: #5e84d7;
}

.title {
  border-bottom: 1px solid rgba(217, 217, 217, 100);
  height: 40px;
  line-height: 20px;
  background-color: rgba(247, 247, 247, 100);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  .titleText {
    color: rgba(51, 51, 51, 100);
    font-size: 16px;
    font-family: SourceHanSansSC-medium;
  }

  .titleIcon {
    font-weight: bold;
    margin-left: 7px;
    height: 18px;
    line-height: 18px;
    border-radius: 2px;
    background-color: rgba(255, 255, 255, 100);
    text-align: center;
    border: 1px solid rgba(80, 174, 163, 100);
    color: rgba(80, 174, 163, 100);
    display: inline-block;
    text-align: center;
    width: 80px;
  }
}
.main-cont {
  height: calc(100% - 121px);
  overflow-y: auto;
}

.contentItem {
  border-bottom: 1px solid #ebeef5;
  height: 40px;
  box-sizing: border-box;
  color: #333333 !important;
  .contentItemInner {
    height: 100%;
    // display: flex;
    // align-items: center;
    line-height: 40px;
    padding: 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .contentItemTitle {
    color: rgba(145, 145, 145, 100);
    font-size: 14px;
    font-family: SourceHanSansSC-medium;
  }
  .itemOtherTitle {
    color: rgba(51, 51, 51, 100);
    font-size: 14px;
    font-family: SourceHanSansSC-regular;
  }
}
</style>
