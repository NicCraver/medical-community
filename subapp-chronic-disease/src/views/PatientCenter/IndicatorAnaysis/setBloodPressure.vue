<template>
  <div class="setBloodPressure">
    <div class="label">
      <i>*</i>
      依照《中国高血压防治指南2018年修订版》
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
            您可根据患者实际情况和近期监测指标结果进行合理的个性化指标录入。
          </div>
        </div>
        <div slot="reference">
          <IconSvg iconClass="info-blue" width="16" height="16"></IconSvg>
        </div>
      </el-popover>
      <div class="left">血压个性化指标设置:</div>
      <div
        class="right overflow-point"
        title="*请参考平台范围值，录入正确的间隔符号"
      >
        *请参考平台范围值，录入正确的间隔符号
      </div>
    </div>
    <div class="incaditor">
      <!-- <div>
        <el-select
          v-model="formData.bpType"
          placeholder=""
          style="width: 170px; margin-right: 10px"
          @change="bpTypeChange"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div> -->
      <div>
        <inputWithTitle title="收缩压" style="width: 170px; margin-right: 10px">
          <el-autocomplete
            v-model="formData.value1"
            :fetch-suggestions="querySearch1"
            placeholder="录入单值/范围值"
            style="width: 100%"
          ></el-autocomplete>
        </inputWithTitle>
        <inputWithTitle title="舒张压" style="width: 170px">
          <el-autocomplete
            style="width: 100%"
            v-model="formData.value2"
            :fetch-suggestions="querySearch2"
            placeholder="录入单值/范围值"
          ></el-autocomplete>
        </inputWithTitle>
      </div>
    </div>
    <div class="note">
      患者采集数据异常时，系统同时会对比平台正常范围值，如仍异常才会做异常提醒，请您知晓。
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
import inputWithTitle from "@/components/inputWithTitle/inputWithTitle.vue";
export default {
  name: "setBloodPressure",
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
  components: { inputWithTitle },
  data() {
    return {
      tableData: [
        {
          className: "header",
          datas: [
            {
              content: "  血压平台范围值",
              width: "100%",
              className: "header",
            },
          ],
        },
        {
          className: "title",
          datas: [
            {
              content: "分类",
              width: "20%",
              className: "title",
            },
            {
              content: "SBP(mmHg)",
              width: "40%",
              className: "title",
            },
            {
              content: "DBP(mmHg)",
              width: "40%",
              className: "title",
            },
          ],
        },
        {
          datas: [
            {
              content: "正常血压",
              width: "20%",
            },
            {
              content: "<120和",
              width: "40%",
            },
            {
              content: "<80",
              width: "40%",
            },
          ],
        },
        {
          datas: [
            {
              content: "临界值",
              width: "20%",
            },
            {
              content: "120～139和（或）",
              width: "40%",
            },
            {
              content: "80～89",
              width: "40%",
            },
          ],
        },
        {
          datas: [
            {
              content: "1级",
              width: "20%",
            },
            {
              content: "140～159和（或）",
              width: "40%",
            },
            {
              content: "90～99",
              width: "40%",
            },
          ],
        },
        {
          datas: [
            {
              content: "2级",
              width: "20%",
            },
            {
              content: "160～179和（或）",
              width: "40%",
            },
            {
              content: "100～109",
              width: "40%",
            },
          ],
        },
        {
          datas: [
            {
              content: "3级",
              width: "20%",
            },
            {
              content: "≥180和（或）",
              width: "40%",
            },
            {
              content: "≥110",
              width: "40%",
            },
          ],
        },
      ],
      formData: {
        id: "",
        // bpType: "",
        value1: "",
        value2: "",
        openStatus: false,
      },
      typeOptions: [
        {
          label: "正常血压",
          value: "A",
        },
        {
          label: "临界值",
          value: "B",
        },
        {
          label: "高血压1级",
          value: "C",
        },
        {
          label: "高血压2级",
          value: "D",
        },
        {
          label: "高血压3级",
          value: "E",
        },
      ],
      val1Options: [
        { label: "120~139", value: "120~139" },
        { label: "<140", value: "<140" },
      ],
      val2Options: [
        { label: "80~89", value: "80~89" },
        { label: "<90", value: "<90" },
      ],
      valueObj: {
        C: {
          value1: "",
          value2: "",
        },
        D: {
          value1: "",
          value2: "",
        },
        E: {
          value1: "",
          value2: "",
        },
      },
    };
  },
  computed: {
    adiagnoses() {
      let adiagnoses = this.userInfo?.adiagnoses?.length
        ? this.userInfo.adiagnoses
        : [];
      let str = "无";
      for (let i in adiagnoses) {
        if (adiagnoses[i].indexOf("糖尿病") > -1) {
          str = adiagnoses[i];
        }
      }
      return str;
    },
  },
  watch: {
    setData: {
      handler(val) {
        let formDataInit = {
          // bpType: "",
          value1: "",
          value2: "",
          openStatus: false,
        };
        let openStatus = val?.formData?.openStatus;
        this.formData = {
          ...formDataInit,
          ...val.formData,
          openStatus:
            openStatus === "Y" ? true : openStatus === "N" ? false : true,
        };
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    querySearch1(queryString, cb) {
      var valOptions = this.val1Options;
      var results = queryString
        ? valOptions.filter(this.createFilter(queryString))
        : valOptions;
      cb(results);
    },
    querySearch2(queryString, cb) {
      var valOptions = this.val2Options;
      var results = queryString
        ? valOptions.filter(this.createFilter(queryString))
        : valOptions;
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
    bpTypeChange(val) {
      if (val) {
        this.$set(this.formData, "value1", this.valueObj[val]?.value1 || "");
        this.$set(this.formData, "value2", this.valueObj[val]?.value2 || "");
      }
    },
  },
};
</script>
  
  <style lang='scss' scoped>
.setBloodPressure {
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
      height: 23px;
      line-height: 23px;
      color: rgba(91, 91, 91, 1);
      font-weight: 500;
      font-size: 14px;
      margin: 0 10px 0 7px;
    }
    .right {
      width: 210px;
      font-size: 10px;
    }
  }
  .incaditor {
    height: 60px;
    margin: 10px;
    padding-left: 10px;
    background-color: rgba(247, 247, 247, 1);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
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
</style>