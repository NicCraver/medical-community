<template>
  <div>
    <el-drawer
      :visible.sync="visible"
      direction="rtl"
      :modal="false"
      size="470px"
      @click.native="handleClick($event)"
      :before-close="handleBeforeClose"
      @opened="handleDrawerOpen"
    >
      <div slot="title">
        <svg
          t="1608103240430"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="13536"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="20"
          height="20"
          v-if="locked"
          @click="locked = false"
        >
          <path
            d="M357.0474484 32.37960459c-7.24077344 7.24077344-10.13708282 16.65377891-8.68892813 28.23901641 7.96485078 36.2038672 25.70474571 66.25307697 52.13356876 91.23374534l-29.32513243 250.16872233c-31.49736446 16.29174024-59.73638087 36.56590587-84.35501056 61.18453556-26.42882305 26.42882305-47.7891047 56.47803283-63.71880627 89.78559065-16.29174024 33.66959649-26.42882305 69.87346369-30.77328712 108.97364026-1.08611602 9.77504414 1.81019336 17.73989493 7.96485079 24.6186297 6.15465742 6.87873477 13.75746953 10.13708282 23.53251367 10.49912148l268.27065593 0.36203868 0 290.35501491c0 8.68892813 2.89630938 15.92970157 8.32688946 21.36028165 5.79261875 5.79261875 12.67135352 8.32688946 21.36028164 8.32688945 8.68892813 0 15.92970157-2.89630938 21.36028165-8.32688945 5.79261875-5.79261875 8.32688946-12.67135352 8.32688945-21.36028165L551.46221524 697.444645 819.73287117 697.80668367c8.68892813 0 16.29174024-3.25834805 22.80843634-9.77504415s9.41300547-14.48154688 8.68892812-25.34270703c-6.15465742-57.56414884-26.06678438-109.33567893-57.56414884-154.59051293-32.58348048-45.61687267-72.76977307-80.73462385-122.00703245-106.07733089l-29.32513243-250.16872233 3.98242539-3.98242539c24.25659102-24.25659102 40.54833126-53.58172345 47.7891047-88.33743596 1.81019336-9.77504414-0.36203867-17.73989493-6.15465742-24.98066837-5.79261875-7.24077344-13.75746953-10.86116016-23.89455235-11.5852375L378.76976872 22.96659912c-9.0509668 0.36203867-15.92970157 3.62038672-21.72232032 9.41300547z m252.34095436 56.8400715c-2.89630938 3.62038672-6.15465742 7.60281211-10.13708282 11.5852375l-26.06678438 24.6186297 36.2038672 318.59403133 31.49736446 16.29174024c39.82425392 20.27416563 72.04569572 48.87522072 98.1124801 85.07908791 18.1019336 26.06678438 31.49736446 54.66783947 39.46221525 85.80316526l-513.37083685-0.72407735c4.34446406-16.65377891 10.13708282-32.58348048 17.73989492-48.87522071 13.39543086-26.42882305 30.77328712-50.3233754 52.13356877-71.68365705 19.91212696-19.91212696 42.35852462-36.56590587 67.70123166-49.59929806l31.49736446-16.29174024 36.20386719-318.59403133-23.89455235-22.44639767c-4.70650274-3.98242539-9.0509668-8.32688946-12.30931484-13.75746953L609.38840276 89.21967609z"
            p-id="13537"
            fill="#409EFF"
          ></path>
        </svg>
        <svg
          t="1608103116905"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="11100"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="20"
          height="20"
          v-else
          @click="locked = true"
        >
          <path
            d="M696.32 108.544c-10.24 0-18.944 4.608-26.112 13.824-19.968 31.232-28.672 65.024-27.648 101.376l-197.632 156.16c-33.792-10.752-68.096-16.384-102.912-16.384-37.376 0-73.728 6.144-108.544 18.432-35.328 12.288-68.096 30.72-98.816 55.296-7.68 6.144-11.264 13.824-11.776 23.04-0.512 9.216 2.56 16.896 9.216 24.064l189.44 189.952-205.312 205.312c-6.144 6.144-9.216 13.312-9.216 20.992 0 8.192 3.072 14.848 9.216 20.992 6.144 6.144 13.312 9.216 20.992 9.216 8.192 0 14.848-3.072 20.992-9.216L363.52 716.288 552.96 906.24c6.144 6.144 13.824 9.216 23.04 9.216s16.896-3.584 24.064-11.776c36.352-45.056 58.88-95.744 68.608-150.016 9.216-55.296 5.632-108.544-11.264-161.28l156.16-197.632h5.632c34.304 0 66.56-9.216 96.256-28.672 8.192-5.632 12.288-12.8 13.312-22.016 1.024-9.216-2.048-17.408-8.704-25.088L718.336 117.248c-6.656-6.144-13.824-8.704-22.016-8.704z m138.24 218.624c-4.608 0.512-9.728 1.024-15.36 1.024l-35.84-1.024-199.68 250.88 10.752 33.792c13.824 42.496 16.384 85.504 9.216 129.536-5.632 31.232-16.384 60.928-32.768 88.576l-362.496-363.52c14.848-8.704 30.208-15.872 47.104-22.016 28.16-9.216 57.344-13.824 87.552-13.824 28.16 0 55.808 4.096 82.944 12.8l33.792 10.752 250.88-199.68-1.024-32.768c-0.512-6.144-0.512-12.288 1.024-18.432L834.56 327.168z"
            p-id="11101"
            fill="#707070"
          ></path>
        </svg>
      </div>
      <div class="flex-container">
        <el-form
          label-width="0px"
          style="padding: 0 10px;"
          @submit.native.prevent
        >
          <el-row>
            <el-col>
              <el-form-item>
                <el-input
                  placeholder="请输入方法名/标题"
                  v-model="queryParams.solutionName"
                  size="small"
                  @keyup.native.enter="getApiFunList(1)"
                />
              </el-form-item>
            </el-col>

            <el-col :span="20">
              <el-form-item>
                <el-select
                  v-model="queryParams.classifications"
                  multiple
                  filterable
                  placeholder="请选择分类"
                  size="small"
                  @change="getApiFunList(1)"
                >
                  <el-option
                    v-for="item in apiCategories"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label-width="0" align="center">
                <el-button type="primary" size="small" @click="addApiFun"
                  >新增</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style="flex: 1" ref="tableWrapper">
          <el-table :data="apiList" :height="tableHeight">
            <el-table-column type="expand">
              <template slot-scope="props">
                <v-md-preview :text="props.row.remark"></v-md-preview>
              </template>
            </el-table-column>
            <el-table-column label="方法名" prop="methodName" align="center" />
            <el-table-column label="标题" prop="title" align="center" />
            <el-table-column label="操作" align="center" width="100px">
              <template slot-scope="{ row }">
                <el-button
                  size="small"
                  type="text"
                  style="color: #f56c6c"
                  @click="deleteApiFun(row)"
                  >删除</el-button
                >
                <el-button size="small" type="text" @click="updateApiFun(row)"
                  >编辑</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          :page-size="pageSize"
          :total="total"
          :current-page.sync="currentPage"
          @current-change="getApiFunList"
          style="padding: 10px 0;"
        />
      </div>
    </el-drawer>

    <el-dialog
      :visible.sync="dialogVisable"
      title="API设置"
      width="90%"
      top="30px"
      @click.native="handleClick($event)"
    >
      <el-form :model="apiFunDetail" :rules="rules" ref="ruleForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类" prop="classification">
              <el-select
                v-model="apiFunDetail.classification"
                filterable
                allow-create
                default-first-option
                placeholder="请选择分类"
                size="small"
              >
                <el-option
                  v-for="item in apiCategories"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="方法名" prop="methodName">
              <el-input
                placeholder="请输入方法名"
                v-model="apiFunDetail.methodName"
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题">
              <el-input
                placeholder="请输入标题"
                v-model="apiFunDetail.title"
                size="small"
              />
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="代码">
              <div
                id="api-fun-editor"
                style="height: 500px;width: 100%"
                v-show="editor"
              ></div>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="说明">
              <v-md-editor
                v-model="apiFunDetail.remark"
                height="400px"
              ></v-md-editor>
            </el-form-item>
          </el-col>
          <el-col style="text-align: center;">
            <el-button type="primary" @click="submitApiFun">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import eventBus from 'utils/event-bus';

export default {
  inject: ['httpDomain'],
  data() {
    return {
      locked: false,
      visible: false,
      queryParams: {
        solutionName: '',
        classifications: []
      },
      tableHeight: '0',
      apiList: [],
      dialogVisable: false,
      apiFunDetail: {
        id: '',
        classification: '',
        methodName: '',
        title: '',
        methodCode: '',
        remark: ''
      },
      rules: {
        classification: [
          {
            required: true,
            message: '请选择分类',
            trigger: 'blur'
          }
        ],
        methodName: [
          {
            required: true,
            message: '请输入方法名',
            trigger: 'blur'
          }
        ]
      },
      editor: null,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      apiCategories: []
    };
  },
  mounted() {
    document.getElementById('app').addEventListener('click', () => {
      if (!this.locked) {
        this.visible = false;
      }
    });
    eventBus.$on('[global/showApiFun]', async () => {
      this.visible = true;
      const result = await this.getApiFunCategoryList();
      this.apiCategories = result.data.data.map(item => ({
        ...item,
        label: item.desc,
        value: item.dicId
      }));
      this.getApiFunList(1);
    });
  },
  beforeDestroy() {
    eventBus.$off('[global/showApiFun]');
  },
  methods: {
    getApiFunCategoryList() {
      return axios.post(
        `${this.httpDomain}/templateMethod/getTemplateMethodClassification`,
        {
          ad: '123'
        }
      );
    },
    getApiFunList(currentPage) {
      this.currentPage = currentPage;
      axios
        .post(`${this.httpDomain}/templateMethod/getTemplateByParam`, {
          ...this.queryParams,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          const result = res.data;
          if (result.code === 1) {
            this.apiList = result.data.list;
            this.total = result.data.total;
          }
        });
    },
    addApiFun() {
      for (let key in this.apiFunDetail) {
        this.apiFunDetail[key] = '';
      }
      this.dialogVisable = true;
      this.createEditor();
    },
    toogleShowHideDom(dom1, values, showDoms, hideDoms) {
      var value = document.querySelector(dom1).value;
      if (values.indexOf(value) > -1) {
        for (var i = 0; i < showDoms.length; i++) {
          document.querySelector(showDoms[i]).style.display = '';
        }
        for (var j = 0; j < hideDoms.length; j++) {
          document.querySelector(hideDoms[j]).style.display = 'none';
        }
      }
    },
    deleteApiFun(row) {
      this.$messageBox
        .confirm('确定删除该方法？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          axios
            .post(`${this.httpDomain}/templateMethod/onDeleteTemplateMethod`, {
              id: row.id
            })
            .then(res => {
              if (res.data.code === 1) {
                this.$message.success('删除成功');
                this.getApiFunList(1);
              }
            });
        })
        .catch(() => {});
    },
    updateApiFun(row) {
      for (const key in this.apiFunDetail) {
        this.apiFunDetail[key] = row[key];
      }
      this.dialogVisable = true;
      this.createEditor(this.apiFunDetail.methodCode);
    },
    submitApiFun() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          axios
            .post(`${this.httpDomain}/templateMethod/onSaveTemplateMethod`, {
              ...this.apiFunDetail,
              methodCode: this.editor.getValue()
            })
            .then(res => {
              if (res.data.code === 1) {
                if (this.apiFunDetail.id) {
                  this.$message.success('更新成功');
                } else {
                  this.$message.success('新增成功');
                }
                this.dialogVisable = false;
                this.getApiFunList(1);
              }
            });
        }
      });
    },
    createEditor(value) {
      this.$nextTick(() => {
        if (window.ace) {
          if (!this.editor) {
            this.editor = window.ace.edit('api-fun-editor'); // 这个地方就是id是editor的div
            this.editor.session.setMode('ace/mode/javascript');
            this.editor.setTheme('ace/theme/xcode');
            this.editor.setOptions({
              fontSize: 16,
              enableBasicAutocompletion: true, // 启用基本自动完成
              enableSnippets: true, // 启用代码段
              enableLiveAutocompletion: true, // 启用实时自动完成
              enableEmmet: true // 启用Emmet
            });
          }
          this.editor.setValue(value || '');
        }
      });
    },
    handleClick(e) {
      e.stopPropagation();
    },
    handleBeforeClose(done) {
      !this.locked && done();
    },
    handleDrawerOpen() {
      this.tableHeight = this.$refs.tableWrapper.clientHeight;
    }
  },
  components: {
    // VMarkEditor
    // VMdEditor,
    // VMdPreview
  }
};
</script>

<style lang="scss" scoped>
.flex-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.el-drawer__wrapper {
  width: 470px;
  left: auto;
  svg {
    cursor: pointer;
  }
  ::v-deep .el-drawer__container {
    .el-drawer {
      border-left: 1px solid #ddd;
    }
    .el-drawer:focus {
      outline: none;
    }
    .el-drawer__close-btn {
      outline: none;
    }
  }
}
</style>
