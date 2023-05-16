<template>
  <li
    :class="['anx-form-item', { active: activeCom.key === formItem.key }]"
    @click="handleClick($event)"
  >
    <template>
      <template v-if="formItem.type === 'h1'">
        <div :style="createItemBoxStyle(formItem)">
          <h1 v-bind="formItem.options">{{ formItem.name }}</h1>
        </div>
      </template>
      <template v-if="formItem.type === 'h2'">
        <div :style="createItemBoxStyle(formItem)">
          <h2 v-bind="formItem.options">{{ formItem.name }}</h2>
        </div>
      </template>
      <template v-if="formItem.type === 'h3'">
        <div :style="createItemBoxStyle(formItem)">
          <h3 v-bind="formItem.options">{{ formItem.name }}</h3>
        </div>
      </template>
      <template v-if="formItem.type === 'text'">
        <el-form-item
          :label="formItem.options.showTitle ? formItem.name : ''"
          :label-width="formItem.options.showTitle ? `100px` : '0px'"
        >
          <div :style="createItemBoxStyle(formItem)">
            <p
              v-bind="formItem.options"
              v-for="(text, textIndex) in formItem.options.defaultValue.split(
                '\n'
              )"
              :key="textIndex"
              style="line-height: 1.2"
            >
              {{ text }}
            </p>
          </div>
        </el-form-item>
      </template>
      <template v-if="formItem.type === 'input'">
        <el-form-item
          :label="formItem.name"
          :required="formItem.options.required"
        >
          <div :style="createItemBoxStyle(formItem)">
            <el-input
              style="width:200px;"
              v-model="formItem.options.defaultValue"
              v-bind="formItem.options"
            />
          </div>
        </el-form-item>
      </template>
      <template v-if="formItem.type === 'BMI'">
        <el-form-item
          :label="'身高（cm）'"
          :required="formItem.options.required"
        >
          <div :style="createItemBoxStyle(formItem)">
            <el-input
              style="width:200px;"
              v-model="formItem.heightValue"
              v-bind="formItem.options"
            />
          </div>
        </el-form-item>
        <el-form-item
          :label="'体重（kg）'"
          :required="formItem.options.required"
        >
          <div :style="createItemBoxStyle(formItem)">
            <el-input
              style="width:200px;"
              v-model="formItem.weightValue"
              v-bind="formItem.options"
            />
          </div>
        </el-form-item>
        <el-form-item
          :label="'BMI（kg/cm²）'"
          :required="formItem.options.required"
        >
          <div :style="createItemBoxStyle(formItem)" style="padding-left:10px">
            {{ comBMI }}
          </div>
        </el-form-item>
      </template>
      <template v-if="formItem.type === 'textarea'">
        <el-form-item
          :label="formItem.name"
          :required="formItem.options.required"
        >
          <div
            :style="createItemBoxStyle(formItem)"
            :required="formItem.options.required"
          >
            <el-input
              type="textarea"
              v-model="formItem.options.defaultValue"
              v-bind="formItem.options"
            />
          </div>
        </el-form-item>
      </template>
      <template v-if="formItem.type === 'radio'">
        <el-form-item
          :label="formItem.name"
          :required="formItem.options.required"
        >
          <div :style="createItemBoxStyle(formItem)">
            <el-radio-group
              v-model="formItem.options.defaultValue"
              v-bind="formItem.options"
              v-if="formItem.options.sourceType === 'static'"
            >
              <el-radio
                v-for="(formItem, index) in formItem.options.options"
                :key="index"
                :label="formItem.value"
                >{{ formItem.label }}</el-radio
              >
            </el-radio-group>
            <el-radio-group
              v-model="formItem.options.defaultValue"
              v-if="formItem.options.sourceType === 'image'"
            >
              <ul>
                <li
                  class="form-item-config-list"
                  v-for="(item, index) in formItem.options.imageOptions"
                  :key="index"
                >
                  <el-radio :label="item.value" style="margin-right: 5px;">
                    <img :src="item.label" style="width: 40px;height: 40px;" />
                  </el-radio>
                </li>
              </ul>
            </el-radio-group>
          </div>
        </el-form-item>
      </template>
      <!-- 单选 是否 -->
      <template v-if="formItem.type === 'whether'">
        <el-form-item
          :label="formItem.name"
          :required="formItem.options.required"
        >
          <div :style="createItemBoxStyle(formItem)">
            <el-radio-group
              v-model="formItem.options.defaultValue"
              v-bind="formItem.options"
            >
              <el-radio
                v-for="(formItem, index) in formItem.options.options"
                :key="index"
                :label="formItem.value"
                >{{ formItem.label }}</el-radio
              >
            </el-radio-group>
            <el-input
              v-if="formItem.options.defaultValue === '1'"
              placeholder="其他"
              v-model="formItem.inputModel"
              clearable
            >
            </el-input>
          </div>
        </el-form-item>
      </template>
      <template v-if="formItem.type === 'checkbox'">
        <el-form-item
          :label="formItem.name"
          :required="formItem.options.required"
        >
          <div :style="createItemBoxStyle(formItem)">
            <el-checkbox-group
              v-model="formItem.options.defaultValue"
              v-bind="formItem.options"
              v-if="formItem.options.sourceType === 'static'"
            >
              <el-checkbox
                v-for="(formItem, index) in formItem.options.options"
                :key="index"
                :label="formItem.value"
                >{{ formItem.label }}</el-checkbox
              >
            </el-checkbox-group>
            <el-checkbox-group
              v-model="formItem.options.defaultValue"
              v-if="formItem.options.sourceType === 'image'"
            >
              <ul>
                <li
                  class="form-item-config-list"
                  v-for="(item, index) in formItem.options.imageOptions"
                  :key="index"
                >
                  <el-checkbox :label="item.value" style="margin-right: 5px;">
                    <img :src="item.label" style="width: 40px;height: 40px;" />
                  </el-checkbox>
                </li>
              </ul>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </template>
      <template v-if="formItem.type === 'checkboxOther'">
        <el-form-item
          :label="formItem.name"
          :required="formItem.options.required"
        >
          <div :style="createItemBoxStyle(formItem)">
            <el-checkbox-group
              v-model="formItem.options.defaultValue"
              v-bind="formItem.options"
              @change="checkboxOtherChange"
            >
              <el-checkbox
                v-for="(formItem, index) in formItem.options.options"
                :key="index"
                :label="formItem.value"
                >{{ formItem.label }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </el-form-item>
      </template>
      <template v-if="formItem.type === 'date'">
        <el-form-item
          :label="formItem.name"
          :required="formItem.options.required"
        >
          <div :style="createItemBoxStyle(formItem)">
            <el-date-picker
              v-model="formItem.options.defaultValue"
              v-bind="formItem.options"
              :value-format="formItem.options.format"
            >
            </el-date-picker>
          </div>
        </el-form-item>
      </template>
      <template v-if="formItem.type === 'select'">
        <el-form-item
          :label="formItem.name"
          :required="formItem.options.required"
        >
          <div :style="createItemBoxStyle(formItem)">
            <el-select
              style="width:200px;"
              v-model="formItem.options.defaultValue"
              v-bind="formItem.options"
            >
              <el-option
                v-for="(formItem, index) in formItem.options.options"
                :key="index"
                :label="formItem.label"
                :value="formItem.value"
              />
            </el-select>
          </div>
        </el-form-item>
      </template>
      <template v-if="formItem.type === 'drug'">
        <el-form-item
          :label="formItem.name"
          :required="formItem.options.required"
        >
          <div :style="createItemBoxStyle(formItem)">
            <DrugSelect :formItem="formItem" />
          </div>
        </el-form-item>
      </template>
      <template v-if="formItem.type === 'rate'">
        <el-form-item
          :label="formItem.name"
          :required="formItem.options.required"
        >
          <el-rate
            v-model="formItem.options.defaultValue"
            v-bind="formItem.options"
            show-text
            :texts="[
              '极差（1分）',
              '失望（2分）',
              '一般（3分）',
              '满意（4分）',
              '很满意（5分）'
            ]"
          />
        </el-form-item>
      </template>
      <template v-if="formItem.type === 'transfer'">
        <el-form-item
          :label="formItem.name"
          :required="formItem.options.required"
        >
          <el-transfer
            v-model="formItem.options.defaultValue"
            :data="formItem.options.options"
            v-bind="formItem.options"
          ></el-transfer>
        </el-form-item>
      </template>
      <template v-if="formItem.type === 'upload'">
        <el-form-item
          :label="formItem.name"
          :required="formItem.options.required"
        >
          <el-upload
            action="#"
            v-bind="formItem.options"
            :file-list="formItem.options.defaultValue"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </template>
    </template>
    <div class="shande"></div>
    <div
      class="operate"
      v-if="activeCom.key === formItem.key"
      @click="deleteCurr($event)"
    >
      <i class="icon el-icon-delete" v-if="comType !== comTypeMap.customer"></i>
    </div>
  </li>
</template>

<script>
import DrugSelect from './FormItemConfig/DrugSelect.vue';
export default {
  props: {
    comType: String,
    formItem: {
      type: Object,
      required: true
    },
    activeList: Array
  },
  components: {
    DrugSelect
  },
  inject: ['activeItemInfo', 'comTypeMap'],
  computed: {
    activeCom() {
      return this.activeItemInfo.activeCom || {};
    },
    comBMI() {
      // this.formItem.BMIValue =
      //   this.formItem.weightValue /
      //   (this.formItem.heightValue * this.formItem.heightValue);
      let a =
        this.formItem.weightValue /
        ((this.formItem.heightValue / 100) * (this.formItem.heightValue / 100));
      console.log(
        `this.formItem.weightValue /`,
        this.formItem.weightValue /
          ((this.formItem.heightValue / 100) *
            (this.formItem.heightValue / 100))
      );
      let temp = Math.round(a * Math.pow(10, 1)) / Math.pow(10, 1);
      let bmi = isNaN(temp) ? 0 : temp;
      console.log(`bmi`, bmi);
      return bmi;
    }
  },
  methods: {
    createItemBoxStyle() {
      return {};
    },
    handleClick(e) {
      e.stopPropagation();
      this.activeItemInfo.setActiveCom(this.formItem);
    },
    deleteCurr(e) {
      e.stopPropagation();
      this.activeItemInfo.deleteActiveCom(this.activeList, this.formItem);
    },
    checkboxOtherChange(val) {
      console.log(`val`, val);
    }
  }
};
</script>

<style lang="scss" scoped>
.anx-form-item {
  position: relative;
  z-index: 100;
  box-sizing: border-box;
  &.active {
    border: 2px solid #409eff;
  }
  .el-radio-group,
  .el-checkbox-group {
    margin-top: 10px;
    line-height: 20px;
  }
  .el-radio,
  .el-checkbox {
    display: block;
    margin-bottom: 10px;
  }
  .shande {
    position: absolute;
    bottom: 0;
    right: 0;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .operate {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #409eff;
    color: #fff;
    z-index: 2;
    cursor: pointer;
    .icon {
      margin: 1px 10px;
    }
  }

  ::v-deep .el-radio-group {
    display: flex;
    flex-direction: column;
  }
  ::v-deep .el-radio {
    white-space: normal;
    padding: 2px 0;
  }
  ::v-deep .el-rate {
    height: 32px;
    line-height: 32px;
    .el-rate__item {
      vertical-align: inherit;
    }
  }
  .el-icon-plus {
    padding: 20px;
    border: 1px dashed #ccc;
  }
}
</style>
