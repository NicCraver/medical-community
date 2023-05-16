<template>
  <div>
    <el-form-item label="其他 - 字段标识">
      <el-input v-model="activeCom.inputModel"></el-input>
    </el-form-item>
    <el-checkbox-group
      v-model="activeCom.options.defaultValue"
      v-if="activeCom.options.sourceType === 'static'"
    >
      <ul>
        <li
          class="form-item-config-list"
          v-for="(item, index) in activeCom.options.options"
          :key="index"
        >
          <el-checkbox :label="item.value" style="margin-right: 5px;">
            <span>
              value:
              <el-input
                size="mini"
                v-model="item.value"
                style="width:120px;"
              ></el-input>
            </span>
            <br />
            <span style="display: inline-block;margin:5px 0 0px 3px">
              label:
              <el-input
                size="mini"
                v-model="item.label"
                style="width:120px;"
              ></el-input>
            </span>
          </el-checkbox>
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
    </el-checkbox-group>
    <el-checkbox-group
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
          <el-checkbox :label="item.value" style="margin-right: 5px;">
            <img :src="item.label" style="width: 40px;height: 40px;" />
          </el-checkbox>
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
    </el-checkbox-group>
  </div>
</template>

<script>
import commonMixin from './common.mixin';

export default {
  name: 'CheckboxConfig',
  props: ['activeCom'],
  mixins: [commonMixin],
  mounted() {
    console.log(`this.activeCom`, this.activeCom);
  }
};
</script>

<style lang="scss" scoped>
.el-icon-plus {
  padding: 20px;
  border: 1px dashed #ccc;
}
.img-input {
  flex: 1;
}
</style>
