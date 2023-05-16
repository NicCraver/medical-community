<!--
 * @Author: Nic
 * @Date: 2023-01-31 17:45:04
 * @LastEditTime: 2023-02-23 15:26:10
 * @LastEditors: Nic
 * @Description: 草稿栏
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/DraftColumn/index.vue
-->
<template>
  <div class="DraftColumn">
    <div class="template-items" v-if="getValTest.draftData && getValTest.draftData.length !== 0">
      <ProgramCards :cardData="getValTest.draftData" />
    </div>
    <div v-else class="empty">
      <div>
        <img src="@/assets/empty.png" alt="" />
      </div>
      <div>未检索到符合条件方案</div>
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
  mounted() {},
  methods: {
    editTemplate(row) {
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
.DraftColumn {
  height: 100%;
  .empty {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(141, 148, 159, 1);
    font-size: 14px;
    flex-direction: column;
  }
}
</style>
