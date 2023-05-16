<template>
  <el-dialog :visible.sync="visible" fullscreen title="业务组件保存" center>
    <el-form
      label-position="top"
      label-width="110px"
      :model="cusComModel"
      :rules="cusRules"
      ref="cusComForm"
    >
      <el-form-item label="组件名称" prop="comName">
        <el-input placeholder="请输入组件名称" v-model="cusComModel.comName" />
      </el-form-item>
      <el-form-item label="组件所属分类" prop="category">
        <el-radio-group v-model="categoryType" @change="handleChange">
          <el-radio label="exit">已有分类</el-radio>
          <el-radio label="new">新增分类</el-radio>
        </el-radio-group>
        <el-select
          style="margin-left: 20px;"
          placeholder="请选择组件所属分类"
          v-model="cusComModel.classificationId"
          v-if="categoryType === 'exit'"
          @change="ChooseCategoryChange"
          clearable
        >
          <el-option
            :label="v.category"
            :value="v.classificationId"
            v-for="v in cusComCategoryList"
            :key="v.classificationId"
          />
        </el-select>
        <el-input
          placeholder="请输入组件所属分类"
          v-model.trim="cusComModel.category"
          clearable
          v-else
        />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="saveCusComData">保存</el-button>
  </el-dialog>
</template>

<script>
import eventBus from 'utils/event-bus';
export default {
  inject: ['formComponentList', 'cusComponents', 'comTypeMap'],
  data() {
    return {
      visible: false,
      categoryType: 'exit',
      cusComModel: {
        category: '',
        comName: '',
        classificationId: ''
      },
      cusRules: {
        comName: [
          {
            required: true,
            message: '请输入组件名称',
            trigger: 'blur'
          }
        ],
        category: [
          {
            required: true,
            message:
              this.categoryType === 'exit'
                ? '请选择组件所属分类'
                : '请输入组件所属分类',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (
                this.categoryType === 'new' &&
                this.cusComCategoryList.indexOf(value) > -1
              ) {
                callback(new Error('该分类已经存在'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    // 自定义业务组件的所属分类下拉选择列表
    cusComCategoryList() {
      return this.cusComponents.map(item => ({
        category: item.category,
        classificationId: item.classificationId
      }));
    }
  },
  mounted() {
    eventBus.$on('[global/showCusCom]', () => {
      this.cusComModel = {
        category: '',
        comName: '',
        classificationId: ''
      };
      this.visible = true;
    });
  },
  beforeDestroy() {
    eventBus.$off('[global/showCusCom]');
  },
  methods: {
    handleChange() {
      this.$refs.cusComForm.clearValidate();
      this.cusComModel.category = '';
    },
    ChooseCategoryChange() {
      this.cusComModel.category = this.cusComCategoryList.filter(
        el => this.cusComModel.classificationId == el.classificationId
      )[0].category;
    },
    saveCusComData() {
      if (this.cusComModel.classificationId) {
        // 当前选择组件分类下的所有组件名称
        const categoryComNames = this.cusComponents
          .find(
            item => item.classificationId === this.cusComModel.classificationId
          )
          .components.map(item => item.name);
        if (categoryComNames.indexOf(this.cusComModel.comName.trim()) > -1) {
          this.$message.error('当前分类下已有相同名字的组件，请重新为组件命名');
          return;
        }
      }

      this.$refs.cusComForm.validate(valid => {
        if (valid) {
          let list = [];
          this.formComponentList.forEach(item => {
            if (item.type === this.comTypeMap.customer) {
              list = list.concat(item.list);
            } else {
              list.push(item);
            }
          });
          const cusComData = {
            comName: this.cusComModel.comName,
            category: this.cusComModel.category,
            classificationId: this.cusComModel.classificationId,
            list,
            type: this.comTypeMap.customer
          };
          this.$emit('create-cus-com', cusComData);
          this.visible = false;
        }
      });
    }
  }
};
</script>
