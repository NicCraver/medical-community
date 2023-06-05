<template>
  <el-form
    :disabled="mode === 'check'"
    label-width="100px"
    class="tag-form"
    :model="tagDetail"
    :rules="rules"
    ref="elForm"
  >
    <el-form-item label="展示名称" prop="tagShowDesc">
      <el-input placeholder="展示名20个字符以内" v-model="tagDetail.tagShowDesc" maxlength="20" />
      <div class="tips">不超过20个字符，可输入中英文、数字，无符号限制。</div>
    </el-form-item>
    <el-form-item label="标签名称" prop="tagDesc">
      <el-input
        placeholder="请输入内容"
        v-model="tagDetail.tagDesc"
        :disabled="mode !== 'add'"
        maxlength="20"
      >
        <template slot="prepend">Tag</template>
      </el-input>
      <el-switch
        v-model="tagDetail.status"
        v-if="mode !== 'add'"
        class="abs-switch"
        :active-value="0"
        :inactive-value="1"
      ></el-switch>
      <div class="tips">不超过20个字符。创建后，标签名称不可修改。</div>
    </el-form-item>
    <el-form-item label="标签描述">
      <el-input placeholder="请输入标签描述，最多20个字符" v-model="tagDetail.description" maxlength="20" />
    </el-form-item>
    <el-form-item label="所属科室" prop="deptId">
      <el-cascader
        v-model="tagDetail.deptId"
        filterable
        :options="deptData"
        placeholder="科室名称"
      />
    </el-form-item>
    <el-form-item label="标签状态"  v-if="mode === 'add'">
      <el-switch
        v-model="tagDetail.status"
        :active-value="0"
        :inactive-value="1"
      ></el-switch>
    </el-form-item>
  </el-form>
</template>

<script>
import { getTagDiseaseDepts } from '@/api/modules/diseaseTag'
export default {
  props: ['mode', 'tagDetail'],
  data() {
    return {
      rules: {
        tagShowDesc: [
          { required: true, message: '请输入展示名称', trigger: 'blur' }
        ],
        tagDesc: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请选择所属科室', trigger: 'blur' }
        ],
      },
      deptData: []
    }
  },
  mounted() {
    this.getTagDiseaseDepts()
  },
  methods: {
    async getTagDiseaseDepts() {
      try {
        const res = await getTagDiseaseDepts()
        console.log('getTagDiseaseDepts', res)
        const deptData = res.result
        this.filterDeptData(deptData)
        this.deptData = deptData
      } catch(err) {
        console.error(err)
      }
    },
    filterDeptData(deptData) {
      deptData.forEach(item => {
        if (!item.children.length) {
          item.children = null
        } else {
          this.filterDeptData(item.children)
        }
      })
    },
    validate(cb) {
      this.$refs.elForm.validate(valid => {
        if (valid) {
          cb()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-form {
  padding-right: 120px;
  padding-top: 25px;
  .abs-switch {
    position: absolute;
    left: 100%;
    top: 7px;
    margin-left: 10px;
  }
  ::v-deep .el-cascader {
    width: 100%;
  }
}
</style>