<template>
  <div class="diseaseMedicine height100">
    <el-collapse v-model="activeNames">
      <el-collapse-item
        v-for="(item, index) in diaData"
        :key="index"
        :name="index"
      >
        <template slot="title">
          <div class="title-item title-one overflow-point">{{ item.advices.length }}次</div>
          <div
            class="title-item overflow-point title-two"
            :title="item.drugName || ''"
          >
            {{ item.drugName || "--" }}
          </div>
          <div
            class="title-item overflow-point title-three"
            :title="item.spec || ''"
          >
            {{ item.spec || "--" }}
          </div>
          <div
            class="title-item overflow-point title-four"
            :title="`${item.dosage}${item.dosageUnit} || ''`"
          >
            总剂量：{{ `${item.dosage || "--"}${item.dosageUnit || ""}` }}
          </div>
        </template>
        <el-table ref="singleTable" height="100%" :data="item.advices" max-height="550">
          <el-table-column label="序号" type="index" width="50">
          </el-table-column>
          <el-table-column
            class="overflow-point"
            v-for="(item, index) in columns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :fixed="item.fixed"
            :align="item.align || 'center'"
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'oprate'">
                <el-button type="text" @click="handleClick(scope.row)"
                  >查看</el-button
                >
              </template>
              <template
                v-else-if="item.prop === 'startTime' || item.prop === 'endTime'"
              >
                {{
                  scope.row[item.prop].indexOf(" ") > -1
                    ? scope.row[item.prop].split(" ")[0]
                    : scope.row[item.prop] || ""
                }}
              </template>
              <template
                v-else-if="item.prop === 'onceDosage' || item.prop === 'dosage'"
                >{{ scope.row[item.prop]
                }}{{ scope.row.dosageUnit || "" }}</template
              >
              <template v-else-if="item.prop === 'treatType'">
                <span v-if="scope.row[item.prop] === 'outpatient'">门诊</span>
                <span v-else-if="scope.row[item.prop] === 'inpatient'">住院</span>
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import { queryAdviceLisgByDiag } from "@/api/modules/healthEvent/index.js";
import { mapGetters } from "vuex";

export default {
  name: "diseaseMedicine",
  props: {
    // 导航传过来的内容
    navBarObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      activeNames: [],
      columns: [
        { prop: "", label: "来源", width: "120" },
        { prop: "startTime", label: "开始时间", width: "120" },
        { prop: "endTime", label: "结束时间", width: "120" },
        { prop: "days", label: "用药天数", width: "120" },
        { prop: "onceDosage", label: "单次剂量", width: "120" },
        { prop: "freq", label: "频次", width: "120" },
        { prop: "zsyjl", label: "剂量合计", width: "120" },
        { prop: "oprate", label: "就诊信息", width: "80" },
      ],
      diaData: [],
    };
  },
  computed: {
    ...mapGetters({
      personalArchInfo: "base/personalArchInfo",
    }),
  },
  watch: {
    navBarObj: {
      handler(val) {
        this.queryAdviceLisgByDiag();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 查看
    handleClick(row) {},
    // 查询医嘱信息
    async queryAdviceLisgByDiag() {
      try {
        let archiveInfo = this.personalArchInfo || {};
        let certId = archiveInfo.personalArchiveInfo
          ? archiveInfo.personalArchiveInfo.certId || ""
          : "";
        let certType = archiveInfo.personalArchiveInfo
          ? archiveInfo.personalArchiveInfo.certType || ""
          : "";
        let params = {
          diagCode: this.navBarObj.serialNumber || "",
          certId,
          certType,
        };
        let res = await queryAdviceLisgByDiag(params);
        if (res.code === 0) {
          console.log("疾病用药的医嘱信息：", res);
          this.diaData = res.result;
        }
      } catch (error) {}
    },
  },
};
</script>

<style lang="scss" scoped>
.diseaseMedicine {
  overflow-y: auto;
  .title-item {
    margin-right: 20px;
    font-size: 16px;
    color: rgba(16, 16, 16, 100);
    font-family: SourceHanSansSC-regular;
    font-weight: normal;
  }
  .title-one {
    width: 50px;
    background-color: #e5e9f1;
    font-family: Roboto;
    text-align: center;
  }
  .title-two {
    max-width: 30%;
    margin-right: 40px;
    color: rgba(51, 51, 51, 100);
    font-family: SourceHanSansSC-medium;
    // font-weight: 600;
  }
  .title-three {
    max-width: 20%;
    margin-right: 50px;
  }
  .title-four {
    max-width: 20%;
  }
  .el-table {
    color: #333333;
    .el-table__cell {
      padding: 4px 0;
    }
    ::v-deep th {
      padding: 7px 0;
    }
    ::v-deep td {
      padding: 4px 0;
    }
    ::v-deep thead th {
      background-color: #fff !important;
      color: #919191;
    }
  }

  ::v-deep.el-collapse-item__content {
    padding-bottom: 0;
  }
  ::v-deep.el-collapse {
    border: none !important;
  }
  ::v-deep.el-collapse-item {
    box-shadow: none;
    border: none;
    margin-bottom: 10px;
  }
  ::v-deep.el-collapse-item__wrap {
    border-bottom: none;
  }

  ::v-deep.el-collapse-item__header {
    background: #f7f7f7;
    height: 40px;
    line-height: 40px;
    color: #333;
    font-size: 16px;
    box-shadow: none;
    margin: 0;
    padding-left: 0;
  }
}
</style>