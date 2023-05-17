<!-- 
  @description 标准管理-交换标准-交换标准配置-详情-tab页
  @date 2021/12/30
-->
<template>
  <div class="content">
    <el-descriptions border :column="2" :labelStyle="{width: '120px'}" size="medium">
      <el-descriptions-item label="接口路径">{{data.url}}</el-descriptions-item>
      <el-descriptions-item label="请求类型">{{data.requestType}}</el-descriptions-item>
      <el-descriptions-item label="接口描述" :span="2">{{data.description}}</el-descriptions-item>
    </el-descriptions>
    <p>请求参数</p>
    <el-table border stripe size="small" height="240px" :data="data.requestParams" row-key="id">
      <el-table-column prop="name" label="参数名" width="180"></el-table-column>
      <el-table-column prop="type" label="参数类型" width="100"></el-table-column>
      <el-table-column prop="description" label="参数描述"></el-table-column>
    </el-table>
    <p>响应结果</p>
    <el-table border stripe size="small" height="240px" :data="data.responseData" row-key="id">
      <el-table-column prop="name" label="参数名" width="180"></el-table-column>
      <el-table-column prop="type" label="参数类型" width="100"></el-table-column>
      <el-table-column prop="description" label="参数描述"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
  },
};
</script>

<style lang="scss" scoped>
p {
  font-weight: 700;
  font-size: 16px;
  margin: 16px 0 8px 0;
}
</style>