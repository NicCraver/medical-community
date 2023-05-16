<template>
  <div>
    <el-form-item label="上传URL">
      <el-input v-model="activeCom.options.uploadUrl" size="small" />
    </el-form-item>
    <el-form-item label="删除URL">
      <el-input v-model="activeCom.options.deleteUrl" size="small" />
    </el-form-item>
    <el-form-item label="上传文件类型">
      <el-select
        v-model="activeCom.options.accept"
        size="small"
        @change="handleChange"
      >
        <el-option
          v-for="item in activeCom.options.fileTypeList"
          :key="item.text"
          :label="item.text"
          :value="item.accept"
        />
      </el-select>
    </el-form-item>
    <el-upload
      action="#"
      :on-change="uploadChange"
      :http-request="uploadFile"
      :before-remove="handleDelete"
      v-bind="activeCom.options"
      :file-list="activeCom.options.defaultValue"
    >
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    activeCom: Object
  },
  data() {
    return {
      files: new FormData()
    };
  },
  methods: {
    handleChange() {
      const cur = this.activeCom.options.fileTypeList.find(
        item => item.accept === this.activeCom.options.accept
      );
      this.activeCom.options['list-type'] = cur['list-type'];
    },
    uploadChange(file) {
      this.activeCom.options.defaultValue.splice(1, 0);
      this.files.append('images', file.raw);
    },
    uploadFile() {
      if (this.activeCom.options.accept === 'image/*') {
        axios
          .post(this.activeCom.options.uploadUrl, this.files)
          .then(res => {
            const imageInfo = res.data.data[0];
            this.activeCom.options.defaultValue.push({
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
      if (this.activeCom.options.accept === 'image/*') {
        axios
          .get(this.activeCom.options.deleteUrl, {
            params: {
              imageId: file.id
            }
          })
          .then(() => {
            const index = this.activeCom.options.defaultValue.findIndex(
              item => item.id === file.id
            );
            this.activeCom.options.defaultValue.splice(index, 1);
          })
          .catch(() => {
            return false;
          });
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-icon-plus {
  padding: 20px;
  border: 1px dashed #ccc;
}
</style>
