<template>
  <el-drawer v-bind="$attrs">
    <template slot="title">
      <span class="draw-header">{{ $attrs.title }}</span>
    </template>
    <div class="setDrawer">
      <header>
        <div class="btn-cont">
          <div
            class="btn"
            :class="{ active: currentIndex === '0' }"
            @click="btnClick('0')"
          >
            血糖
          </div>
          <div
            class="btn"
            :class="{ active: currentIndex === '1' }"
            @click="btnClick('1')"
          >
            血压
          </div>
        </div>
      </header>
      <main>
        <setBloodGlucose
          ref="setBloodGlucose"
          :setData="setData"
          :userInfo="userInfo"
          v-show="currentIndex === '0'"
        ></setBloodGlucose>
        <setBloodPressure
          ref="setBloodPressure"
          :setData="setData"
          :userInfo="userInfo"
          v-show="currentIndex === '1'"
        ></setBloodPressure>
      </main>
    </div>
    <div class="drawer-footer">
      <el-button @click="cancelFuc">取消</el-button>
      <el-button type="primary" @click="sureFuc">保存</el-button>
    </div>
  </el-drawer>
</template>

<script>
import setBloodGlucose from "./setBloodGlucose";
import setBloodPressure from "./setBloodPressure";

import {
  queryPersonalizedSetting,
  personalizedSettings,
} from "@/api/modules/PatientCenter";

export default {
  name: "setDrawer",
  props: {
    userInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: { setBloodGlucose, setBloodPressure },
  data() {
    return {
      currentIndex: "0",
      setData: {},
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 获取数据
    async getData() {
      this.setData = {};
      try {
        let params = {
          patId: this.userInfo?.patId || "",
          setType: this.currentIndex === "0" ? "BS" : "BP",
        };
        let { code, result } = await queryPersonalizedSetting(params);
        if (code === 0) {
          console.log("获取个性化数据", result);
          this.handleData(result);
        }
      } catch (error) {}
    },
    handleData(res) {
      if (res.type === "BS") {
        let formData = {
          bpsId: res.bpsId,
          openStatus: res.openStatus,
        };
        let incaditorData = res.personSet || [];
        let arrNew = [];
        for (let i in incaditorData) {
          let item = incaditorData[i];
          arrNew.push({
            bsType: item.bsType,
            value: item.bsRange,
            ...item,
          });
        }
        this.setData = {
          formData,
          incaditorData: arrNew,
        };
      } else if (res.type === "BP") {
        let formData = {
          openStatus: res.openStatus,
        };
        let incaditorData = res.personSet || [];
        for (let i in incaditorData) {
          let item = incaditorData[i];
          if (i == 0) {
            formData.id = item.id;
            // formData.bpType = item.bpType;
            formData.value1 = item.sbpRange;
            formData.value2 = item.dbpRange;
          }
        }
        this.setData = {
          formData,
        };
      }
    },
    btnClick(index) {
      this.currentIndex = index;
      this.getData();
    },
    // 处理保存之前的数据
    handleParams() {
      let operationUserId = sessionStorage.getItem("userId");
      let operationUserName = sessionStorage.getItem("loginName");
      let params = {
        patId: this.userInfo?.patId,
        operationUserId,
        operationUserName,
      };
      if (this.currentIndex === "0") {
        params.setType = "BS";
        let formData = this.$refs.setBloodGlucose.formData;
        let deleteData = this.$refs.setBloodGlucose.deleteData || [];
        let incaditorData = this.$refs.setBloodGlucose.incaditorData;
        let arr = this.handleSymbol(incaditorData);
        if (!arr) {
          return false;
        }
        let arrNew = [];
        for (let i in arr) {
          let item = arr[i];
          if (!item.bsType) {
            this.$message.error("请选择监测类型！");
            return false;
          }
          arrNew.push({
            ...item,
            bsType: item.bsType,
            bsRange: item.value,
            maxBs: item.max,
            minBs: item.min,
          });
        }
        params.inParamDtos = arrNew.concat(deleteData);
        params.openStatus = formData.openStatus ? "Y" : "N";
      } else if (this.currentIndex === "1") {
        params.setType = "BP";
        let formData = this.$refs.setBloodPressure.formData;
        /* if (!formData.bpType) {
          this.$message.error("请选择类型！");
        } */
        if (!formData.value1) {
          this.$message.error("请填写收缩压！");
        }
        if (!formData.value2) {
          this.$message.error("请填写舒张压！");
        }
        let obj1 = {
          value: formData.value1,
        };
        let obj2 = {
          value: formData.value2,
        };
        let incaditorData = [obj1, obj2];
        let arr = this.handleSymbol(incaditorData);
        if (!arr) {
          return false;
        }
        let arrNew = [
          {
            id: formData.id,
            // bpType: formData.bpType,
            sbp: formData.value1,
            dbp: formData.value2,
            sbpRange: formData.value1,
            dbpRange: formData.value2,
            maxSbp: arr[0].max,
            minSbp: arr[0].min,
            maxDbp: arr[1].max,
            minDbp: arr[1].min,
          },
        ];
        params.inParamDtos = arrNew;
        params.openStatus = formData.openStatus ? "Y" : "N";
      }
      return params;
    },
    handleSymbol(list) {
      let arr = [];
      for (let i in list) {
        let item = list[i];
        let value = item.value;
        let max = "";
        let min = "";
        if (value.indexOf("~") > -1) {
          min = value.split("~")[0];
          max = value.split("~")[1];
        } else if (value.indexOf("～") > -1) {
          min = value.split("～")[0];
          max = value.split("～")[1];
        } else if (value.indexOf(">") > -1) {
          max = value.split(">")[1];
        }/*  else if (value.indexOf("≥") > -1) {
          max = value.split("≥")[1];
        } */ else if (value.indexOf("<") > -1) {
          min = value.split("<")[1];
        }/*  else if (value.indexOf("≤") > -1) {
          min = value.split("≤")[1];
        } */ else if (!value) {
          this.$message.error("数据不能为空！");
          return false;
        } else {
          this.$message.error("填写的数据只能含有~、>、<符号！");
          return false;
        }
        let obj = {
          ...item,
          max,
          min,
        };
        arr.push(obj);
      }
      return arr;
    },
    async sureFuc() {
      try {
        let params = this.handleParams();
        if (!params) {
          return false;
        }
        console.log("params", params);
        let { code } = await personalizedSettings(params);
        if (code === 0) {
          this.$message.success("保存成功！");
          this.getData();
        }
      } catch (error) {}
    },
    cancelFuc() {
      this.$emit("setClose");
    },
  },
};
</script>

<style lang='scss' scoped>
:deep(.el-drawer__header) {
  margin-bottom: 10px;
  padding-left: 1px;
}
.draw-header {
  color: rgba(48, 49, 51, 1);
  font-weight: 700;
  padding-left: 10px;
  border-left: 3px solid #4469bd;
}
.setDrawer {
  padding: 10px 0;
  height: calc(100% - 56px);

  header {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;

    .btn-cont {
      width: 200px;
      height: 32px;
      background-color: #f6f8ff;
      border-radius: 42px;
      display: flex;
      justify-content: center;
      .btn {
        width: 100px;
        height: 100%;
        line-height: 32px;
        border-radius: 42px;
        background-color: transparent;
        color: #7495e6;
        text-align: center;
        cursor: pointer;
      }
      .btn.active {
        background-color: #5381e3;
        color: #fff;
      }
    }
  }
  main {
    height: calc(100% - 52px);
    overflow-y: auto;
  }
}
.drawer-footer {
  height: 56px;
  border-top: 1px solid #e9e9e9;
  padding-right: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>