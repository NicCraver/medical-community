<template>
  <div></div>
</template>

<script>
import { followUpAlerts } from '../../api/modules/test'
export default {
  mounted() {
    this.followUpAlerts()
  },
  methods: {
    async followUpAlerts() {
      try {
        const result = await followUpAlerts()
        console.log('result', result)
      } catch (error) {
        console.log('error', error)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
