<template>
  <div>
    <h1 v-if="formItem.type === 'h1'" v-bind="formItem.options">
      {{ formItem.name }}
    </h1>
    <h2 v-if="formItem.type === 'h2'" v-bind="formItem.options">
      {{ formItem.name }}
    </h2>
    <h2 v-if="formItem.type === 'h3'" v-bind="formItem.options">
      {{ formItem.name }}
    </h2>
    <div v-if="formItem.type === 'drug'">
      <el-select
        v-model="model[formItem.model]"
        v-bind="formItem.options"
        :ref="formItem.id"
        style="width: 100% !important;"
      >
        <el-option
          v-for="(formItem, index) in formItem.options.remote
            ? formItem.options.remoteOptions
            : formItem.options.options"
          :key="index"
          :label="formItem.label"
          :value="formItem.value"
        />
      </el-select>
    </div>
    <span v-if="formItem.type === 'text'" v-bind="formItem.options">{{
      formItem.options.defaultValue
    }}</span>
    <div :style="createItemBoxStyle(formItem)" v-if="formItem.type === 'input'">
      <el-input
        style="width:200px;"
        v-model="model[formItem.model]"
        v-bind="formItem.options"
      />
    </div>
    <div
      :style="createItemBoxStyle(formItem)"
      v-if="formItem.type === 'textarea'"
    >
      <el-input
        type="textarea"
        v-model="model[formItem.model]"
        v-bind="formItem.options"
        :autosize="{ minRows: 2, maxRows: 100 }"
      />
    </div>
    <div :style="createItemBoxStyle(formItem)" v-if="formItem.type === 'radio'">
      <el-radio-group
        v-model="model[formItem.model]"
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
        v-model="model[formItem.model]"
        v-bind="formItem.options"
        v-if="formItem.options.sourceType === 'image'"
      >
        <el-radio
          :label="item.value"
          style="margin-right: 5px;"
          v-for="(item, index) in formItem.options.imageOptions"
          :key="index"
        >
          <img :src="item.label" style="width: 40px;height: 40px;" />
        </el-radio>
      </el-radio-group>
    </div>
    <div
      :style="createItemBoxStyle(formItem)"
      v-if="formItem.type === 'whether'"
    >
      <el-radio-group
        v-model="model[formItem.model]"
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
      <el-input
        v-if="model[formItem.model] === '1' && formItem.inputType === '1'"
        :placeholder="formItem.options.placeholder"
        v-model="model[formItem.inputModel]"
        clearable
      >
      </el-input>
      <el-input
        v-if="model[formItem.model] === '1' && formItem.inputType === '2'"
        type="textarea"
        :placeholder="formItem.options.placeholder"
        v-model="model[formItem.inputModel]"
        :autosize="{ minRows: 2, maxRows: 100 }"
        clearable
      >
      </el-input>
    </div>
    <div
      :style="createItemBoxStyle(formItem)"
      v-if="formItem.type === 'checkbox'"
    >
      <el-checkbox-group
        v-model="model[formItem.model]"
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
        v-model="model[formItem.model]"
        v-bind="formItem.options"
        v-if="formItem.options.sourceType === 'image'"
      >
        <el-checkbox
          :label="item.value"
          style="margin-right: 5px;"
          v-for="(item, index) in formItem.options.imageOptions"
          :key="index"
        >
          <img :src="item.label" style="width: 40px;height: 40px;" />
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div
      :style="createItemBoxStyle(formItem)"
      v-if="formItem.type === 'checkboxOther'"
    >
      <el-checkbox-group
        v-model="model[formItem.model]"
        v-bind="formItem.options"
        @change="checkboxOtherChange1"
      >
        <el-checkbox
          v-for="(formItem, index) in formItem.options.options"
          :key="index"
          :label="formItem.value"
        >
          {{ formItem.label }}
        </el-checkbox>
      </el-checkbox-group>
      <el-input
        v-if="checkboxOther"
        placeholder="其他"
        v-model="model[formItem.inputModel]"
        clearable
      >
      </el-input>
    </div>
    <div :style="createItemBoxStyle(formItem)" v-if="formItem.type === 'date'">
      <el-date-picker
        v-model="model[formItem.model]"
        v-bind="formItem.options"
        :value-format="formItem.options.format"
      >
      </el-date-picker>
    </div>
    <div
      :style="createItemBoxStyle(formItem)"
      v-if="formItem.type === 'select'"
    >
      <el-select
        v-if="formItem.type === 'select'"
        style="width:200px;"
        v-model="model[formItem.model]"
        v-bind="formItem.options"
        :ref="formItem.id"
      >
        <el-option
          v-for="(formItem, index) in formItem.options.remote
            ? formItem.options.remoteOptions
            : formItem.options.options"
          :key="index"
          :label="formItem.label"
          :value="formItem.value"
        />
      </el-select>
    </div>
    <div :style="createItemBoxStyle(formItem)" v-if="formItem.type === 'rate'">
      <el-rate
        v-model="model[formItem.model]"
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
    </div>
    <div
      :style="createItemBoxStyle(formItem)"
      v-if="formItem.type === 'transfer'"
    >
      <el-transfer
        v-model="model[formItem.model]"
        :data="formItem.options.options"
        v-bind="formItem.options"
      ></el-transfer>
    </div>
    <div
      :style="createItemBoxStyle(formItem)"
      v-if="formItem.type === 'upload'"
    >
      <el-upload
        action="#"
        :on-change="uploadChange"
        :http-request="uploadFile"
        :before-remove="handleDelete"
        v-bind="formItem.options"
        :file-list="model[formItem.model]"
        :on-preview="handlePictureCardPreview"
      >
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <el-dialog :visible.sync="imgPriviewVisible" :modal="false">
        <img width="100%" :src="imgPriviewSrc" alt="" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
// import { comTypeMap } from 'utils/config';
// import JsCodeVue from '../../AnxFormMaking/components/FormView/JsCode.vue';
export default {
  props: {
    model: Object,
    formItem: Object,
    formComponentList: Array,
    updateFormItem: Function,
    parentId: String
  },
  data() {
    return {
      checkboxOther: false,
      files: new FormData(),
      imgPriviewVisible: false,
      imgPriviewSrc: '',
      oldVal: []
    };
  },
  computed: {},
  watch: {
    formItem: {
      immediate: true,
      deep: true,
      handler() {
        console.log('this.formItem---', this.formItem);
        if (this.formItem.type !== 'rate') {
          if (this.model[this.formItem.model]?.indexOf('其他') != -1) {
            this.checkboxOther = true;
          }
        }
      }
    }
  },
  methods: {
    // 找到关联对应的select
    findCasSel(list) {
      let casSel;
      const listLen = list.length;
      for (let i = 0; i < listLen; i++) {
        const item = list[i];
        if (item.type === 'grid') {
          if (casSel) {
            break;
          }
          const columns = item.columns;
          const columnsLen = columns.length;
          for (let colIndex = 0; colIndex < columnsLen; colIndex++) {
            const innerList = columns[colIndex].list;
            const innerLen = innerList.length;
            for (let innerIndex = 0; innerIndex < innerLen; innerIndex++) {
              if (
                innerList[innerIndex].options.casModel === this.formItem.model
              ) {
                casSel = innerList[innerIndex];
              }
              break;
            }
          }
        } else {
          if (item.options.casModel === this.formItem.model) {
            casSel = this.formComponentList[i];
            break;
          }
        }
      }
      return casSel;
    },
    createFormItemAttr(formItem) {
      const titleList = ['h1', 'h2', 'h3'];
      const noLabel =
        titleList.indexOf(formItem.type) > -1 ||
        (formItem.type === 'text' && !formItem.options.showTitle);
      return {
        labelText: noLabel ? '' : formItem.name,
        labelWidth: noLabel ? '0px' : formItem.width
      };
    },
    createItemBoxStyle(item) {
      return { width: item.options.width };
    },
    uploadChange(file) {
      this.model[this.formItem.model].splice(1, 0);
      this.files.append('images', file.raw);
    },
    uploadFile() {
      if (this.formItem.options.accept === 'image/*') {
        axios
          .post(this.formItem.options.uploadUrl, this.files)
          .then(res => {
            const imageInfo = res.data.data[0];
            this.model[this.formItem.model].push({
              ...imageInfo,
              url: imageInfo.url,
              name: imageInfo.fileName
            });
            this.files.delete('images');
          })
          .catch(() => {
            this.files.delete('images');
          });
      }
    },
    handleDelete(file) {
      if (this.formItem.options.accept === 'image/*') {
        axios
          .get(this.formItem.options.deleteUrl, {
            params: {
              imageId: file.id
            }
          })
          .then(() => {
            const index = this.model[this.formItem.model].findIndex(
              item => item.id === file.id
            );
            this.model[this.formItem.model].splice(index, 1);
          })
          .catch(() => {
            return false;
          });
        return false;
      }
    },
    handlePictureCardPreview(file) {
      this.imgPriviewSrc = file.url;
      this.imgPriviewVisible = true;
    },
    checkboxOtherChange1(arr) {
      console.log(`arr`, arr);
      let flag = JSON.stringify(arr) === JSON.stringify(this.oldVal);
      let last = arr[arr.length - 1];
      let isWu = last === '无';
      let isOther = last === '其他';
      if (!flag) {
        if (isWu) {
          this.model[this.formItem.model] = ['无'];
          this.checkboxOther = false;
        } else if (isOther) {
          this.model[this.formItem.model] = ['其他'];
          this.checkboxOther = true;
        } else {
          this.checkboxOther = false;
          let tempArr = [];
          for (let i = 0; i < arr.length; i++) {
            const el = arr[i];
            if (el !== '无' && el !== '其他') {
              tempArr.push(el);
            }
          }
          console.log(`tempArr`, tempArr);
          this.model[this.formItem.model] = tempArr;
        }
      }
      this.oldVal = JSON.parse(JSON.stringify(arr));
      // for (let i = 0; i < this.model[this.formItem.model].length; i++) {
      //   const el = this.model[this.formItem.model][i];
      //   console.log(`el`, el);
      //   if (el === '其他' || el === '无') {
      //     this.model[this.formItem.model].splice(i, 1);
      //     this.checkboxOther = false;
      //     this.model[this.formItem.inputModel] = '';
      //   }
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-rate {
  height: 32px;
  line-height: 32px;
  .el-rate__item {
    vertical-align: inherit;
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
</style>
