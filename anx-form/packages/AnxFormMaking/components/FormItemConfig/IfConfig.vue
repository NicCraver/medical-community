<template>
  <div class="IfConfig">
    <el-divider></el-divider>
    <h4>交互规则</h4>
    <div>
      当，条件：
    </div>
    <div>
      <el-button type="text" icon="el-icon-plus" @click="onOpen">
        添加条件
      </el-button>
    </div>
    <div>
      满足时，得到结果
    </div>
    <div>
      显示字段
    </div>
    <div>activeCom: {{ activeCom }}</div>
    <div v-for="(v, index) in formComponentList" :key="index">
      <el-divider></el-divider>
      <div @click="change(v)">
        {{ v }}
      </div>
    </div>

    <el-dialog title="添加条件" :visible.sync="dialogTableVisible">
      <div style="display: flex; justify-content: space-between;">
        <el-row :gutter="10">
          <el-col :span="2">
            <div style="line-height:40px;">第一组</div>
          </el-col>
          <el-col :span="6">
            <el-input v-model="formInline.user" placeholder="字段"></el-input>
          </el-col>
          <el-col :span="6">
            <el-select v-model="value" filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input v-model="formInline.user"></el-input>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ['activeItemInfo', 'formComponentList', 'comTypeMap'],
  props: ['activeCom'],
  data() {
    return {
      value: '',
      options: [
        {
          value: '=',
          label: '='
        },
        {
          value: '>',
          label: '>'
        },
        {
          value: '<',
          label: '<'
        },
        {
          value: '>=',
          label: '>='
        },
        {
          value: '<=',
          label: '<='
        }
      ],
      formInline: {
        user: '',
        region: ''
      },
      dialogTableVisible: false
    };
  },
  // computed: {
  //   activeCom() {
  //     return this.activeItemInfo.activeCom; // this.activeItemInfo.getActiveCom();
  //   }
  // },
  methods: {
    onOpen() {
      this.dialogTableVisible = true;

      let ifConfig = [
        {
          ifKey: 'input_1654592823543',
          condition: '==',
          ifValue: '222'
        }
      ];
      this.activeCom.isShow = ifConfig;
      this.activeCom.options.ifConfig = ifConfig;
      console.log('this.activeCom', this.activeCom);
      console.log('this.formComponentList', this.formComponentList);
      this.formComponentList.find(item => item.model === ifConfig.ifKey);
      // this.activeItemInfo.setActiveCom({
      //   ...this.activeItemInfo.activeCom,
      //   ifConfig
      // });
    },
    onSubmit() {
      console.log('submit!');
    },
    change(value) {
      value.isShow = !value.isShow;
    }
  }
};
</script>

<style scoped>
.IfConfig {
  padding-bottom: 20px;
}
</style>
