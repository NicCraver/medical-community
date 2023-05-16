<template>
  <div>
    <el-button @click="test">test</el-button>
  </div>
</template>

<script>
import { onCreateUserFromPat } from '../../api/modules/DataMaintenance'
export default {
  methods: {
    async test() {
      try {
        const res = await onCreateUserFromPat()
      } catch (error) {}
    },
  },
}
</script>

<style lang="scss" scoped></style>
