<template>
  <el-table
    ref="singleTable"
    highlight-current-row
    style="width: 100%"
    class="middle-table-single"
    :data="tableDatas"
    :span-method="objectSpanMethod"
    element-loading-text="列表正在加载中"
    :cell-class-name="cellStyle"
    :row-class-name="tableRowClassName"
  >
    <el-table-column
      :show-overflow-tooltip="item.prop !== 'czdlx'"
      v-for="(item, index) in tableColumn"
      :key="index"
      :prop="item.prop"
      :min-width="item.width"
      :label="item.label"
      :fixed="item.fixed === true"
    >
      <template slot-scope="scope">
        <!-- 提交状态下 不可编辑  -->
        <template v-if="item.prop == 'czdIdC'">
          <span class="czdIdCellCls"></span>
          <span>{{ scope.row[item.prop] }}</span>
        </template>
        <template v-else-if="item.prop === 'bunching'">
          <span :class="scope.row.groupNoCls"></span>
        </template>
        <template v-else-if="item.prop === 'czdlx'">
          <specialDrugShow :data="scope.row"></specialDrugShow>
        </template>
        <template v-else-if="item.prop === 'yzxmlbdm'">
          <span
            v-codeTransform
            code="CV06.00.229"
            :val="scope.row.yzxmlbdm"
          ></span>
        </template>
        <!-- 单次剂量 + 单位 -->
        <template v-else-if="item.prop === 'mcsyjl'">
          {{ scope.row[item.prop] }} {{ scope.row["mcsyjldw"] || "" }}
        </template>
        <!-- 数量 + 单位 -->
        <template v-else-if="item.prop === 'fysl'">
          {{ scope.row[item.prop] }} {{ scope.row["fysldw"] || "" }}
        </template>
        <!-- 天数 -->
        <template v-else-if="item.prop === 'dlczxzts'">
          {{ scope.row[item.prop] }}天
        </template>
        <template v-else>
          <span>{{ scope.row[item.prop] }}</span>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script type="text/ecmascript-6">
const tableChmColumn = [
  {
    prop: "czdIdC",
    label: "处方",
    width: 54,
  },
  {
    prop: "yzxmmc",
    label: "名称",
    width: 186,
  },
  {
    prop: "zyjzfdm",
    label: "煎法",
    width: 56,
  },
  {
    prop: "fybzge",
    label: "规格",
    width: 162,
  },

  {
    prop: "mcsyjl",
    label: "单次剂量",
    width: 96,
  },
  {
    prop: "yypddm",
    label: "频次",
    width: 96,
  },
  {
    prop: "yytjmc",
    label: "用法",
    width: 96,
  },
  {
    prop: "cfdts",
    label: "剂数",
    width: 96,
  },
  {
    prop: "fysl",
    label: "总量",
    width: 83,
  },
  {
    prop: "bzxx",
    label: "备注",
  },
];

const tableWestColumn = [
  {
    prop: "czdIdC",
    label: "处方",
    width: 54,
  },
  {
    prop: "yzxmmc",
    label: "名称",
    width: 230,
  },
  {
    prop: "fybzge",
    label: "规格",
    width: 115,
  },
  /* // 测试用
  {
    prop: "yzzh",
    label: "yzzh",
    width: 60,
  }, */
  {
    prop: "bunching",
    label: "同组",
    width: 60,
  },
  {
    prop: "mcsyjl",
    label: "单次剂量",
    width: 96,
  },
  {
    prop: "yypddm",
    label: "频次",
    width: 96,
  },
  {
    prop: "yytjmc",
    label: "用法",
    width: 96,
  },
  {
    prop: "dlczxzts",
    label: "天数",
    width: 96,
  },
  {
    prop: "fysl",
    label: "数量",
    width: 96,
  },
  {
    prop: "czdlx",
    label: "特殊药品",
    width: 120,
  },
];

const tableNoDrugColumn = [
  {
    prop: "czdIdC",
    label: "处方",
    width: 67,
  },
  {
    prop: "yzxmmc",
    label: "名称",
    width: 387,
  },
  {
    prop: "mcsyjl",
    label: "单次数量",
    width: 105,
  },
  {
    prop: "yypddm",
    label: "频次",
    width: 183,
  },

  {
    prop: "dlczxzts",
    label: "天数",
    width: 101,
  },
  {
    prop: "fysl",
    label: "数量",
    width: 77,
  },
  {
    prop: "yzxmlbdm",
    label: "类型",
  },
];

import specialDrugShow from "@/views/healthRecord/components/healthEvent/components/medicalTreatmentRecord/components/rpModule/specialDrugShow.vue";

export default {
  props: {
    // 健康档案
    dType: {
      type: String,
    },
    dData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      tableColumn: [],
      tableLoading: false,
      tableDatas: [],
      RpRowArr: [],
      rpPosition: 0,
      recipeGroupList: [],
    };
  },
  components: { specialDrugShow },
  watch: {
    dType: {
      //深度监听,可监听到对象、数组的变化
      handler(val) {
        switch (val) {
          case "chm":
            this.tableColumn = tableChmColumn;
            break;
          case "west":
            this.tableColumn = tableWestColumn;
            break;
          case "noDrug":
            this.tableColumn = tableNoDrugColumn;
            break;
          default:
            break;
        }
      },
      deep: true,
      immediate: true,
    },
    dData: {
      //深度监听,可监听到对象、数组的变化
      handler(val) {
        this.getRpRowArr(val);
        this.recipeGroupList = this.updateAllRecipe(val, "czdId");
        // console.log("this.recipeGroupList", this.recipeGroupList);
        this.setChuFangName();
        this.setBunchingCls(val);
        this.tableDatas = val;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      return row.borderFlag;
    },
    setChuFangName() {
      this.recipeGroupList.forEach((item, index) => {
        let { value } = item;
        value.forEach((element) => {
          element.czdIdC = "No." + (index + 1);
        });
      });
    },
    // 设置成组样式
    setBunchingCls(dataList) {
      // var list = [];
      // var filterList = [];
      // let groupList = dataList.map((item) => {
      //   return item.yzzh;
      // });
      // debugger
      // groupList = unique(groupList); //数组去重
      // groupList = groupList.filter((item, index) => {
      //   // 数组去undefind
      //   return item !== undefined;
      // });
      // console.log("groupList:::", groupList);
      // function unique(arr) {
      //   return Array.from(new Set(arr));
      // }

      // groupList.forEach((item, index) => {
      //   //遍历 成map结构
      //   // list = [];
      //   filterList = dataList.filter((sonItem, sonIde) => {
      //     return item === sonItem.yzzh;
      //   });
      //   list.push({
      //     key: item,
      //     value: filterList,
      //   });
      // });
      // this.groupNoList = list;
      /* // 排序--无效
      this.recipeGroupList.forEach((item, index) => {
        let itemList = item.value.sort((a, b) => {
          return b.yzzh - a.yzzh;
        });
        this.$set(item, "value", itemList);
      }); */
      this.recipeGroupList.forEach((item, index) => {
        let itemList = item.value;
        let borderFlag = Number(index) % 2 == 0 ? "single-row" : "double-row"; //加颜色标识
        // 只有一条数据的组 groupNoCls 是空
        // if (itemList.length === 1) {
        //   itemList[0].borderFlag = borderFlag; //加颜色标识
        //   itemList[0].groupNoCls = "";
        // } else {
        //   itemList.forEach((sonItem, sonIndex) => {
        //     sonItem.borderFlag = borderFlag; //加颜色标识
        // yzzh相同的数据加成组标识
        /* if (sonIndex === 0) {
              sonItem.groupNoCls = sonItem.yzzh ? "bunchingUp" : "";
            } else if (sonIndex === itemList.length - 1) {
              sonItem.groupNoCls = sonItem.yzzh ? "bunchingDown" : "";
            } else {
              sonItem.groupNoCls = sonItem.yzzh ? "bunchingCenter" : "";
            } */
        //加颜色标识
        itemList.forEach((sonItem) => {
          sonItem.borderFlag = borderFlag;
        });
        //修改成成组数据
        let arr = this.updateAllRecipe(itemList, "yzzh");
        // console.log("arrarrarrarr:", arr);
        arr.forEach((val, key) => {
          if (val.value.length > 1) {
            // yzzh相同的数据加成组标识
            val.value.forEach((vv, kk) => {
              if (vv.yzzh) {
                if (kk === 0) {
                  vv.groupNoCls = "bunchingUp";
                } else if (kk === val.value.length - 1) {
                  vv.groupNoCls = "bunchingDown";
                } else {
                  vv.groupNoCls = "bunchingCenter";
                }
              }
            });
          }
        });
      });
    },
    //处理成组样式
    cellStyle(rowWrap, a, b, c) {
      //   console.log(rowWrap, a, b, c);
      let { column, row } = rowWrap;
      let { align, property } = column;
      let cssZebras = "";
      if (property === "czdId") {
        cssZebras = this.setZebras(row);
        cssZebras += " orderItemNameCls"; // 免费处方 处方名称 字体变蓝
      }

      // console.log("斑马纹", cssZebras);
      return cssZebras;
    },
    //设置医嘱名称斑马纹
    //第一张处方背景色号为：#F1F1F2  ZebrasClsOdd
    // 第二张处方背景色号为：#DCEEF8 ZebrasClsEven
    // 第三张处方背景色号为：#F1F1F2
    // 第四张处方背景色号为：#DCEEF8
    setZebras(row = {}) {
      let { czdId } = row;
      // console.log("this.recipeGroupList", this.recipeGroupList, czdId);
      let rIndex = this.recipeGroupList.findIndex((item) => item.key === czdId);
      // console.log("rIndex", rIndex);
      return rIndex % 2 === 0 ? "ZebrasClsEven" : "ZebrasClsOdd";
    },
    //更新 整处方列表
    updateAllRecipe(tableDatas, czdId) {
      let receipIdList = this.getUniqueRecipeIdList(tableDatas, czdId);
      // console.log("receipIdList:::", receipIdList);
      let LIST = this.orgnazatReceipIdList(receipIdList, tableDatas, czdId);
      // console.log("LIST", LIST);
      return LIST;
    },
    //去重之后的  recipeId 列表 变成整处方格式
    orgnazatReceipIdList(uMajorIdList, tableDatas, czdId) {
      let allReceiptList = [];
      uMajorIdList.forEach((item, index) => {
        //遍历 成map结构
        let filterList = tableDatas.filter((sonItem, sonIde) => {
          return item === sonItem[czdId];
        });
        allReceiptList.push({
          key: item,
          value: filterList,
        });
      });
      return allReceiptList;
    },
    //获取去重之后的 recipeId 列表
    getUniqueRecipeIdList(tableDatas, czdId) {
      let receipIdList = tableDatas.map((item) => {
        return item[czdId];
      });
      receipIdList = receipIdList.filter((item) => {
        return typeof item != "undefined" && item != "" && item != null;
      });
      return Array.from(new Set(receipIdList));
    },
    getRpRowArr(list = []) {
      let tableDatas = list;
      this.rpPosition = 0;
      this.RpRowArr = [];
      tableDatas.forEach((item, index) => {
        item.index = index;
        if (index === 0) {
          this.RpRowArr.push(1);
        } else {
          if (item["czdId"] === tableDatas[index - 1]["czdId"]) {
            this.RpRowArr[this.rpPosition] += 1;
            this.RpRowArr.push(0);
          } else {
            this.RpRowArr.push(1);
            this.rpPosition = index;
          }
        }
      });
    },
    //处方合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // console.log("RpRowArr::::", this.RpRowArr, rowIndex);
        const _row = this.RpRowArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
      return false;
    },
  },
};
</script>

<style scoped lang="scss">
.el-table {
  // 看这里！！！！！！！！！！！！！！！！！！！！！！！！！！！！
  // 深度选择器，去除默认的padding
  ::v-deep th {
    padding: 7px 0;
    background-color: #fff !important;
    color: rgba(145, 145, 145, 100);
    font-size: 14px;
    text-align: left;
    font-family: Microsoft Yahei;
  }
  ::v-deep td {
    padding: 7px 0;
    color: #333333 !important;
    // background-color: #fff;
  }
  ::v-deep th.el-table__cell > .cell {
    font-weight: 600;
  }

  ::v-deep .el-table__body,
  .el-table__footer,
  .el-table__header {
    border-collapse: collapse !important;
  }
}
::v-deep .single-row {
  border-left: 3px solid #96dfc4;
}

::v-deep .double-row {
  border-left: 3px solid #95b1f0;
}

// 斑马纹
::v-deep .ZebrasClsOdd .czdIdCellCls {
  display: inline-block;
  height: 100%;
  width: 3px;
  background-color: #96dfc4;
  position: absolute;
  top: 0;
  left: 0;
}

// 斑马纹
::v-deep .ZebrasClsEven .czdIdCellCls {
  display: inline-block;
  height: 100%;
  width: 3px;
  background-color: #95b1f0;
  position: absolute;
  top: 0;
  left: 0;
}

// 斑马纹
// ::v-deep .ZebrasClsOdd {
//   background-color: #f1f1f2;
// }

// 斑马纹
// ::v-deep .ZebrasClsEven {
//   background-color: #dceef8;
// }

.orderItemNameCls {
  position: relative;
}

.bunchingUp {
  display: inline-block;
  color: $l-color-primary;

  &::after {
    content: "┓";
  }
}

.bunchingCenter {
  display: inline-block;
  color: $l-color-primary;

  &::after {
    content: "┫";
  }
}

.bunchingDown {
  color: $l-color-primary;
  display: inline-block;

  &::after {
    content: "┛";
  }
}
</style>
