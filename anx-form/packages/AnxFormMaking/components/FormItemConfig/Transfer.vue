<template>
  <div>
    <el-form-item label="左侧标题">
      <el-input
        placeholder="请输入左侧标题"
        v-model="activeCom.options.titles[0]"
      />
    </el-form-item>
    <el-form-item label="右侧标题">
      <el-input
        placeholder="请输入右侧标题"
        v-model="activeCom.options.titles[1]"
      />
    </el-form-item>
    <el-form-item label="数据">
      <el-checkbox-group v-model="activeCom.options.defaultValue">
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
                  style="width: 120px"
                  size="mini"
                  v-model="item.value"
                ></el-input>
              </span>
              <br />
              <span style="display: inline-block;margin:5px 0 0px 3px">
                label:
                <el-input
                  style="width:120px;"
                  size="mini"
                  v-model="item.label"
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
      </el-checkbox-group>
      <el-button @click="addMethod()" type="text">添加选项</el-button>
    </el-form-item>
  </div>
</template>

<script>
import commonMixin from './common.mixin';

export default {
  name: 'TransferConfig',
  props: ['activeCom'],
  mixins: [commonMixin]
};
</script>
