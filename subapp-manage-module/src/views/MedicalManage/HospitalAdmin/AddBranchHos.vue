<template>
  <el-dialog
    :visible="visible"
    title="添加分院"
    :before-close="beforeClose"
  >
    <el-form :model="branchHosDetail" :rules="rules" label-width="85px" ref="elForm">
      <el-form-item label="医院名称">
        <div class="hos-name">{{ parentHosName }}</div>
      </el-form-item>
      <el-form-item label="分院名称" prop="name">
        <el-input placeholder="分院名称" v-model="branchHosDetail.name" />
      </el-form-item>
      <el-form-item label="分院简称" prop="abbreviation">
        <el-input placeholder="分院简称" v-model="branchHosDetail.abbreviation" />
      </el-form-item>
      <el-form-item label="医院类型" prop="hosType">
        <el-select v-model="branchHosDetail.hosType">
          <el-option
            :label="item.LABLE"
            :value="item.VALUE"
            v-for="item in hospitalLypeList"
            :key="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="医院等级" prop="hosLevel">
        <el-select v-model="branchHosDetail.hosLevel">
          <el-option
            :label="item.LABLE"
            :value="item.VALUE"
            v-for="item in hospitalLevelList"
            :key="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="beforeClose">取消</el-button>
      <el-button type="primary" @click="saveOrg">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  saveOrg
} from '@/api/modules/systemAdmin';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    hospitalLypeList: {
      type: Array,
      default() {
        return []
      }
    },
    hospitalLevelList: {
      type: Array,
      default() {
        return []
      }
    },
    beforeClose: Function,
    parentHosName: String
  },
  data() {
    return {
      branchHosDetail: {},
      rules: {
        name: [
          { required: true, message: '请输入分院名称', trigger: 'blur' }
        ],
        abbreviation: [
          { required: true, message: '请输入分院简称', trigger: 'blur' }
        ],
        hosType: [
          { required: true, message: '请选择医院类型', trigger: 'blur' }
        ],
        hosLevel: [
          { required: true, message: '请选择医院等级', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    saveOrg() {
      this.$refs.elForm.validate(async valid => {
        if (valid) {
          try {
            const res = await saveOrg({
              ...this.branchHosDetail,
              parentId: this.$route.query.id,
              type: '_HOS_'
            });
            console.log('saveOrg==', res);
            this.beforeClose();
            this.$emit('add-branch-success', { id: res.result.id, name: res.result.name })
          } catch(err) {
            console.error(err);
          }
        }
      })
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.branchHosDetail = {};
      }
    }
  }
}
</script>
