<!--
  @description 健康档案共享调阅-统计分析
  @date 2022/08/03
-->
<template>
  <div class="monitorStatistics">
    <ProLayout mainBgColor="#F5F5F5" padding="0" margin="10">
      <template #title>统计分析</template>
      <template #main>
        <el-card>
          <ProTable>
            <template #header>
              <el-input
                placeholder="姓名/身份证号"
                v-model="queryParams.keyword"
                @keyup.enter.native="getList"
                clearable
              ></el-input>
              <el-select
                placeholder="医疗机构名称"
                v-model="queryParams.yljgmc"
                filterable
                clearable
              >
                <el-option
                  v-for="(item, index) in hospitalList"
                  :key="index"
                  :value="item.CODE"
                  :label="item.NAME"
                ></el-option>
              </el-select>
              <el-select
                placeholder="统筹区"
                v-model="queryParams.sstcq"
                filterable
                clearable
              >
                <el-option
                  v-for="(item, index) in cityList"
                  :key="index"
                  :value="item.CODE"
                  :label="item.NAME"
                ></el-option>
              </el-select>
              <el-select placeholder="展示类型" v-model="type">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
              <el-date-picker
                v-model="queryTime"
                type="datetimerange"
                start-placeholder="结算开始日期"
                end-placeholder="结算结束日期"
                :default-time="['08:00:00', '20:00:00']"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </template>
            <template #actions>
              <el-button type="primary" @click="searchFuc">搜索</el-button>
              <el-button plain @click="reset">重置</el-button>
            </template>
            <el-table
              ref="table"
              v-adaptive="{ bottomOffset: 67 }"
              height="0"
              :data="monitorStatisticsList"
              v-loading="loading"
              border
            >
              <el-table-column
                label="序号"
                prop="indexNum"
                width="50"
              ></el-table-column>
              <el-table-column
                v-for="(item, index) in columnList"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :align="item.align || 'left'"
                :header-align="item.headerAlign || 'left'"
                :fixed="item.fixed || false"
              >
                <template slot-scope="{ row }">
                  <template v-if="item.prop === 'patName'">
                    {{ personalNamePrivacy(row.patName) }}
                  </template>
                  <template v-else-if="item.prop === 'patSex'">
                    {{ row.patSex == "1" ? "男" : "女" }}
                  </template>
                  <template v-else-if="item.prop === 'idNo'">
                    {{ personalIdPrivacy(row.idNo) }}
                  </template>
                  <template
                    v-else-if="
                      item.prop === 'sfyBasy' || item.prop === 'sfyDzbl'
                    "
                  >
                    {{ staObj[row[item.prop]] }}
                  </template>
                  <template v-else>
                    {{ row[item.prop] }}
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[20, 50, 100, 200]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </ProTable>
        </el-card>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from "anx-vue";
import ProTable from "@/components/ProTable/index.vue";
import { getStatisticsList } from "api/infomationPlatform/healthRecord.js";
import { mapGetters } from "vuex";
import { deepClone } from "../../../utils/utils";

let columnListInit = [
  {
    prop: "yljgmc",
    label: "医疗机构名称",
    width: "150",
  },
  {
    prop: "yljgdm",
    label: "医疗机构代码",
    width: "150",
  },
  {
    prop: "sstcq",
    label: "所属统筹区",
    width: "150",
  },
  {
    prop: "jzlsh",
    label: "就诊流水号",
    width: "150",
  },
  {
    prop: "bah",
    label: "病案号",
    width: "120",
  },
  {
    prop: "jssj",
    label: "结算时间",
    width: "160",
  },
  {
    prop: "patName",
    label: "姓名",
    width: "80",
  },
  {
    prop: "patSex",
    label: "性别",
    width: "70",
  },
  {
    prop: "age",
    label: "年龄",
    width: "80",
  },
  {
    prop: "idNo",
    label: "身份证号",
    width: "180",
  },
  {
    prop: "rysj",
    label: "入院时间",
    width: "160",
  },
  {
    prop: "cysj",
    label: "出院时间",
    width: "160",
  },
];
export default {
  name: "monitorStatistics",
  components: {
    ProLayout,
    ProTable,
  },
  data() {
    return {
      queryParams: {}, // 查询请求参数
      queryTime: [], //创建日期
      type: "0",
      typeList: [
        {
          label: "病案首页",
          value: "0",
        },
        {
          label: "电子病历",
          value: "1",
        },
      ],
      hospitalList: [], //医院机构列表
      cityList: [], //统筹区列表
      // 是否
      staObj: {
        0: "无",
        1: "有",
      },
      columnList: [],
      monitorStatisticsList: [], //统分析列表
      loading: false,
      pageNum: 1, //当前页数
      pageSize: 20, //每页条数
      total: 0, //总条数
    };
  },
  computed: {
    ...mapGetters({
      personalNamePrivacy: "base/personalNamePrivacy",
      personalIdPrivacy: "base/personalIdPrivacy",
    }),
  },
  watch: {
    type: {
      handler(val) {
        let columnListInits = deepClone(columnListInit);
        if (val === "0") {
          this.columnList = columnListInits.concat([
            {
              prop: "sfyBasy",
              label: "病案首页",
              width: "120",
              fixed: "right",
            },
          ]);
        } else if (val === "1") {
          this.columnList = columnListInits.concat([
            {
              prop: "sfyDzbl",
              label: "电子病历",
              width: "120",
              fixed: "right",
            },
          ]);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.getHosList();
    this.getList();
  },
  methods: {
    // 查询医疗机构、统筹区列表
    getHosList() {
      getHospitalList({
        pageNum: 1,
        pageSize: 1000,
        status: "Y",
      })
        .then((res) => {
          console.log("机构跟统筹区列表：", res.result);
          this.hospitalList = res.result?.YLJGMC;
          this.cityList = res.result?.SSTCQ;
        })
        .catch(() => {});
    },
    // 查询统计分析列表
    getList() {
      this.queryParams.jssjStartTime = "";
      this.queryParams.jssjEndTime = "";
      if (this.queryTime && this.queryTime.length > 0) {
        this.queryParams.jssjStartTime = this.queryTime[0];
        this.queryParams.jssjEndTime = this.queryTime[1];
      }
      this.queryParams.pageNum = this.pageNum;
      this.queryParams.pageSize = this.pageSize;
      this.loading = true;
      getStatisticsList(this.queryParams)
        .then((res) => {
          console.log("统计分析：", res);
          let records = res.result;
          for (let i in records) {
            records[i].indexNum =
              Number(i) +
              1 +
              (Number(this.pageNum) - 1) * Number(this.pageSize);
          }
          this.monitorStatisticsList = records;
          this.total = res.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    searchFuc() {
      this.pageNum = 1;
      this.getList();
    },
    // 重置
    reset() {
      this.queryParams = {};
      this.queryTime = null;
      this.pageNum = 1;
      this.pageSize = 10;
      this.getList();
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
  },
};
</script>

<style src="@/assets/css/infomationPlatform.css" scoped></style>
<style lang="scss" scoped>
.monitorStatistics {
  height: calc(100% - 50px);
  padding: 10px;
  .el-card {
    height: 100%;
    width: 100%;
    ::v-deep .batch-actions {
      margin: 0;
    }
    .el-date-editor {
      width: auto !important;
    }
  }
}
</style>