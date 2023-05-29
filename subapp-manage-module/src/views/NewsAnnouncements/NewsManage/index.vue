<template>
  <div class="NewsManage">
    <ProLayout model="tab" mainBgColor="#F5F5F5" padding="0">
      <template #title>新闻管理</template>
      <template #tab>
        <el-tabs v-model="activeComponent">
          <el-tab-pane
            v-for="item in tabDatas"
            :key="item.label"
            :name="item.component"
            :label="item.label"
          ></el-tab-pane>
        </el-tabs>
      </template>
      <template #main>
        <component :is="activeComponent" :activeComponent="activeComponent" />
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import Published from './Published.vue'
import TemporaryStorage from './TemporaryStorage.vue'

export default {
  components: {
    Published,
    TemporaryStorage,
    ProLayout,
  },
  data() {
    return {
      activeComponent: 'Published',
      tabDatas: [
        {
          label: '已发布',
          component: 'Published',
        },
        {
          label: '暂存',
          component: 'TemporaryStorage',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
// .NewsManage {
// }
</style>
