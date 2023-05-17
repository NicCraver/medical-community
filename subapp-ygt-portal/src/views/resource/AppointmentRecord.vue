<!-- 
  @description 统一资源管理后台-预约管理-预约记录
  @date 2021/10/15
 -->
<template>
  <div class="appointment-record">
    <div class="protal-title">预约记录</div>
    <div class="protal-main">
      <el-card>
        <!-- 搜索行 -->
        <el-row class="search">
          <span>医院名称：</span>
          <el-select v-model="searchForm.name" size="small">
            <el-option v-for="item in searchNameData" :key="item.id" :value="item.id" :label="item.value"></el-option>
          </el-select>
          <span>一级科室：</span>
          <el-select v-model="searchForm.department1" size="small">
            <el-option v-for="item in searchDepartmentData1" :key="item.id" :value="item.id" :label="item.value"></el-option>
          </el-select>
          <span>二级科室：</span>
          <el-select v-model="searchForm.department2" size="small">
            <el-option v-for="item in searchDepartmentData2" :key="item.id" :value="item.id" :label="item.value"></el-option>
          </el-select>
        </el-row>
        <el-row class="search">
          <span>医生：</span>
          <el-select v-model="searchForm.doctor" size="small">
            <el-option v-for="item in doctorData" :key="item.id" :value="item.id" :label="item.value"></el-option>
          </el-select>
          <span>就诊卡号：</span>
          <el-input placeholder="就诊卡号" size="small" v-model="searchForm.cardNumber"></el-input>
          <span>服务类型：</span>
          <el-select v-model="searchForm.serviceType" size="small">
            <el-option v-for="item in serviceTypeData" :key="item.id" :value="item.id" :label="item.value"></el-option>
          </el-select>
        </el-row>
        <el-row class="search">
          <span>门诊类型：</span>
          <el-select v-model="searchForm.outpatientType" size="small">
            <el-option v-for="item in outpatientTypeData" :key="item.id" :value="item.id" :label="item.value"></el-option>
          </el-select>
          <span>时间范围：</span>
          <el-date-picker size="small" v-model="searchForm.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          <el-button type="primary">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-row>
        <!-- 操作行 -->
        <el-row class="operate protal-row">
          <el-button icon="iconfont icon-plus">导出</el-button>
          <span class="tip"><i class="iconfont icon-info-circle-fill"></i>已选择 {{multipleSelection.length}} 项</span>
        </el-row>
        <div class="table">
          <el-table border stripe size="small" height="100%" ref="table" :data="tableData" @selection-change="tableSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="order" label="序号" width="55"></el-table-column>
            <el-table-column prop="liushui" label="预约流水号" min-width="160"></el-table-column>
            <el-table-column prop="cardNumber" label="就诊卡号" min-width="120"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="phone" label="联系电话" min-width="120"></el-table-column>
            <el-table-column prop="hospital" label="医院" min-width="120"></el-table-column>
            <el-table-column prop="department1" label="一级科室"></el-table-column>
            <el-table-column prop="department2" label="二级科室" min-width="120"></el-table-column>
            <el-table-column prop="serviceType" label="服务类型"></el-table-column>
            <el-table-column prop="doctor" label="医生"></el-table-column>
            <el-table-column prop="outpatientType" label="门诊类型"></el-table-column>
            <el-table-column prop="time" label="预约时间" min-width="180" sortable></el-table-column>
            <el-table-column label="操作" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="showDetail(row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length" class="fr">
        </el-pagination>
      </el-card>
    </div>

    <show-detail ref="showDetail"></show-detail>
  </div>
</template>

<script>
import ShowDetail from "./appointment/AppointmentRecordShowDetail.vue";

export default {
  components: { ShowDetail },
  data() {
    return {
      searchForm: {
        name: "", //医院名称
        department1: "", //一级科室
        department2: "", //二级科室
        doctor: "", //医生
        cardNumber: "", //就诊卡号
        serviceType: "", //服务类型
        outpatientType: "", //门诊类型
        time: [], //时间范围
      }, //查询条件
      searchNameData: [{ id: "1", value: "医院名称" }], //医院名称下拉列表
      searchDepartmentData1: [{ id: "1", value: "全部一级科室" }], //一级科室下拉列表
      searchDepartmentData2: [{ id: "1", value: "全部二级科室" }], //二级科室下拉列表
      doctorData: [{ id: 1, value: "全部医生" }], //医生下拉列表
      serviceTypeData: [{ id: 1, value: "服务类型" }], //服务类型下拉列表
      outpatientTypeData: [{ id: 1, value: "门诊类型" }], //门诊类型下拉列表
      tableData: [
        {
          order: "1",
          liushui: "M202109110001",
          cardNumber: "61000078",
          cardType: "医保卡",
          name: "居民人",
          phone: "18011234567",
          hospital: "上海市东方医院",
          department1: "内科",
          department2: "内科/呼吸内科",
          serviceType: "门诊预约",
          doctor: "xxx",
          outpatientType: "特需门诊",
          time: "2021-09-12 9:00-10:00",
          state: "-",
          payState: "待支付",
          cost: "-",
          payType: "-",
          payTime: "-",
        },
        {
          order: "2",
          liushui: "M202109110001",
          cardNumber: "61000078",
          name: "居民人",
          phone: "18011234567",
          hospital: "上海市东方医院",
          department1: "内科",
          department2: "内科/呼吸内科",
          serviceType: "门诊预约",
          doctor: "xxx",
          outpatientType: "专家门诊",
          time: "2021-09-12 9:00-10:00",
        },
      ],
      multipleSelection: [], // 表格被选中的内容
      currentPage: 1, //当前页
      pageSize: 10, //每页多少条
    };
  },
  methods: {
    // 重置 button click
    reset() {
      this.searchForm = {
        name: "",
        department1: "",
        department2: "",
        doctor: "",
        id: "",
        serviceType: "",
        outpatientType: "",
        time: "",
      };
    },
    // table 查看详情 button click
    showDetail(row) {
      this.$refs.showDetail.open(row);
    },
    //table 选择项发生变化事件
    tableSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.appointment-record {
  height: 100%;
}
.el-card {
  height: 100%;
  width: 100%;
}
.el-row {
  height: 32px;
  line-height: 32px;
  margin-bottom: 16px;
  padding: 0;
}
.search {
  span,
  .el-button,
  .el-input,
  .el-select,
  .el-date-editor {
    float: left;
  }
  span {
    width: 80px;
    text-align: right;
  }
  .el-input,
  .el-select {
    width: 220px;
    margin-right: 32px;
  }
  .el-date-editor {
    margin-right: 32px;
  }
}
.operate .tip {
  width: calc(100% - 92px);
}
.table {
  height: calc(100% - 192px - 64px);
}
.el-pagination {
  margin-top: 16px;
}
</style>