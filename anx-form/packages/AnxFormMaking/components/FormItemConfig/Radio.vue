<template>
  <div>
    <el-form-item label="其他" v-if="type === 'whether'">
      <el-input v-model="activeCom.inputModel"></el-input>
    </el-form-item>
    <el-form-item label="其他占位内容" v-if="type === 'whether'">
      <el-input v-model="activeCom.options.placeholder"></el-input>
    </el-form-item>
    <el-form-item label="其他默认值" v-if="type === 'whether'">
      <el-input v-model="activeCom.inputDefaultValue"></el-input>
    </el-form-item>
    <el-form-item label="输入框类型" v-if="type === 'whether'">
      <el-radio-group v-model="activeCom.inputType" size="small">
        <el-radio-button label="1">单行文本</el-radio-button>
        <el-radio-button label="2">多行文本</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="移动端样式" v-if="type !== 'whether'">
      <el-radio-group v-model="activeCom.mobileType" size="small">
        <el-radio-button label="radio">radio</el-radio-button>
        <el-radio-button label="select">select</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <!-- <el-form-item>
      <el-radio-group v-model="activeCom.options.sourceType" size="small">
        <el-radio-button label="static">静态数据</el-radio-button>
        <el-radio-button label="image">图片数据</el-radio-button>
      </el-radio-group>
    </el-form-item> -->
    <el-radio-group
      v-model="activeCom.options.defaultValue"
      v-if="activeCom.options.sourceType === 'static'"
    >
      <ul>
        <li
          class="form-item-config-list"
          v-for="(item, index) in activeCom.options.options"
          :key="index"
        >
          <el-radio :label="item.value" style="margin-right: 5px;">
            <span>
              value:
              <el-input
                :style="{
                  width: activeCom.options.showLabel ? '90px' : '120px'
                }"
                size="mini"
                v-model="item.value"
              ></el-input>
            </span>
            <br />
            <span style="display: inline-block;margin:5px 0 0px 30px">
              label:
              <el-input
                style="width:120px;"
                size="mini"
                v-model="item.label"
              ></el-input>
            </span>
          </el-radio>
          <div style="width:40px;text-align:center;">
            <i
              @click="movingMethod('up', index)"
              class="el-icon-top"
              style="cursor:pointer;"
              v-if="index != 0"
            ></i>
            <i
              @click="movingMethod('down', index)"
              class="el-icon-bottom"
              style="cursor:pointer;"
              v-if="index != activeCom.options.options.length - 1"
            ></i>
          </div>
          <el-button
            @click="delMethod(index)"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            circle
          ></el-button>
        </li>
      </ul>
      <el-button @click="addMethod()" type="text">添加选项</el-button>
    </el-radio-group>
    <el-radio-group
      v-model="activeCom.options.defaultValue"
      v-if="activeCom.options.sourceType === 'image'"
      style="width: 100%"
    >
      <el-form-item label="图片上传URL">
        <el-input v-model="activeCom.options.uploadUrl" />
      </el-form-item>
      <el-form-item label="图片删除URL">
        <el-input v-model="activeCom.options.deleteUrl" />
      </el-form-item>
      <ul>
        <li
          class="form-item-config-list"
          v-for="(item, index) in activeCom.options.imageOptions"
          :key="index"
        >
          <el-radio
            :label="item.value"
            style="margin-right: 5px;"
            class="img-radio"
          >
            <img :src="item.label" style="width: 40px;height: 40px;" />
          </el-radio>
          <el-input v-model="item.value" size="mini" class="img-input" />
          <div style="width:40px;text-align:center;">
            <i
              @click="movingMethod('up', index)"
              class="el-icon-top"
              style="cursor:pointer;"
              v-if="index != 0"
            ></i>
            <i
              @click="movingMethod('down', index)"
              class="el-icon-bottom"
              style="cursor:pointer;"
              v-if="index != activeCom.options.imageOptions.length - 1"
            ></i>
          </div>
          <el-button
            @click="delImage(index)"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            circle
          ></el-button>
        </li>
      </ul>
      <el-upload
        action="#"
        :show-file-list="false"
        :on-change="uploadChange"
        :http-request="uploadImage"
      >
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-radio-group>
  </div>
</template>

<script>
import commonMixin from './common.mixin';

export default {
  name: 'RadioConfig',
  props: {
    activeCom: {
      type: Object
    },
    type: {
      type: String,
      default: ''
    }
  },
  mixins: [commonMixin]
};
</script>

<style lang="scss" scoped>
.img-radio {
  display: flex;
}
.el-icon-plus {
  padding: 20px;
  border: 1px dashed #ccc;
}
.img-input {
  flex: 1;
}
</style>
