<template>
	<div class="task-setting" v-show="visible">
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
        
        <div class="setting" v-if="setting.value === 'user'">
          <div class="column-list">
            <div class="column-item" v-for="(userColumn, userColumnIndex) in setting.columnSetting">
              <el-select
                placeholder="请选择集团"
                v-model="userColumn.orgId"
                @change="val => handleOrgChange(userColumn)"
              >
                <el-option
                  :label="org.label"
                  :value="org.value"
                  v-for="org in orgList"
                  :key="org.value"
                />
              </el-select>
              <el-select
                placeholder="请选择机构"
                v-model="userColumn.hosId"
                @change="handleHosChange(userColumn)"
                @focus="getHosList(userColumn)"
              >
                <el-option
                  :label="hos.label"
                  :value="hos.value"
                  v-for="hos in userColumn.hosList"
                  :key="hos.value"
                />
              </el-select>
              <el-select
                placeholder="请选择科室类型"
                v-model="userColumn.deptType"
                @change="handleDeptTypeChange(userColumn)"
              >
                <el-option
                  :label="deptType.LABLE"
                  :value="deptType.VALUE"
                  v-for="deptType in deptTypeList"
                  :key="deptType.VALUE"
                />
              </el-select>
              <el-cascader
                v-model="userColumn.deptId"
                :options="userColumn.deptList"
                @change="handleDeptChange"
                @focus="getDeptList(userColumn)"
                :ref="'deptDicCascader' + userColumnIndex"
              />
              <el-select
                placeholder="请选择用户"
                v-model="userColumn.userId"
                @focus="getUserList(userColumn)"
              >
                <el-option
                  v-for="user in userColumn.userList"
                  :key="user.VALUE"
                  :label="user.LABEL"
                  :value="user.VALUE"
                />
              </el-select>
              <span class="add-icon" @click="addColumn(setting, 'user')" v-if="userColumnIndex === 0">
                <i class="el-icon el-icon-plus"></i>
              </span>
              <span class="delete-icon" v-else @click="deleteColumn(setting, userColumnIndex)">
                <i class="el-icon el-icon-delete"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="setting" v-if="setting.value === 'role'">
          <div class="column-list">
            <div class="column-item" v-for="(roleColumn, roleColumnIndex) in setting.columnSetting">
              <el-select
                placeholder="请选择集团"
                v-model="roleColumn.orgId"
                @change="val => handleOrgChange(roleColumn)"
              >
                <el-option
                  :label="org.label"
                  :value="org.value"
                  v-for="org in orgList"
                  :key="org.value"
                />
              </el-select>
              <el-select
                placeholder="请选择机构"
                v-model="roleColumn.hosId"
                @change="handleHosChange(roleColumn)"
                @focus="getHosList(roleColumn)"
              >
                <el-option
                  :label="hos.label"
                  :value="hos.value"
                  v-for="hos in roleColumn.hosList"
                  :key="hos.value"
                />
              </el-select>
              <el-select placeholder="请选择角色" v-model="roleColumn.roleId">
                <el-option
                  v-for="role in roleList"
                  :key="role.id"
                  :label="role.name"
                  :value="role.id"
                />
              </el-select>
              <span
                class="add-icon"
                @click="addColumn(setting, 'role')"
                v-if="roleColumnIndex === 0"
              >
                <i class="el-icon el-icon-plus"></i>
              </span>
              <span class="delete-icon" v-else @click="deleteColumn(setting, roleColumnIndex)">
                <i class="el-icon el-icon-delete"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="setting" v-if="setting.value === 'formAuth'">
          <el-radio-group v-model="setting.columnSetting.authType">
            <el-radio label="1">全部编辑</el-radio>
            <span class="color-text" @click="showFormAuthSetting('check')">查看</span>
            <el-radio label="2">自定义</el-radio>
            <span class="color-text" @click="showFormAuthSetting('edit')">编辑</span>
          </el-radio-group>
        </div>
        <div class="setting" v-if="setting.value === 'actionAuth'">
          <el-checkbox-group v-model="setting.columnSetting.authGroups">
            <el-checkbox label="1">允许退回</el-checkbox>
            <el-checkbox label="2">允许中止</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="setting" v-if="setting.value === 'dealNoti'">
          <el-radio-group v-model="setting.columnSetting.isOpen">
            <el-radio label="1">开启</el-radio>
            <el-radio label="2">关闭</el-radio>
          </el-radio-group>
          <p style="height: 10px;"></p>
          <el-checkbox-group v-model="setting.columnSetting.noticeGroups">
            <el-checkbox label="1">待办</el-checkbox>
            <el-checkbox label="2">通过</el-checkbox>
            <el-checkbox label="3">退回</el-checkbox>
            <el-checkbox label="4">中止</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="actions">
          <i class="el-icon el-icon-delete" @click="deleteSetting(settingIndex)"></i>
        </div>
      </div>
    </div>
    <FormAuthSetting
      :visible.sync="formAuthSettingVisible"
      :mode="formAuthSettingMode"
    ></FormAuthSetting>
    <div class="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="saveSetting">确定</el-button>
    </div>
  </div>
</template>

<script>
import FormAuthSetting from './FormAuthSetting';
import {
  getOrgOrHosOptions,
  getDictionary,
  getDeptDoctorOptions,
  onQueryRole
} from '@/api/modules/systemAdmin';

export default {
  data() {
    return {
      dropDownList: [
        {
          index: 1,
          label: '指定用户',
          value: 'user',
          columnSetting: [{
            orgId: '',
            hosId: '',
            deptId: '',
            userId: ''
          }]
        },
        {
          index: 2,
          label: '指定角色',
          value: 'role',
          columnSetting: [{
            orgId: '',
            hosId: '',
            roleId: ''
          }]
        },
        // { index: 3, label: '处理方式', value: 'dealType', },
        {
          index: 3,
          label: '表单权限',
          value: 'formAuth',
          columnSetting: { authType: '1' }
        },
        {
          index: 4,
          label: '操作权限',
          value: 'actionAuth',
          columnSetting: { authGroups: [] }
        },
        {
          index: 5,
          label: '处理通知',
          value: 'dealNoti',
          columnSetting: { isOpen: '1', noticeGroups: [] }
        }
      ],
      orgList: [],
      deptTypeList: [],
      roleList: [],
      settingList: [],
      userSetting: {},
      formAuthSettingVisible: false,
      formAuthSettingMode: ''
    }
  },
  props: {
    visible: Boolean,
    nodeId: String,
  },
  async mounted() {
    this.getDictionary();
    this.orgList = await this.getOrgOrHosOptions('', '')
    this.getRoleList();
  },
  methods: {
    // 获取机构科室
    async getOrgOrHosOptions(parentId, deptType) {
      try {
        const res = await getOrgOrHosOptions({
          parentId,
          branchFlg: 'Y',
          deptType
        });
        return res.result
      } catch(err) {
        console.error(err);
      }
    }, 
    // 获取科室类型
    async getDictionary() {
      try {
        const res = await getDictionary({ code: 'DEPT_CLASSIFY' });
        console.log('getDictionary==', res);
        this.deptTypeList = res.result;
      } catch(err) {
        console.error(err);
      }
    },

    // 根据科室获取医生
    async getDeptDoctorOptions(deptId) {
      try {
        const res = await getDeptDoctorOptions({
          deptId
        });
        return res.result;
      } catch(err) {
        console.error(err)
      }
    },

    // 获取角色列表
    async getRoleList() {
      try {
        const res = await onQueryRole({
          pageNum: 1,
          pageSize: 100000
        });
        this.roleList = res.result.records;
        console.log('roleList', res)
      } catch(err) {
        console.error(err)
      }
    },

    // 增加配置项
    addSetting(dropDown) {
      const hasExitSetting = this.settingList.find(item => item.value === dropDown.value);
      if (hasExitSetting) {
        this.$message.warning(`${hasExitSetting.label}配置已存在`);
        return;
      }
      this.settingList.push(JSON.parse(JSON.stringify(dropDown)));
      this.settingList.sort((a, b) => a.index - b.index);
    },

    // 删除配置项
    deleteSetting(index) {
      this.settingList.splice(index, 1);
    },

    // 增加用户或者角色行
    addColumn(setting, type) {
      const objMap = {
        user: {
          orgId: '',
          hosId: '',
          deptId: '',
          userId: ''
        },
        role: {
          orgId: '',
          hosId: '',
          roleId: '',
        }
      }
      setting.columnSetting = setting.columnSetting.concat(objMap[type]);
    },

    // 删除用户或者角色行
    deleteColumn(setting, index) {
      setting.columnSetting.splice(index, 1);
    },

    // 获取机构
    async getHosList(column) {
      column.hosList = await this.getOrgOrHosOptions(column.orgId, '');
      this.$forceUpdate(); 
    },

    // 获取科室
    async getDeptList(column) {
      column.deptList = await this.getOrgOrHosOptions(column.hosId, column.deptType);
      this.$forceUpdate();
    },

    // 获取用户
    async getUserList(column) {
      column.userList = await this.getDeptDoctorOptions(column.deptId[column.deptId.length - 1]);
      this.$forceUpdate();
    },

    // 集团改变
    handleOrgChange(column) {
      column.hosId = ''
      column.hosList = []
      this.handleHosChange(column)
    },

    // 机构改变
    handleHosChange(column) {
      if (column.hasOwnProperty('deptType')) {
        column.deptType = ''
        this.handleDeptTypeChange(column)
      } else {
        column.roleId = ''
      }
    },

    // 科室类型改变
    handleDeptTypeChange(column) {
      column.deptId = ''
      column.deptList = []
      this.handleDeptChange(column)
    },

    // 科室改变
    handleDeptChange(column) {
      column.userId = ''
      column.userList = []
    },

    // 显示表单配置
    showFormAuthSetting(mode) {
      this.formAuthSettingMode = mode;
      this.formAuthSettingVisible = true
    },

    // 保存配置
    saveSetting() {
      const result = {}
      this.settingList.forEach(item => {
        if (item.value === 'user') {
          item.columnSetting = item.columnSetting.map((columnItem, columnIndex) => {
            const orgName = this.orgList.find(org => org.value === columnItem.orgId).label
            const hosName = columnItem.hosList.find(hos => hos.value === columnItem.hosId).label
            const deptTypeName = this.deptTypeList.find(deptType => deptType.VALUE === columnItem.deptType).LABLE
            const deptName = this.$refs['deptDicCascader' + columnIndex][0].getCheckedNodes()[0].pathLabels
            console.log('columnItem.userList', columnItem.userList)
            const userName = columnItem.userList.find(user => user.VALUE === columnItem.userId).LABEL
            return {
              orgId: columnItem.orgId,
              orgName,
              hosId: columnItem.hosId,
              hosName,
              deptType: columnItem.deptType,
              deptTypeName,
              deptId: columnItem.deptId,
              deptName,
              userId: columnItem.userId,
              userName
            }
          })
        } else if (item.value === 'role') {
          item.columnSetting = item.columnSetting.map((columnItem, columnIndex) => {
            const orgName = this.orgList.find(org => org.value === columnItem.orgId).label
            const hosName = columnItem.hosList.find(hos => hos.value === columnItem.hosId).label
            const roleName = this.roleList.find(role => role.id === columnItem.roleId).name
            return {
              orgId: columnItem.orgId,
              orgName,
              hosId: columnItem.hosId,
              hosName,
              roleId: columnItem.roleId,
              roleName
            }
          })
        }
        result[item.value] = item.columnSetting;
      });
      window.sessionStorage.setItem(this.nodeId, JSON.stringify(result));
      this.$emit('update:visible', false);       
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        let settings = window.sessionStorage.getItem(this.nodeId)
        const result = []
        if (settings) {
          settings = JSON.parse(settings);
          for(const key in settings) {
            if (key === 'user') {
              settings[key].forEach(item => {
                item.hosList = [{ label: item.hosName, value: item.hosId }]
                item.userList = [{ LABEL: item.userName, VALUE: item.userId }]
                const deptList = []
                item.deptId.forEach((deptId, index) => {
                  deptList.push({ value: deptId, label: item.deptName[index] })
                })
                for(let i = deptList.length - 1; i > 0; i--) {
                  deptList[i - 1] = {...deptList[i - 1], children: [deptList[i]]}
                }
                item.deptList = deptList.splice(0, 1)
              })
            } else if (key === 'role') {
              settings[key].forEach(item => {
                item.hosList = [{ label: item.hosName, value: item.hosId }]
              })
            }
             result.push({
              label: this.dropDownList.find(item => item.value === key).label,
              value: key,
              columnSetting: settings[key]
            })
          }
        }
        this.settingList = result || []
      }
    }
  },
  components: {
    FormAuthSetting
  }
}
</script>

<style lang="scss" scoped>
.task-setting {
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
    overflow: auto;
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
        ::v-deep.el-select {
          width: 180px;
          margin-right: 10px
        }
        ::v-deep.el-radio {
          margin-right: 10px;
        }
        .color-text {
          color: #446ABD;
          font-size: 14px;
          margin-right: 30px;
          cursor: pointer;
        }
        .add-icon {
          border: 1px solid #446ABD;
          display: inline-block;
          width: 38px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          cursor: pointer;
          .el-icon {
            color: #446ABD;
            font-size: 20px;
          }
        }
        .column-list {
          .column-item {
            padding-bottom: 10px;
            .el-icon-delete {
              color: red;
            }
          }
        }
      }
      .actions {
        border-bottom: 1px solid #aaa;
        padding: 10px 0;
        width: 50px;
        text-align: center;
        .el-icon {
          color: #446ABD
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