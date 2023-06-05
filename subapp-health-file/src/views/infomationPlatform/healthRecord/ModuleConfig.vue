<!--
  @description 健康档案共享调阅-系统配置-模块配置
  @date 2022/1/12
-->

<template>
  <div class="module-config">
    <ProLayout mainBgColor="#F5F5F5" padding="0" margin="10">
      <template #title>模块列表</template>
      <template #main>
        <el-card>
          <el-table
            ref="table"
            v-adaptive="{ bottomOffset: 72 }"
            height="0"
            :data="moduleList"
            v-loading="loading"
            border
            row-key="deptId"
            default-expand-all
            @selection-change="handleSelectionChange"
            @select-all="handleSelectAll"
            @select="handleSelect"
            :tree-props="{ children: 'childTreeDto' }"
            >>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="模块名称" prop="deptName"></el-table-column>
            <el-table-column label="代码" prop="deptCode"></el-table-column>
            <el-table-column label="状态" prop="status">
              <template slot-scope="{ row }">
                {{ row.status == "1" ? "可见" : "不可见" }}
              </template>
            </el-table-column>
          </el-table>
          <div class="operate">
            <el-button plain @click="resetSelection">重置</el-button>
            <el-button plain @click="getList">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </div>
        </el-card>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from "anx-vue";
import {
  getModuleList,
  saveModuleList,
} from "api/infomationPlatform/healthRecord.js";

export default {
  components: { ProLayout },
  data() {
    return {
      moduleList: [], //模块列表
      loading: false,
      multipleSelection: [], //选中的数据
      isChange: false, //是否有未保存的内容
      data: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取模块列表
    getList() {
      this.loading = true;
      getModuleList()
        .then((res) => {
          this.moduleList = res.result;
          this.loading = false;
          this.data = [];
          this.getData(res.result);
          this.$nextTick(() => {
            this.selectTableData();
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 重置
    resetSelection() {
      this.$confirm("是否确认重置(设为全部可见)？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.data.forEach((row) => {
            row.status = "1";
          });
          this.save();
        })
        .catch(() => {});
    },
    // 保存
    save() {
      this.loading = true;
      saveModuleList(this.data)
        .then((res) => {
          this.isChange = false;
          this.getList();
          this.$message.success("保存成功");
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 格式化列表：选中可见行
    selectTableData() {
      this.data.forEach((row) => {
        if (row.status == "1") {
          this.$refs.table.toggleRowSelection(row, true);
        }
      });
    },
    // 勾选数据行的 Checkbox
    handleSelect(selection, current) {
      // 切换状态
      current.status = current.status == "1" ? "0" : "1";
      // 有更改
      this.isChange = true;

      // 判断selection中是否存在current,若存在代表被勾选,若不存在代表取消勾选
      const isChecked = !!selection.find(
        (item) => item.deptId === current.deptId
      );
      if (isChecked) {
        // 如果当前项被勾选
        // 其所有的祖先也应该被勾选
        this.checkedParents(selection, current);
        // 其所有的后代都要被勾选
        this.toggleCheckedChildrens(selection, current, true);
      } else {
        // 如果当前项被取消勾选
        // 若同一组的元素都被取消勾选了,那么父元素将也被取消勾选
        this.uncheckedParents(selection);
        // 其所有的后代也应该被取消勾选
        this.toggleCheckedChildrens(selection, current, false);
      }
    },
    // 全选/全不选
    handleSelectAll() {
      // 有更改
      this.isChange = true;

      const isAllSelected = this.$refs.table.store.states.isAllSelected;
      let _handleSelectAll = (data) => {
        data.forEach((item) => {
          item.status = isAllSelected ? "1" : "0";
          this.$refs.table.toggleRowSelection(item, isAllSelected);
          _handleSelectAll(item.childTreeDto || []);
        });
      };
      _handleSelectAll(this.moduleList);
    },
    // 选择项发生变化
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    // 数据去掉树形,用于保存和重置
    getData(data) {
      data.forEach((item) => {
        if (item.childTreeDto && item.childTreeDto.length > 0) {
          this.getData(item.childTreeDto);
        }
        this.data.push(item);
      });
    },
    checkedParents(selection, current) {
      var _checkedParents = (data) => {
        return data.find((element) => {
          if (element.deptId === current.deptId) {
            return true;
          } else if (_checkedParents(element.childTreeDto || [])) {
            element.status = "1";
            this.$refs.table.toggleRowSelection(element, true);
            if (!selection.find((item) => item.deptId === element.deptId)) {
              selection.push(element);
            }
            return true;
          } else {
            return false;
          }
        });
      };
      _checkedParents(this.moduleList);
    },
    uncheckedParents(selection) {
      var _uncheckedParents = (element) => {
        const children = element.childTreeDto;
        if (children && children.length) {
          const allChildrenUnChecked = children.every((child) => {
            return _uncheckedParents(child);
          });
          if (allChildrenUnChecked) {
            element.status = "0";
            this.$refs.table.toggleRowSelection(element, false);
            for (let i = selection.length - 1; i >= 0; i--) {
              if (selection[i].deptId === element.deptId) {
                selection.splice(i, 1);
                break;
              }
            }
          }
        }
        return !selection.find((item) => item.deptId === element.deptId);
      };
      this.moduleList.forEach((element) => {
        _uncheckedParents(element);
      });
    },
    toggleCheckedChildrens(selection, item, isChecked) {
      var _toggleCheckedChildrens = (data) => {
        data.find((element) => {
          element.status = isChecked ? "1" : "0";
          this.$refs.table.toggleRowSelection(element, isChecked);
          if (
            isChecked &&
            !selection.find((item) => item.deptId === element.deptId)
          ) {
            selection.push(element);
          } else if (
            !isChecked &&
            selection.find((item) => item.deptId === element.deptId)
          ) {
            for (let i = selection.length - 1; i >= 0; i--) {
              if (selection[i].deptId === element.deptId) {
                selection.splice(i, 1);
                break;
              }
            }
          }
          _toggleCheckedChildrens(element.childTreeDto || []);
        });
      };
      _toggleCheckedChildrens(item.childTreeDto || []);
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.isChange) {
      this.$confirm(
        "检测到未保存的内容，是否在离开页面前保存修改？",
        "确认信息",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "保存",
          cancelButtonText: "放弃修改",
        }
      )
        .then(() => {
          this.save();
          next();
        })
        .catch((action) => {
          if (action === "cancel") {
            next();
          }
        });
    } else {
      next();
    }
  },
};
</script>

<style src="@/assets/css/infomationPlatform.css" scoped></style>
<style lang="scss" scoped>
.module-config {
  height: 100%;
  .el-card {
    height: 100%;
    padding: 10px;
    .operate {
      margin-top: 20px;
      .el-button {
        float: right;
        margin-left: 10px;
      }
    }
  }
}
</style>