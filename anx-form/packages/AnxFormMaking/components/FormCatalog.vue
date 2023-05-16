<template>
  <div class="anx-form-item-list" ref="formItemList">
    <div class="border-right" @mousedown="handleMouseDown"></div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="basicComponents">
        <template slot="title">
          <div class="com-title">基础字段</div>
        </template>
        <draggable
          v-model="basicComponents"
          v-bind="{
            group: { name: 'people', pull: 'clone', put: false },
            sort: false
          }"
          tag="ul"
          class="anx-form-items"
        >
          <li
            class="anx-form-item"
            v-for="item in basicComponents"
            :key="item.name"
            @click="addFormItem(item)"
            :title="item.name"
          >
            <!-- <i :class="[item.icon]"></i> -->
            <span>{{ item.name }}</span>
          </li>
        </draggable>
      </el-collapse-item>
      <el-collapse-item name="layoutComponents">
        <template slot="title">
          <div class="com-title">布局字段</div>
        </template>
        <draggable
          v-model="layoutComponents"
          v-bind="{
            group: { name: 'people', pull: 'clone', put: false },
            sort: false
          }"
          :move="checkMove"
          tag="ul"
          class="anx-form-items"
        >
          <li
            class="anx-form-item"
            v-for="item in layoutComponents"
            :key="item.name"
            @click="addFormItem(item)"
            :title="item.name"
          >
            <!-- <i :class="[item.icon]"></i> -->
            <span>{{ item.name }}</span>
          </li>
        </draggable>
      </el-collapse-item>
      <el-collapse-item
        v-for="item in cusComponents"
        :name="item.category"
        :key="item.category"
      >
        <template slot="title">
          <div class="com-title">{{ item.category }}</div>
        </template>
        <draggable
          v-model="item.components"
          v-bind="{
            group: { name: 'people', pull: 'clone', put: false },
            sort: false
          }"
          tag="ul"
          class="anx-form-items"
        >
          <li
            class="anx-form-item cus-components"
            v-for="comItem in item.components"
            :key="comItem.name"
            @click="addFormItem(comItem)"
            :title="comItem.name"
          >
            <i class="anx-icon-zujian"></i>
            <span>{{ comItem.name }}</span>
          </li>
        </draggable>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
export default {
  props: {
    basicComponents: Array,
    layoutComponents: Array
  },
  data() {
    return {
      activeNames: ['basicComponents', 'layoutComponents'],
      startX: 240,
      startWidth: 240
    };
  },
  inject: ['cusComponents'],
  methods: {
    checkMove(evt) {
      return evt.to.className !== 'draggable';
    },
    addFormItem(formItem) {
      this.$emit('addFormItem', { formItem });
    },
    handleMouseDown(e) {
      this.startWidth = this.$refs.formItemList.clientWidth;
      this.startX = e.pageX;
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
    },
    handleMouseMove(e) {
      const moveGap = this.startWidth + e.pageX - this.startX;
      document.body.style.cursor = 'e-resize';
      this.$refs.formItemList.style.width = moveGap + 'px';
    },
    handleMouseUp() {
      document.body.style.cursor = 'auto';
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mousemove', this.handleMouseUp);
    }
  },
  components: {
    draggable
  }
};
</script>

<style lang="scss" scoped>
.anx-form-item-list {
  min-width: 45px;
  width: 300px;
  padding: 5px 5px 0 10px;
  position: relative;
  box-sizing: border-box;
  overflow: auto;
  .border-right {
    position: absolute;
    width: 3px;
    right: 0;
    top: 0;
    bottom: 0;
    border-right: 1px solid #e1e1e1;
    cursor: e-resize;
  }
  .com-title {
    min-width: 17px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .anx-form-items {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding-right: 10px;
    .anx-form-item {
      width: 100%;
      padding: 0 15px;
      align-items: center;
      user-select: none;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      cursor: pointer;
      // margin: 5px;
      font-size: 16px;
      // height: 30px;
      // line-height: 30px;
      // text-align: left;
      border: 4px solid #fff;
      color: #4c69b7;
      background-color: #ecf1fc;
      border-radius: 10px;
      span {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      i {
        margin-left: 5px;
        margin-right: 10px;
      }
    }
    .anx-form-item:hover {
      cursor: pointer;
      background-color: #4c69b7;
      border: 4px solid #ecf1fc;
      color: rgba(255, 255, 255);
      // background-color: #4171f6;
      // border: 4px solid #f1f6fd;
    }
  }
}

::v-deep .el-collapse {
  height: 100%;
  border-top: 0;
  overflow: auto;
  box-sizing: border-box;
}
::v-deep .el-collapse-item__header {
  font-size: 16px;
  height: 40px;
  line-height: 40px;
}
</style>
