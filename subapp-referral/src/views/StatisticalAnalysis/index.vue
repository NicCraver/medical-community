<template>
  <div class="ReviewList">
    <ProLayout mainBgColor="#F5F5F5" padding="0" model="tab">
      <template #title>统计分析</template>
      <template #tab>
        <el-tabs v-model="activeComponent">
          <el-tab-pane
            v-for="(item, index) in tabList"
            :key="index"
            :label="item.label"
            :name="item.name"
          >
          </el-tab-pane>
        </el-tabs>
      </template>
      <template #main>
        <component :is="activeComponent" />
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from "anx-vue";
import Comprehensive from "./Comprehensive";
import Workload from "./Workload";
import Patient from "./Patient";
import DeptWorkload from "./DeptWorkload";
import AdmissionsProsonCounts from "./AdmissionsProsonCounts";

export default {
  name: "ReviewList",
  components: {
    ProLayout,
    Comprehensive,
    Workload,
    Patient,
    DeptWorkload,
    AdmissionsProsonCounts,
  },
  data() {
    return {
      activeComponent: "Comprehensive",
      tabList: [
        {
          name: "Comprehensive",
          label: "转诊综合统计",
        },
        {
          name: "Workload",
          label: "医生工作量统计",
        },
        {
          name: "Patient",
          label: "转诊患者统计",
        },
        {
          name: "DeptWorkload",
          label: "转诊科室工作量统计",
        },
        {
          name: "AdmissionsProsonCounts",
          label: "接诊人次统计",
        },
      ],
    };
  },
  methods: {},
};
</script>