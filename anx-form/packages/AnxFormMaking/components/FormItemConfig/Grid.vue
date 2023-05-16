<template>
  <div v-if="activeCom.type === 'grid'">
    <el-form>
      <el-form-item label="字段标识">
        <el-input v-model="activeCom.model"></el-input>
      </el-form-item>
      <el-form-item label="栅格间隔">
        <el-input
          type="number"
          v-model.number="activeCom.options.gutter"
        ></el-input>
      </el-form-item>
      <el-form-item label="列配置项">
        <ul>
          <li v-for="(item, index) in activeCom.columns" :key="index">
            <el-input
              type="number"
              placeholder="栅格值"
              size="mini"
              v-model.number="item.span"
            />
          </li>
        </ul>
        <el-button @click="addCol()" type="text">添加列</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'GridConfig',
  props: ['activeCom'],
  methods: {
    addCol() {
      this.activeCom.columns.push({
        span: 12
      });
    }
  }
};
</script>
