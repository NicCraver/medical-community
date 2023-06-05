<!-- 
  @description 医共体信息平台门户
  @date 2022/3/24
 -->
<template>
  <div class="sMain">
    <component :is="comName"></component>
    <!-- <residentCenter /> -->
  </div>
</template>

<script>
import residentCenter from '@/views/infomationPlatform/healthRecord/ResidentCenter'
import { getDictCodesList, getDiaCodesList } from '@/utils/dictCodes.js'
import { getPrivacyConfig } from 'api/infomationPlatform/healthRecord.js'

export default {
  name: 'sMain',
  components: {
    residentCenter,
  },
  data() {
    return {
      comName: '',
    }
  },
  computed: {},
  created() {
    this.getPrivacyConfig()
    getDictCodesList()
    getDiaCodesList()
  },
  methods: {
    async getPrivacyConfig() {
      try {
        let res = await getPrivacyConfig()
        let result = res.result
        result.illPrivacies = JSON.parse(result.illPrivacies)
        result.unSendMessageUsers = JSON.parse(result.unSendMessageUsers)
        this.$store.commit('base/SET_PRIVACY_CONFIG', result)
      } catch (error) {
      } finally {
        this.comName = residentCenter
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.sMain {
  height: 100vh;
  background-color: #f5f5f5;
}
</style>
