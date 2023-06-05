<template>
  <div class="ActivityDetails">
    <ProLayout model="tab" mainBgColor="#F5F5F5" margin="0">
      <template #title>详情</template>
      <template #tab>
        <el-tabs v-model="activeComponent" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in tabDatas"
            :key="item.label"
            :name="item.component"
            :label="item.label"
          ></el-tab-pane>
        </el-tabs>
      </template>
      <template #main>
        <div style="background-color: #fff; height: 100%">
          <router-view />
        </div>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
// import RegistrationWriteOff from './RegistrationWriteOff.vue'
// import WriteOffRecord from './WriteOffRecord.vue'
export default {
  components: {
    ProLayout,
    // RegistrationWriteOff,
    // WriteOffRecord,
  },
  data() {
    return {
      activeComponent: 'tagInfo',
      tabDatas: [
        {
          label: '标签信息',
          component: 'tagInfo',
        },
        {
          label: '标签数据',
          component: 'tagData',
        },
      ],
    }
  },
  watch: {
    '$route.name': {
      immediate: true,
      handler(n, o) {
        if (n !== o) {
          console.log(`n`, n)
          this.activeComponent = n
        }
      },
    },
  },
  methods: {
    handleClick(e) {
      console.log(`this.$route`, this.$route.query)
      let activePaths = window.location.pathname.split('/')
      if (e.name !== activePaths[activePaths.length - 1]) {
        this.$router.push({
          name: e.name,
          query: this.$route.query,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
