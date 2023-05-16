<template>
  <div>
    <el-form-item label="显示类型" v-if="activeCom.type == 'date'">
      <el-select v-model="activeCom.options.type">
        <el-option value="year"></el-option>
        <el-option value="month"></el-option>
        <el-option value="date"></el-option>
        <el-option value="dates"></el-option>
        <el-option value="datetime"></el-option>
        <el-option value="datetimerange"></el-option>
        <el-option value="daterange"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="格式">
      <el-input v-model="activeCom.options.format"></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'DateConfig',
  props: ['activeCom'],
  watch: {
    'activeCom.options.type': {
      handler(newVal) {
        if (!this.activeCom) {
          return;
        }
        const rangeList = ['datetimerange', 'daterange'];
        const map = {
          year: 'yyyy',
          month: 'MM',
          date: 'yyyy-MM-dd',
          dates: 'yyyy-MM-dd',
          datetime: 'yyyy-MM-dd HH:mm:ss',
          datetimerange: 'yyyy-MM-dd HH:mm:ss',
          daterange: 'yyyy-MM-dd'
        };
        this.activeCom.options.format = map[newVal];

        if (rangeList.indexOf(newVal) > -1) {
          this.activeCom.options.defaultValue = null;
        }
      }
    }
  }
};
</script>
