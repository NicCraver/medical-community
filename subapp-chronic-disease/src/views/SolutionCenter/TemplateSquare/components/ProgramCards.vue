<!--
 * @Author: Nic
 * @Date: 2023-02-15 15:22:01
 * @LastEditTime: 2023-02-23 16:33:42
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/components/ProgramCards.vue
-->
<template>
  <div class="ProgramCards">
    <div v-for="(v, index) in cardData" :key="v.id">
      <ProgramCardItem
        :cardData="v"
        :cardIndex="index"
        @quoteTemplateSuccess="quoteTemplateSuccess"
        @changePage="changePage"
        @refreshData="refreshData"
      />
    </div>
    <!-- <div v-for="(v, index) in cardData" :key="v.id">
      <ProgramCardItem :cardData="v" :cardIndex="index" />
    </div>
    <div v-for="(v, index) in cardData" :key="v.id">
      <ProgramCardItem :cardData="v" :cardIndex="index" />
    </div>
    <div v-for="(v, index) in cardData" :key="v.id">
      <ProgramCardItem :cardData="v" :cardIndex="index" />
    </div>
    <div v-for="(v, index) in cardData" :key="v.id">
      <ProgramCardItem :cardData="v" :cardIndex="index" />
    </div> -->
  </div>
</template>

<script>
import ProgramCardItem from './ProgramCardItem.vue'

export default {
  components: {
    ProgramCardItem,
  },
  props: {
    cardData: {
      type: Array,
    },
  },
  methods: {
    quoteTemplateSuccess() {
      console.log(`8888888888888`,8888888888888)
      this.$emit('quoteTemplateSuccess')
    },
    refreshData() {
      this.$emit('refreshData')
    },
    changePage(row) {
      this.$emit('changePage', row)
    },
  },
}
</script>

<style lang="scss" scoped>
.ProgramCards {
  display: flex;
  flex-wrap: wrap;
}
</style>
