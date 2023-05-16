<template>
  <div>
    <el-form-item label="占位内容">
      <el-input v-model="activeCom.options.placeholder"></el-input>
    </el-form-item>
    <el-form-item label="是否多选">
      <el-switch
        v-model="activeCom.options.multiple"
        @change="handleSelectMuliple"
      ></el-switch>
    </el-form-item>
    <el-form-item label="是否可搜索">
      <el-switch v-model="activeCom.options.filterable"></el-switch>
    </el-form-item>
    <el-form-item label="是否可清除选中">
      <el-switch v-model="activeCom.options.clearable"></el-switch>
    </el-form-item>
    <el-divider></el-divider>
    <el-form-item>
      <el-radio-group v-model="activeCom.options.remote" size="small">
        <el-radio-button :label="false">静态数据</el-radio-button>
        <el-radio-button :label="true">动态数据</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-radio-group
      v-model="activeCom.options.defaultValue"
      v-show="!activeCom.options.remote"
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
    <div v-show="activeCom.options.remote">
      <el-form-item label="URL">
        <el-input v-model="activeCom.options.remoteURL" />
      </el-form-item>
      <el-form-item label="请求参数">
        <el-input v-model="activeCom.options.requestParam" />
      </el-form-item>
      <el-form-item label="关联字段">
        <el-select v-model="activeCom.options.casModel">
          <el-option
            v-for="(select, index) in selectItems"
            :key="index"
            :label="select.name"
            :value="select.model"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入内容"
          v-model="activeCom.options.props.value"
          size="small"
        >
          <template slot="prepend">value</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入内容"
          v-model="activeCom.options.props.label"
          size="small"
        >
          <template slot="prepend">label</template>
        </el-input>
      </el-form-item>
    </div>
  </div>
</template>

<script>
import { judgeIsGrid } from 'utils';
import commonMixin from './common.mixin';

export default {
  name: 'SelectConfig',
  inject: ['formComponentList'],
  props: ['activeCom'],
  mixins: [commonMixin],
  computed: {
    selectItems() {
      const formItemList = [];
      judgeIsGrid(this.formComponentList, formItem => {
        formItemList.push(formItem);
      });
      return formItemList.filter(
        item => item.type === 'select' && item.key !== this.activeCom.key
      );
    }
  },
  methods: {
    handleSelectMuliple(value) {
      if (value) {
        if (this.activeCom.options.defaultValue) {
          this.activeCom.options.defaultValue = [
            this.activeCom.options.defaultValue
          ];
        } else {
          this.activeCom.options.defaultValue = [];
        }
      } else {
        if (this.activeCom.options.defaultValue.length > 0) {
          this.activeCom.options.defaultValue = this.activeCom.options.defaultValue[0];
        } else {
          this.activeCom.options.defaultValue = '';
        }
      }
    }
  }
};
</script>
