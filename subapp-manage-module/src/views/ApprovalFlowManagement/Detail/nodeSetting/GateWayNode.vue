<template>
  <div>
    <ProDrawer
      :visible="visible"
      :wrapperClosable="false"
      title="配置"
      :size="700"
      @close="handleClose"
      show-close
      class="drawer"
    >
      <el-form
        ref="elForm"
        :rules="rules"
        :model="nodeSetting"
        label-width="90px"
      >
        <el-row>
          <el-col>
            <el-form-item label="网关类型" prop="startType">
              <el-select v-model="nodeSetting.gatewayType" @change="handleGatewayChange">
                <el-option label="XOR" value="ExclusiveGateway" />
                <el-option label="AND" value="ParallelGateway" />
                <el-option label="OR" value="InclusiveGateway" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-table
              :data="nodeSetting.nodeConditionList"
              v-if="nodeSetting.gatewayType !== 'ParallelGateway' && gatewayType === 'split'"
              :key="tableKey"
            >
              <el-table-column label="优先级" width="80">
                <template slot-scope="{ row }">
                  <el-input v-model="row.index" placeholder="请输入数字" />
                </template>
              </el-table-column>
              <el-table-column label="节点" prop="name"  width="150" />
              <el-table-column label="条件" show-overflow-tooltip>
                <template slot-scope="{ row, $index }">
                  {{ row.conditionText }}
                </template>
              </el-table-column>
              <el-table-column label=" " width="50">
                <template slot-scope="{ row, $index }">
                  <i class="el-icon el-icon-s-tools" @click="updateCondition(row, $index)"></i>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-form>
      <template slot="footer">
        <el-button type="default" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </ProDrawer>
    <ProDialog
      :visible.sync="dialogVisable"
      title="条件编辑"
      width="600px"
      :close-on-click-modal="false"
      top="20vh"
    >
      <el-input v-model="conditionText" type="textarea" :rows="4" />
      <template #footer>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm"> 确 定 </el-button>
      </template>
    </ProDialog>
  </div>
</template>

<script>
import { ProDrawer, ProDialog } from 'anx-vue';
export default {
  data() {
    return {
      nodeSetting: {
        gatewayType: 'ExclusiveGateway',
        nodeConditionList: [],
      },
      rules: {},
      dialogVisable: false,
      conditionText: '',
      conditionRow: null,
      conditionIndex: 0,
      tableKey: Date.now()
    }
  },
  props: {
    visible: Boolean,
    nodeId: String,
    node: Object
  },
  computed: {
    gatewayType() {
      console.log('this.node', this.node)
      return this.node.businessObject ? this.node.businessObject.$attrs.gatewayType : ''
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
    },
    handleSubmit() {
      window.sessionStorage.setItem(this.nodeId, JSON.stringify(this.nodeSetting));
      this.$emit('submit', this.nodeSetting)
    },
    handleGatewayChange() {
      this.nodeSetting.nodeConditionList = this.node.outgoing.map((item, index) => ({
        index: index + 1,
        ...item.target,
        name: item.target.businessObject.name
      }));
    },
    updateCondition(row, index) {
      this.conditionIndex = index;
      this.conditionRow = row;
      this.conditionText = row.conditionText || '';
      this.dialogVisable = true;
    },
    confirm() {
      this.conditionRow.conditionText = this.conditionText;
      this.nodeSetting.nodeConditionList.splice(this.conditionIndex, 1, this.conditionRow);
      this.tableKey = Date.now();
      this.dialogVisable = false;
    },
    closeDialog() {
      this.conditionText = '';
      this.dialogVisable = false;
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        console.log('this.nodeSetting.nodeConditionList===', this.nodeSetting.nodeConditionList)
        if (window.sessionStorage.getItem(this.nodeId)) {
          this.nodeSetting = JSON.parse(window.sessionStorage.getItem(this.nodeId));
        } else {
          this.nodeSetting = {
            gatewayType: 'ExclusiveGateway',
            nodeConditionList: this.node.outgoing.map((item, index) => ({
              index: index + 1,
              ...item.target,
              name: item.target.businessObject.name
            }))
          }
        }
      }
    }
  },
  components: {
    ProDrawer,
    ProDialog
  }
}
</script>

<style lang="scss" scoped>
.drawer {
  ::v-deep .el-form-item {
    display: inline-block;
  }
}
</style>