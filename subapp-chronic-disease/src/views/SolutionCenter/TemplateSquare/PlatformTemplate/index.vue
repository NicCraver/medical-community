<!--
 * @Author: Nic
 * @Date: 2023-01-31 17:45:29
 * @LastEditTime: 2023-02-24 10:56:36
 * @LastEditors: Nic
 * @Description: 平台模版
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/PlatformTemplate/index.vue
-->
<template>
  <div class="PlatformTemplate">
    <div class="template-items">
      <ProgramCards :cardData="getValTest.rootData" @quoteTemplateSuccess="quoteTemplateSuccess" />
    </div>
  </div>
</template>

<script>
import ProgramCards from '../components/ProgramCards.vue'
export default {
  inject: ['templateData'],
  components: {
    ProgramCards,
  },
  computed: {
    getValTest() {
      return this.templateData()
    },
  },
  watch: {
    templateData(newValue, oldValue) {
      console.log(`this.templateData`, this.templateData)
    },
  },
  mounted() {},
  methods: {
    quoteTemplateSuccess() {
      this.$emit('quoteTemplateSuccess')
    },
    editTemplate(row) {
      console.log(`row`, row)
      this.$router.push({
        name: 'AddPlan', //EditPlan
        query: {
          planId: row.id,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.PlatformTemplate {
  height: 100%;
}
</style>
