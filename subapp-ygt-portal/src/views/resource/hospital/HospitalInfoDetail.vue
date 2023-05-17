<!-- 
  @description 统一资源管理后台-医院管理-医院信息-详情
  @date 2021/10/19
 -->
<template>
  <el-drawer title="详情" :visible.sync="isVisible" :before-close="close" :size="1000" :wrapperClosable="false">
    <el-form :model="form" :rules="rules" size="small" label-width="80px" ref="form">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="机构代码" prop="code">
            <el-input v-model="form.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="平台编码" prop="platformCode">
            <el-input v-model="form.platformCode" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="医院名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="医院级别" prop="grade">
            <el-select v-model="form.grade">
              <el-option value="1" label="一级"></el-option>
              <el-option value="2" label="二级"></el-option>
              <el-option value="3" label="三级"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="医院等级" prop="level">
            <el-select v-model="form.level">
              <el-option value="1" label="甲"></el-option>
              <el-option value="2" label="乙"></el-option>
              <el-option value="3" label="丙"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="4">
          <el-form-item label="医院电话">
            <el-input v-model="form.phoneFront" placeholder="区号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <span class="phone-middle">-</span>
          <el-input v-model="form.phoneNumber" size="small" class="phone-number" placeholder="电话号码"></el-input>
        </el-col>
        <el-col :span="8">
          <el-form-item label="医院网址">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="院区信息">
            <el-radio v-model="form.info" label="1">有</el-radio>
            <el-radio v-model="form.info" label="0">无</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="5">
          <el-form-item label="医院地标">
            <el-input v-model="form.longitude" placeholder="经度"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-input v-model="form.latitude" placeholder="纬度" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <el-form-item label="医院地址" prop="address">
            <el-cascader v-model="form.address" :options="addressData" placeholder="请选择省/市"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-input v-model="form.addressDetail" placeholder="请输入详细地址" size="small"></el-input>
        </el-col>
      </el-row>
      <el-form-item label="医院介绍">
        <el-input v-model="form.introduce" type="textarea" :rows="6" placeholder="请输入内容：如特色科室介绍，医院所获荣誉，医院交通信息。"></el-input>
      </el-form-item>
      <el-form-item label="预约须知">
        <el-input v-model="form.notice" type="textarea" :rows="2"></el-input>
      </el-form-item>
      <el-form-item label="交通地址">
        <el-input v-model="form.trafficAddress" type="textarea" :rows="2"></el-input>
      </el-form-item>
      <el-form-item label="医院图片">
        <el-upload multiple :file-list="fileList" list-type="picture" action="">
          <el-button type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
      form: {},
      rules: {},
      addressData: [
        {
          value: "1",
          label: "上海",
          children: [{ value: "2", label: "黄埔" }],
        },
      ],
      fileList: [],
    };
  },
  methods: {
    open(data) {
      this.isVisible = true;
      this.form = data;
    },
    close() {
      this.isVisible = false;
      this.form = {};
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  padding: 16px;
  .el-select,
  .el-cascader {
    width: 100%;
  }
  .phone-middle {
    display: inline-block;
    width: 6px;
    text-align: center;
  }
  .phone-number {
    margin-left: 16px;
    width: calc(100% - 22px);
  }
}
</style>