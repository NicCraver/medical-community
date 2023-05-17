<!-- 
  @description 统一资源管理后台-预约管理-预约记录-查看详情
  @date 2021/10/19
 -->
<template>
  <el-dialog title="详情" :visible.sync="isVisible" :before-close="close" :close-on-click-modal="false" class="show-detail">
    <el-descriptions labelClassName="label" :column="2" :colon="false">
      <el-descriptions-item label="预约流水号" :span="2">{{data.liushui}}</el-descriptions-item>
      <el-descriptions-item label="就诊人信息" label-class-name="bold" :span="2"></el-descriptions-item>
      <el-descriptions-item label="姓名">{{data.name}}</el-descriptions-item>
      <el-descriptions-item label="联系电话">{{data.phone}}</el-descriptions-item>
      <el-descriptions-item label="就诊卡类型">{{data.cardType}}</el-descriptions-item>
      <el-descriptions-item label="就诊卡号">{{data.cardNumber}}</el-descriptions-item>
      <el-descriptions-item label="预约信息" label-class-name="bold" :span="2"></el-descriptions-item>
      <el-descriptions-item label="医院">{{data.hospital}}</el-descriptions-item>
      <el-descriptions-item label="一级科室">{{data.department1}}</el-descriptions-item>
      <el-descriptions-item label="二级科室">{{data.department2}}</el-descriptions-item>
      <el-descriptions-item label="门诊类型">{{data.outpatientType}}</el-descriptions-item>
      <el-descriptions-item label="医生">{{data.doctor}}</el-descriptions-item>
      <el-descriptions-item label="预约时间">{{data.time}}</el-descriptions-item>
      <el-descriptions-item label="就诊状态" :span="2">{{data.state}}</el-descriptions-item>
      <el-descriptions-item label="支付状态">{{data.payState}}</el-descriptions-item>
      <el-descriptions-item label="费用">{{data.cost}}</el-descriptions-item>
      <el-descriptions-item label="支付类型">{{data.payType}}</el-descriptions-item>
      <el-descriptions-item label="支付时间">{{data.payTime}}</el-descriptions-item>
    </el-descriptions>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      isVisible: false,
      data: {},
    };
  },
  methods: {
    open(data) {
      this.isVisible = true;
      this.data = data;
    },
    close() {
      this.isVisible = false;
      this.data = {};
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .label {
  width: 100px;
}
::v-deep .bold {
  font-weight: 700;
}
</style>