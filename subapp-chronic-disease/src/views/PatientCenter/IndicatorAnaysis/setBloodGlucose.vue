<template>
  <div class="setBloodGlucose">
    <div class="label">
      <i>*</i>
      依照《中国 2 型糖尿病防治指南(2020 年版)》
    </div>

    <div class="table-cont">
      <div
        v-for="(val, key) in tableData"
        :key="key"
        class="row"
        :class="val.className"
      >
        <div
          v-for="(item, index) in val.datas"
          :key="index"
          class="table-item overflow-point"
          :class="item.className"
          :style="{ width: item.width }"
        >
          {{ item.content || "" }}
        </div>
      </div>
      <div class="colpass" @click="colpassFuc">
        <IconSvg iconClass="bottomOne" width="16" height="16"></IconSvg>
      </div>
    </div>

    <!-- <div class="patient-header overflow-point">
      当前患者诊断<i>{{ adiagnoses }}</i
      >，指标个性化监测推荐如下：
    </div> -->
    <div class="gexinghua">
      <el-popover
        placement="top-start"
        title=""
        width="274"
        trigger="hover"
        popper-class="monitor-yt-popover"
      >
        <div class="tool-tip">
          <div class="left-circle">
            异常提醒范围
            <div class="little-circle">录入范围</div>
          </div>
          <div class="right-cont">
            根据指南，我们为您推荐糖尿病患者SMBG和HbA1c控制值，您可根据患者实际情况和近期监测指标结果进行合理的个性化指标录入。
          </div>
        </div>
        <div slot="reference">
          <IconSvg iconClass="info-blue" width="16" height="16"></IconSvg>
        </div>
      </el-popover>
      <div class="left">
        <div>血糖个性化指标设置:</div>
        <div class="add" @click="addFuc" v-if="incaditorData.length < 3">+</div>
      </div>
      <div
        class="right overflow-point"
        title="*请参考平台范围值，录入正确的间隔符号"
      >
        *请参考平台范围值，录入正确的间隔符号
      </div>
    </div>
    <div class="incaditor" v-for="(item, index) in incaditorData" :key="index">
      <el-select
        v-model="item.bsType"
        placeholder=""
        @change="typeFocus"
        @focus="typeFocus"
        style="width: 118px; margin-right: 10px"
      >
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        >
        </el-option>
      </el-select>
      <el-autocomplete
        v-if="item.bsType === 'C'"
        style="width: 175px; margin-right: 2px"
        v-model="item.value"
        :fetch-suggestions="querySearch1"
        placeholder="录入单值/范围值"
      ></el-autocomplete>
      <el-autocomplete
        v-else
        style="width: 175px; margin-right: 2px"
        v-model="item.value"
        :fetch-suggestions="querySearch"
        placeholder="录入单值/范围值"
      ></el-autocomplete>
      <span style="margin-right: 10px">
        {{ item.bsType === "C" ? "%" : "mmol/L" }}
      </span>
      <div
        style="cursor: pointer"
        @click="deleteFuc(index)"
        v-if="!(incaditorData.length === 1 && index === 0)"
      >
        <IconSvg iconClass="delete" width="21" height="21"></IconSvg>
      </div>
    </div>
    <div class="note">
      <p>
        根据指南，建议监测空腹和餐后两小时血糖指标，患者端采集<i>非空腹指标</i>都默认对比餐后两小时监测范围指标。
      </p>
      <p style="margin-top:5px">
        患者采集数据异常时，系统同时会对比平台正常范围值，如仍异常才会做异常提醒，请您知晓。
      </p>
    </div>
    <div class="jiance">
      <div class="jiance-label">个性化监测状态</div>
      <el-switch
        style="display: block"
        v-model="formData.openStatus"
        active-color="#446ABD"
        active-text="开启"
        inactive-text="关闭"
      >
      </el-switch>
    </div>
    <div class="note">
       开启个性化监测状态后，将按个性化指标进行监测提醒。反之，将按照平台标准进行监测提醒。
    </div>
  </div>
</template>
    
    <script>
export default {
  name: "setBloodGlucose",
  props: {
    setData: {
      type: Object,
      default() {
        return {};
      },
    },
    userInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      isColpass: true,
      tableData: [],
      tableData1: [
        {
          className: "header",
          datas: [
            {
              content: "血糖平台范围值",
              width: "100%",
              className: "header",
            },
          ],
        },
        {
          className: "title",
          datas: [
            {
              content: "血糖类型",
              width: "25%",
              className: "title",
            },
            {
              content: "状态",
              width: "30%",
              className: "title",
            },
            {
              content: "平台范围 （mmol/L）",
              width: "45%",
              className: "title",
            },
          ],
        },
        {
          className: "dateCls",
          datas: [
            {
              content: "空腹",
              width: "25%",
              className: "dateCls",
            },
            {
              content: "偏低",
              width: "30%",
            },
            {
              content: "<3.9",
              width: "45%",
            },
            {
              content: "正常",
              width: "30%",
            },
            {
              content: "<6.1",
              width: "45%",
            },
            {
              content: "偏高",
              width: "30%",
            },
            {
              content: "6.1~7.0；>7.0",
              width: "45%",
            },
          ],
        },
        {
          className: "dateCls",
          datas: [
            {
              content: "餐后",
              width: "25%",
              className: "dateCls",
            },
            {
              content: "偏低",
              width: "30%",
            },
            {
              content: "<3.9",
              width: "45%",
            },
            {
              content: "正常",
              width: "30%",
            },
            {
              content: "<7.8",
              width: "45%",
            },
            {
              content: "偏高",
              width: "30%",
            },
            {
              content: "≥7.8",
              width: "45%",
            },
          ],
        },
      ],
      tableData2: [
        {
          className: "dateCls",
          datas: [
            {
              content: "餐前",
              width: "25%",
              className: "dateCls",
            },
            {
              content: "偏低",
              width: "30%",
            },
            {
              content: "<3.9",
              width: "45%",
            },
            {
              content: "正常",
              width: "30%",
            },
            {
              content: "<6.1",
              width: "45%",
            },
            {
              content: "偏高",
              width: "30%",
            },
            {
              content: "6.1~7.0；>7.0",
              width: "45%",
            },
          ],
        },
        {
          className: "dateCls",
          datas: [
            {
              content: "睡前",
              width: "25%",
              className: "dateCls",
            },
            {
              content: "偏低",
              width: "30%",
            },
            {
              content: "<3.9",
              width: "45%",
            },
            {
              content: "正常",
              width: "30%",
            },
            {
              content: "<6.1",
              width: "45%",
            },
            {
              content: "偏高",
              width: "30%",
            },
            {
              content: "≥6.1",
              width: "45%",
            },
          ],
        },
        {
          className: "dateCls",
          datas: [
            {
              content: "凌晨",
              width: "25%",
              className: "dateCls",
            },
            {
              content: "偏低",
              width: "30%",
            },
            {
              content: "<3.9",
              width: "45%",
            },
            {
              content: "正常",
              width: "30%",
            },
            {
              content: "<6.1",
              width: "45%",
            },
            {
              content: "偏高",
              width: "30%",
            },
            {
              content: "≥6.1",
              width: "45%",
            },
          ],
        },
        {
          className: "header",
          datas: [
            {
              content: "糖化血红蛋白平台范围值",
              width: "100%",
              className: "header",
            },
          ],
        },
        {
          className: "",
          datas: [
            {
              content: "糖化血红蛋白",
              width: "50%",
            },
            {
              content: "<6.5",
              width: "50%",
            },
          ],
        },
      ],
      incaditorData: [],
      deleteData: [],
      formData: {
        openStatus: false,
      },
      typeOptions: [
        {
          label: "空腹",
          value: "A",
        },
        {
          label: "餐后2小时",
          value: "B",
        },
        {
          label: "糖化",
          value: "C",
        },
      ],
      valOptions: [
        { label: "4.4～7.0", value: "4.4～7.0" },
        { label: "<10", value: "<10" },
      ],
      val1Options: [{ label: "<7", value: "<7" }],
    };
  },
  computed: {
    adiagnoses() {
      let adiagnoses = this.userInfo?.adiagnoses?.length
        ? this.userInfo.adiagnoses
        : [];
      let str = "无";
      for (let i in adiagnoses) {
        if (adiagnoses[i].indexOf("高血压") > -1) {
          str = adiagnoses[i];
        }
      }
      return str;
    },
  },
  watch: {
    setData: {
      handler(val) {
        let openStatus = val?.formData?.openStatus;
        this.formData = {
          ...val.formData,
          openStatus:
            openStatus === "Y" ? true : openStatus === "N" ? false : true,
        };
        this.incaditorData = val.incaditorData || [
          { bsType: "A", value: "" },
          { bsType: "B", value: "" },
          { bsType: "C", value: "" },
        ];
        this.typeFocus();
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.tableData = this.tableData1;
  },
  methods: {
    addFuc() {
      this.$set(this.incaditorData, this.incaditorData.length, {
        bsType: "",
        value: "",
      });
      this.typeFocus();
    },
    deleteFuc(index) {
      if (index?.id) {
        this.$set(this.deleteData, this.deleteData.length, {
          ...this.incaditorData[index],
          deleteStatus: "Y",
        });
      }
      this.$delete(this.incaditorData, index);
      this.typeFocus();
    },
    colpassFuc() {
      this.isColpass = !this.isColpass;
      if (this.isColpass) {
        this.tableData = this.tableData1;
        return;
      }
      this.tableData = this.tableData1.concat(this.tableData2);
    },
    querySearch(queryString, cb) {
      var valOptions = this.valOptions;
      var results = queryString
        ? valOptions.filter(this.createFilter(queryString))
        : valOptions;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    querySearch1(queryString, cb) {
      var valOptions = this.val1Options;
      var results = queryString
        ? valOptions.filter(this.createFilter(queryString))
        : valOptions;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (valOptions) => {
        return (
          valOptions.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {},
    // 类型不可重复选
    typeFocus() {
      let incaditorData = this.incaditorData.map((item) => item.bsType);
      for (let i in this.typeOptions) {
        let item = this.typeOptions[i];
        item.disabled = incaditorData.indexOf(item.value) !== -1;
      }
      console.log(this.typeOptions);
    },
  },
};
</script>
    
    <style lang='scss'>
.setBloodGlucose {
  height: 100%;
  .label {
    height: 20px;
    padding: 0 10px;
    font-size: 14px;
    color: #333;
    i {
      color: rgba(83, 129, 227, 1);
    }
  }

  .table-cont {
    margin: 10px;
    border-top: 1px solid #ececec;
    border-left: 1px solid #ececec;
    .row {
      width: 100%;
      height: 30px;
    }
    .table-item {
      float: left;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      text-align: left;
      border-right: 1px solid #ececec;
      border-bottom: 1px solid #ececec;
      padding: 0 5px;
    }
    .header {
      height: 35px;
      line-height: 35px;
      font-weight: 600;
      text-align: center;
      background-color: #f6f7fb;
    }
    .title {
      height: 35px;
      line-height: 35px;
      background-color: #f6f7fb;
    }
    .dateCls {
      height: 90px;
      line-height: 90px;
    }
    .colpass {
      height: 20px;
      line-height: 20px;
      text-align: center;
      cursor: pointer;
      border-right: 1px solid #ececec;
      border-bottom: 1px solid #ececec;
      background-color: #f6f7fb;
    }
  }
  .patient-header {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    text-align: left;
    padding-left: 10px;
    margin: 20px 0 20px 0;
    background-color: #f6f7fb;
    i {
      color: #446abd;
    }
  }
  .gexinghua {
    margin: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      margin: 0 10px 0 7px;
      div {
        display: inline-block;
        height: 23px;
        line-height: 23px;
        color: rgba(91, 91, 91, 1);
        font-weight: 600;
        font-size: 14px;
      }
      .add {
        width: 18px;
        height: 18px;
        text-align: center;
        line-height: 15px;
        border-radius: 2px;
        background-color: rgba(255, 255, 255, 1);
        color: #909090;
        font-size: 14px;
        border: 1px solid #909090;
        margin-left: 5px;
        cursor: pointer;
      }
    }
    .right {
      width: 160px;
      font-size: 10px;
    }
  }
  .incaditor {
    height: 50px;
    margin: 10px;
    padding-left: 10px;
    background-color: rgba(247, 247, 247, 1);
    display: flex;
    align-items: center;
  }
  .note {
    margin: 10px;
    line-height: 16px;
    color: rgba(157, 157, 157, 1);
    font-size: 11px;
    i {
      color: #446abd;
    }
  }
  .jiance {
    display: flex;
    align-items: center;
    margin: 0 10px 10px 10px;
    .jiance-label {
      height: 23px;
      line-height: 23px;
      color: rgba(91, 91, 91, 1);
      font-size: 14px;
      margin-right: 10px;
    }
  }
  // 文字超出后...
  .overflow-point {
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    -ms-text-overflow: ellipsis;
    -moz-text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
    overflow: hidden;
  }
}

.tool-tip {
  width: 274px;
  padding: 10px;
  border-radius: 5px;
  background-color: #404040;
  color: #ffffff;
  font-size: 14px;
  text-align: center;
  box-shadow: 0px 0px 10px 0px #0000004d;
  font-family: Roboto;
  border: 1px solid #404040;
  display: flex;
  align-items: center;
  .left-circle {
    width: 80px;
    height: 80px;
    border-radius: 40px;
    padding-top: 15px;
    margin-right: 10px;
    background-color: rgba(247, 118, 1, 0.7);
    color: #ffffff;
    font-size: 13px;
    text-align: center;
    font-family: Roboto;
    position: relative;
    .little-circle {
      position: absolute;
      bottom: 0;
      left: 17px;
      width: 46px;
      height: 46px;
      border-radius: 23px;
      padding-top: 10px;
      line-height: 16px;
      background-color: rgba(27, 196, 177, 1);
      color: #ffffff;
      font-size: 11px;
      text-align: center;
    }
  }
  .right-cont {
    flex: 1;
    color: #ffffff;
    font-size: 12px;
    font-family: SourceHanSansSC-regular;
    text-indent: 20px;
    text-align: left;
  }
}

.el-popover.monitor-yt-popover {
  padding: 0 !important;
  background-color: transparent !important;
}

.monitor-yt-popover .popper__arrow::after {
  border-top-color: #404040 !important;
}
</style>