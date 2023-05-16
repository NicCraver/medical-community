<template>
	<div class="service-task" v-show="visible">
    <div>
      <el-dropdown split-button type="primary">
        新增配置项
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in dropDownList"
            :key="item.value"
            :command="item.value"
            @click.native="addSetting(item)"
          >{{ item.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="setting-list">
      <div
        class="setting-item"
        v-for="(setting, settingIndex) in settingList"
        :key="setting.value"
      >
        <div class="title">{{ setting.label }}</div>
        <div class="setting" v-if="setting.value === 'doSomething'">
          <el-radio-group v-model="setting.columnSetting.doSomething">
            <el-radio label="on">开启</el-radio>
            <span v-if="setting.columnSetting.doSomething === 'on'">
              自动
              <el-select
                v-model="setting.columnSetting.onType"
                style="width: 90px; margin-right: 20px"
              >
                <el-option label="关闭" value="close" />
                <el-option label="其他" value="other" />
              </el-select>
            </span>
            <el-radio label="off">关闭</el-radio>
          </el-radio-group>
        </div>
        <div class="setting" v-if="setting.value === 'notify'">
          <el-select
            v-model="setting.columnSetting.userTaskId"
            @change="handleChange"
          >
            <el-option
              v-for="item in userTaskList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
          <div v-if="nodeUserList.length">
            <span class="node-title">指定用户</span>
            <ul>
              <li v-for="(item, index) in nodeUserList" :key="index">
                {{ item.orgName }}
                <span class="connect">></span>
                {{ item.hosName }}
                <span class="connect">></span> {{ item.deptTypeName }}
                <span class="connect">></span>
                {{ item.deptName.join('-') }}
                <span class="connect">></span>
                {{ item.userName }}
              </li>
            </ul>
          </div>
          <div v-if="nodeRoleList.length">
            <span class="node-title">指定角色</span>
            <ul>
              <li v-for="(item, index) in nodeRoleList" :key="index">
                {{ item.orgName }}
                <span class="connect">></span>
                {{ item.hosName }}
                <span class="connect">></span>
                {{ item.roleName }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="saveSetting">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dropDownList: [
        {
          index: 1,
          label: '处理',
          value: 'doSomething',
          columnSetting: {
            doSomething: 'on',
            onType: ''
          }
        },
        {
          index: 2,
          label: '通知',
          value: 'notify',
          columnSetting: {
            userTaskId: ''
          }
        }
      ],
      settingList: [],
      nodeUserList: [],
      nodeRoleList: [],
    }
  },
  props: ['visible', 'nodeId', 'userTaskList'],
  methods: {
    addSetting(dropDown) {
      const hasExitSetting = this.settingList.find(item => item.value === dropDown.value);
      if (hasExitSetting) {
        this.$message.warning(`${hasExitSetting.label}配置已存在`);
        return;
      }
      this.settingList.push(JSON.parse(JSON.stringify(dropDown)));
      this.settingList.sort((a, b) => a.index - b.index);
    },
    handleChange(userTaskId) {
      const { setting } = this.userTaskList.find(item => item.id === userTaskId)
      this.nodeUserList = setting.user || []
      this.nodeRoleList = setting.role || []
    },
    saveSetting() {
      const result = {}
      this.settingList.forEach(item => {
        if (item.value === 'notify') {
          result[item.value] = {
            ...item.columnSetting,
            user: this.nodeUserList,
            role: this.nodeRoleList
          }
        } else {
          result[item.value] = item.columnSetting
        }
      })
      window.sessionStorage.setItem(this.nodeId, JSON.stringify(result));
      this.$emit('update:visible', false);  
    }
  }
}
</script>

<style lang="scss" scoped>
.service-task {
  position: absolute;
  left: 0;
  right: 0;
  top: 0px;
  bottom: 0;
  background-color: #fff;
  z-index: 1;
  display: flex;
  flex-direction: column;
  .setting-list {
    margin-top: 30px;
    flex: 1;
    .setting-item {
      display: flex;
      .title {
        padding: 10px 0;
        width: 100px;
        text-align: center;
      }
      .setting {
        flex: 1;
        border-bottom: 1px solid #aaa;
        border-right: 1px solid #aaa;
        padding: 10px 0;
        ::v-deep .el-radio {
          margin-right: 20px
        }
        .node-title {
          display: inline-block;
          font-size: 16px;
          font-weight: bold;
          margin: 10px 0;
        }
        .connect {
          font-weight: bold;
        }
      }
    }
  }
  .footer {
    border-top: 1px solid #aaa;
    text-align: right;
    padding: 10px;
    background-color: #fff;
  }
}
</style>