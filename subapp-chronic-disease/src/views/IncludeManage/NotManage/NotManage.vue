<template>
  <div class="ReviewInclusion">
    <ProLayout model="title">
      <template #title>暂不管理</template>
      <template #main>
        <IusionTable joinFlg="N" />
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import IusionTable from '../components/IusionTable.vue'
export default {
  components: {
    ProLayout,
    IusionTable,
  },
}
</script>
