<template>
  <div class="form-item-config" v-if="showFlag">
    <div v-if="activeCom.type === 'grid'">
      <grid-config :activeCom="activeCom" />
    </div>
    <div v-else-if="activeCom.type === comTypeMap.customer"></div>
    <div v-else>
      <el-form v-if="isHTitle">
        <h-title-config :activeCom="activeCom" />
      </el-form>
      <el-form v-else label-position="top" size="small">
        <!-- 头部共用 -->
        <el-form-item label="组件Id">
          <el-input v-model="activeCom.id" readonly></el-input>
        </el-form-item>
        <el-form-item label="字段标识">
          <el-input v-model="activeCom.model"></el-input>
        </el-form-item>
        <!-- 类型为text可以选择隐藏标题 -->
        <el-form-item label="标题" v-if="activeCom.type === 'text'">
          <el-checkbox v-model="activeCom.options.showTitle">显示</el-checkbox>
          <el-input
            v-model="activeCom.name"
            v-show="activeCom.options.showTitle"
          ></el-input>
        </el-form-item>
        <!-- 其他类型没有选择 -->
        <el-form-item label="标题" v-else>
          <el-input v-model="activeCom.name" type="textarea"></el-input>
        </el-form-item>
        <!-- <el-form-item label="宽度">
          <el-input v-model="activeCom.options.width"></el-input>
        </el-form-item> -->

        <!-- Text -->
        <text-config :activeCom="activeCom" v-if="activeCom.type === 'text'" />

        <!-- input -->
        <input-config
          :activeCom="activeCom"
          v-if="activeCom.type === 'input'"
        />
        <BMI :activeCom="activeCom" v-if="activeCom.type === 'BMI'" />

        <!-- textarea -->
        <textarea-config
          :activeCom="activeCom"
          v-if="activeCom.type === 'textarea'"
        />

        <!-- select -->
        <select-config
          :activeCom="activeCom"
          v-if="activeCom.type === 'select'"
        />
        <select-config
          :activeCom="activeCom"
          v-if="activeCom.type === 'drug'"
        />

        <CheckboxOtherConfig
          :activeCom="activeCom"
          v-if="activeCom.type === 'checkboxOther'"
        />

        <!-- radio -->
        <radio-config
          :activeCom="activeCom"
          v-if="activeCom.type === 'radio'"
        />
        <radio-config
          :activeCom="activeCom"
          type="whether"
          v-if="activeCom.type === 'whether'"
        />

        <!-- checkbox -->
        <checkbox-config
          :activeCom="activeCom"
          v-if="activeCom.type === 'checkbox'"
        />

        <!-- date -->
        <date-config
          :activeCom="activeCom"
          v-if="activeCom.type === 'time' || activeCom.type === 'date'"
        />

        <!-- rate -->
        <rate-config :activeCom="activeCom" v-if="activeCom.type === 'rate'" />

        <!-- transfer -->
        <transfer-config
          :activeCom="activeCom"
          v-if="activeCom.type === 'transfer'"
        />

        <!-- transfer -->
        <upload-config
          :activeCom="activeCom"
          v-if="activeCom.type === 'upload'"
        />

        <!-- 尾部共用 -->
        <el-divider></el-divider>
        <div class="form-item-config-title">
          操作属性
        </div>
        <el-form-item>
          <el-checkbox v-model="activeCom.options.disabled">禁用</el-checkbox>
        </el-form-item>
        <el-form-item v-if="activeCom.type !== 'text'">
          <el-checkbox v-model="activeCom.options.required">必填</el-checkbox>
          <el-input
            v-show="activeCom.options.required"
            placeholder="自定义错误提示"
            size="mini"
            v-model="activeCom.options.errorTips"
          />
        </el-form-item>
      </el-form>
    </div>
    <!-- <div>
      <IfConfig :activeCom="activeCom"></IfConfig>
    </div> -->
  </div>
</template>

<script>
import GridConfig from './Grid';
import HTitleConfig from './HTitle';
import TextConfig from './Text';
import InputConfig from './Input';
import TextareaConfig from './Textarea';
import SelectConfig from './Select';
import RadioConfig from './Radio';
import CheckboxConfig from './Checkbox';
import CheckboxOtherConfig from './CheckboxOther';
import DateConfig from './Date';
import RateConfig from './Rate';
import TransferConfig from './Transfer';
import UploadConfig from './Upload';
import BMI from './BMI.vue';
// import IfConfig from './IfConfig.vue';
export default {
  name: 'FormItemConfig',
  inject: ['activeItemInfo', 'formComponentList', 'comTypeMap'],
  computed: {
    activeCom() {
      return this.activeItemInfo.activeCom; // this.activeItemInfo.getActiveCom();
    },
    showFlag() {
      return this.activeCom && Object.keys(this.activeCom).length > 0;
    },
    isHTitle() {
      const titleList = ['h1', 'h2', 'h3'];
      return titleList.indexOf(this.activeCom.type) > -1;
    }
  },
  components: {
    GridConfig,
    BMI,
    HTitleConfig,
    TextConfig,
    InputConfig,
    TextareaConfig,
    SelectConfig,
    RadioConfig,
    CheckboxConfig,
    CheckboxOtherConfig,
    DateConfig,
    RateConfig,
    TransferConfig,
    UploadConfig
    // IfConfig
  }
};
</script>

<style lang="scss" scoped>
::v-deep .form-item-config-title {
  font-size: 14px;
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(148, 157, 163, 1);
  margin: 10px 0;
  line-height: 20px;
}

::v-deep .form-item-config-list {
  margin-top: 5px;
  display: flex;
  align-items: center;
  .el-radio {
    color: #606266;
    cursor: pointer;
    margin-right: 5px;
  }
}

::v-deep .el-checkbox-group {
  font-size: 16px;
}

::v-deep .el-checkbox__input {
  vertical-align: top;
  margin-top: 9px;
}

::v-deep .el-radio-group {
  font-size: 16px;
}

::v-deep .el-form--label-top .el-form-item__label {
  float: none;
  display: inline-block;
  text-align: left;
  padding: 0 0 5px 0;
}
::v-deep .el-form-item__label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 20px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}
::v-deep.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 14px 0;
}
::v-deep.el-form-item {
  margin-bottom: 5px;
}
</style>
