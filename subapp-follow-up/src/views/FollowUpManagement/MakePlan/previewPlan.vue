<template>
  <el-drawer
    :visible="true"
    direction="rtl"
    size="700px"
    class="check-plan"
    :before-close="closeDrawer"
    destroy-on-close
    :append-to-body="true"
  >
    <template #title>
      <div class="title">查看随访计划</div>
    </template>
    <div class="calendar-navBar">
      <div class="one">123...</div>
      <div class="two">已定随访日</div>
      <div class="three">数字</div>
      <div class="four">今日</div>
      <div class="five">数字</div>
      <div>开启时间</div>
    </div>
    <div class="calendar-cont">
      <el-calendar
        class="calendar"
        v-for="(item, index) in monthList"
        :key="index"
        v-model="item.monthDate"
      >
        <template slot="dateCell" slot-scope="{ data, date }">
          <div class="dateCls" :class="getDateCls(date)">
            {{ formatDate(date, "DD") }}
            <div class="labelCls" v-if="getDateContent(date)">
              <div>{{ getDateContent(date) }}</div>
            </div>
          </div>
        </template>
      </el-calendar>
    </div>
  </el-drawer>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "previewPlan",
  props: ["visible", "closeDrawer", "followupStartTime", "dateList"],
  data() {
    return {};
  },
  computed: {
    monthList() {
      let monthList = this.dateList.map((item) =>
        dayjs(item).format("YYYY-MM")
      );
      let list = Array.from(new Set(monthList));
      list = list.map((item) => {
        return {
          monthDate: item,
        };
      });
      return list;
    },
  },
  mounted() {},
  methods: {
    // 为日历增加第几次随访上角标
    getDateContent(date) {
      let dates = dayjs(date).format("YYYY-MM-DD");
      let num = "";
      let index = this.dateList.indexOf(dates);
      if (index > -1) {
        num = index + 1;
      }
      return num;
    },
    // 日历classname
    getDateCls(date) {
      let className = {};
      let dates = dayjs(date).format("YYYY-MM-DD");
      let datesTimes = new Date(dates).getTime();
      let followupStartTime = this.followupStartTime;
      let followupStartTimes = new Date(followupStartTime).getTime();
      // 开启日期
      if (datesTimes === followupStartTimes) {
        className["startTimeCls"] = true;
      }
      return className;
    },
    // 格式化日期
    formatDate(date, format) {
      let data = dayjs(date).format(format);
      return data;
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-drawer__header) {
  border-bottom: 1px solid #ebeef5;
}
:deep(.el-drawer__body) {
  padding: 10px;
}
.title {
  flex: 1;
  color: #303133;
  font-size: 16px;
  border-left: 3px solid #134796;
  line-height: 20px;
  padding-left: 10px;
}
.calendar-navBar {
  height: 40px;
  line-height: 17px;
  font-size: 12px;
  color: #5b5b5b;
  margin-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .one {
    line-height: 14px;
    border-radius: 2px;
    background-color: #7495e6;
    color: #ffffff;
    font-size: 9px;
    margin-right: 5px;
  }
  .two {
    margin-right: 20px;
  }
  .three {
    color: #5381e3;
    margin-right: 2px;
  }
  .four {
    margin-right: 15px;
  }
  .five {
    border-radius: 2px;
    background-color: #f1f3fd;
    margin-right: 2px;
  }
}
.calendar-cont {
  flex: 1;
  overflow-y: auto;
  display: flex;
  justify-content: space-between;
  align-content: flex-start;
  flex-wrap: wrap;
  .calendar {
    width: 300px;
    height: 360px;
    padding: 10px;
    border: 1px solid #ebeef5;
    margin-bottom: 10px;
    :deep(.el-calendar__header) {
      justify-content: center;
    }
    :deep(.el-calendar__button-group) {
      display: none;
    }
    :deep(.el-calendar__body) {
      padding: 12px 20px;
    }

    :deep(.el-calendar-table) {
      thead th {
        width: 30px;
        height: 30px;
        padding: 0;
        text-align: center;
        line-height: 40px;
        color: #979797;
        background-color: #fff !important;
        font-size: 14px;
        font-family: Microsoft Yahei;
      }
      td {
        border: none;
      }
      tr:first-child td {
        border-left: none;
      }
      tr td:first-child {
        border-left: none;
      }
      .current.is-selected {
        background-color: transparent;
      }
      .el-calendar-day {
        height: 100%;
        padding: 0;
        text-align: center;
        line-height: 40px;
        font-size: 14px;
        font-family: Roboto;
        .dateCls {
          height: 100%;
          width: 100%;
          position: relative;
          .labelCls {
            width: 10px;
            height: 10px;
            line-height: 10px;
            background-color: #7495e6;
            color: #fff;
            font-size: 6px;
            text-align: center;
            position: absolute;
            right: 0;
            top: 0;
            div {
              transform: scale(0.6);
            }
          }
        }
        .dateCls.startTimeCls {
          background-color: #f1f3fd;
        }
      }
      .el-calendar-day:hover {
        background-color: transparent;
      }
    }
  }
}
</style>
