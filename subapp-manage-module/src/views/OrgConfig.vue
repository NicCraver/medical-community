<template>
  <div class="RoleAdmin">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>医院配置管理</template>
      <template #main>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <el-input placeholder="医院名称" v-model="queryParams.hosName" clearable />
          </template>
          <template #actions>
            <el-button type="primary" @click="onInquire()">搜索</el-button>
            <el-button @click="resetQueryParams">重置</el-button>
          </template>
          <el-table
            v-adaptive="{ bottomOffset: 59 }"
            height="0"
            ref="singleTable"
            :data="tableDataList"
            border
            v-loading="loading"
            row-key="id"
          >
            <el-table-column label="序号" prop="seq"/>
            <el-table-column label="医院名称" prop="orgName" show-overflow-tooltip />
            <el-table-column label="所属集团" prop="groupName" />
            <el-table-column label="短信验证码发送开关" prop="smsSendCodeFlg">
              <template slot-scope="{row}">
                <el-switch
                  v-model = "row.smsSendCodeFlg == 0"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="短信发送开关" prop="smsSendMesFlg">
              <template slot-scope="{row}">
                <el-switch
                  v-model = "row.smsSendMesFlg == 0"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="EXCEL导入模板类型" prop="excelTemplateType" />
            <el-table-column label="EXCEL模板下载地址" prop="excelTemplateDownloadUrl" />
            <el-table-column label="操作" fixed="right" width="160">
              <template slot-scope="{ row }">
                <el-button type="text" @click="onEdit(row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </ProList>
      </template>
    </ProLayout>
    <ProDialog
      :longContent="true"
      :visible.sync="rootFormFlag"
      :title="
        rootFormState === 'add'
          ? '新增医院配置'
          : rootFormState === 'edit'
          ? '编辑医院配置'
          : '查看医院配置'
      "
      width="800px"
      :before-close="handleRootClose"
      :close-on-click-modal="false"
      top="20vh"
    >
      <el-row>
        <el-col :span="24">
          <el-col :span="6">医院名称：</el-col>
          <el-col :span="18">{{ editData.orgName }}</el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="margin-top: 10px;">
          <el-col :span="6">随访系统消息模板：</el-col>
          <el-col :span="18"><el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editData.sysMesFollowTemplate" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">调研系统消息模板：</el-col>
          <el-col :span="18"><el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editData.sysMesResearchTemplate" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">评估系统消息模板：</el-col>
          <el-col :span="18"><el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editData.sysMesEvaluationTemplate" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">短信验证码发送开关：</el-col>
          <el-col :span="18">
            <el-switch v-model="editData.smsSendCodeFlg" :active-value="0" :inactive-value="1" active-text="开" inactive-text="关" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">短信发送开关：</el-col>
          <el-col :span="18"><el-switch v-model="editData.smsSendMesFlg" :active-value="0" :inactive-value="1" active-text="开" inactive-text="关" active-color="#13ce66" inactive-color="#ff4949"></el-switch></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">每日每个手机号发送验证码最大数量：</el-col>
          <el-col :span="18"><el-input v-model="editData.smsSendMaxNum" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">移动端是否为测试模式：</el-col>
          <el-col :span="18"><el-switch v-model="editData.testFlg" :active-value="0" :inactive-value="1" active-text="是" inactive-text="否" active-color="#13ce66" inactive-color="#ff4949"></el-switch></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">短信验证码模板ID：</el-col>
          <el-col :span="18"><el-input v-model="editData.verificationCodeTemplateId" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">短信验证码模板：</el-col>
          <el-col :span="18"><el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editData.verificationCodeTemplate" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">短信评估模板ID：</el-col>
          <el-col :span="18"><el-input v-model="editData.smsEvaluationTemplateId" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">短信评估模板：</el-col>
          <el-col :span="18"><el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editData.smsEvaluationTemplate" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">短信随访模板ID：</el-col>
          <el-col :span="18"><el-input v-model="editData.smsFollowTemplateId" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">短信随访模板：</el-col>
          <el-col :span="18"><el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editData.smsFollowTemplate" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">短信调研模板ID：</el-col>
          <el-col :span="18"><el-input v-model="editData.smsResearchTemplateId" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">短信调研模板：</el-col>
          <el-col :span="18"><el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editData.smsResearchTemplate" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">活动注册短信模板ID：</el-col>
          <el-col :span="18"><el-input v-model="editData.smsActivityRegTemplateId" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">活动注册短信模板：</el-col>
          <el-col :span="18"><el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editData.smsActivityRegTemplate" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">EXCEL导入模板类型：</el-col>
          <el-col :span="18">
            <el-radio-group v-model="editData.excelTemplateType">
              <el-radio label="A">齐齐哈尔模板</el-radio>
              <el-radio label="B">环湖模板</el-radio>
            </el-radio-group>
          </el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">EXCEL模板下载地址：</el-col>
          <el-col :span="18"><el-input v-model="editData.excelTemplateDownloadUrl" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">转诊申请规定时间未审核提示(秒)：</el-col>
          <el-col :span="18"><el-input v-model="editData.referralUncheckExpire" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">转诊申请规定时间未接诊提示(秒)：</el-col>
          <el-col :span="18"><el-input v-model="editData.referralUnreceiveExpire" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">移动端地址：</el-col>
          <el-col :span="18"><el-input v-model="editData.mobileUrl" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">公众号appid：</el-col>
          <el-col :span="18"><el-input v-model="editData.gzhAppid" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">公众号凭证密钥secret：</el-col>
          <el-col :span="18"><el-input v-model="editData.gzhSecret" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">中国移动，云MAS平台，Webservice服务地址：</el-col>
          <el-col :span="18"><el-input v-model="editData.chinaMobileSmsUrl" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">中国移动，云MAS平台，集团客户名称：</el-col>
          <el-col :span="18"><el-input v-model="editData.chinaMobileSmsEcName" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">中国移动，云MAS平台，用户名：</el-col>
          <el-col :span="18"><el-input v-model="editData.chinaMobileSmsUserAccount" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">中国移动，云MAS平台，密码：</el-col>
          <el-col :span="18"><el-input v-model="editData.chinaMobileSmsPassword" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">中国移动，云MAS平台，网关签名编码：</el-col>
          <el-col :span="18"><el-input v-model="editData.chinaMobileSmsSign" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">文件服务器文件浏览地址(外网)：</el-col>
          <el-col :span="18"><el-input v-model="editData.fileBrowseUrl" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">文件服务器文件浏览地址(内网)：</el-col>
          <el-col :span="18"><el-input v-model="editData.fileUrlIntranet" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">静态服务器内网地址：</el-col>
          <el-col :span="18"><el-input v-model="editData.staticServerUrl" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">静态服务器外网地址：</el-col>
          <el-col :span="18"><el-input v-model="editData.staticServerUrlIntranet" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">一信通短信服务配置-SpCode：</el-col>
          <el-col :span="18"><el-input v-model="editData.umsSpCode" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">一信通短信服务配置-AppKey：</el-col>
          <el-col :span="18"><el-input v-model="editData.umsAppKey" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">一信通短信服务配置-AppSecret：</el-col>
          <el-col :span="18"><el-input v-model="editData.umsAppSecret" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">一信通短信服务配置-URL：</el-col>
          <el-col :span="18"><el-input v-model="editData.umsSmsUrl" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">腾讯云短信-SDK AppId：</el-col>
          <el-col :span="18"><el-input v-model="editData.tencentSdkAppId" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">腾讯云短信-App Key：</el-col>
          <el-col :span="18"><el-input v-model="editData.tencentAppKey" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">腾讯云短信-地域域名：</el-col>
          <el-col :span="18"><el-input v-model="editData.tencentEndpoint" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">腾讯云短信-地域：</el-col>
          <el-col :span="18"><el-input v-model="editData.tencentRegion" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">腾讯云短信-短信签名内容：</el-col>
          <el-col :span="18"><el-input v-model="editData.tencentSignName" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">腾讯云短信-密钥id：</el-col>
          <el-col :span="18"><el-input v-model="editData.tencentSecretId" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">腾讯云短信-密钥key：</el-col>
          <el-col :span="18"><el-input v-model="editData.tencentSecretKey" placeholder="请输入内容" style="width: 100%;"></el-input></el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="24">
          <el-col :span="6">慢病首页是否为演示模式：</el-col>
          <el-col :span="18"><el-switch v-model="editData.mbPageHomeDemoFlg" :active-value="0" :inactive-value="1" active-text="开" inactive-text="关" active-color="#13ce66" inactive-color="#ff4949"></el-switch></el-col>
        </el-col>
      </el-row>
      <template #footer>
        <el-button @click="handleRootClose">取 消</el-button>
        <el-button type="primary" @click="submitForm()"> 保 存 </el-button>
      </template>
    </ProDialog>
  </div>
</template>

<script>
import { ProList, ProLayout, ProDialog } from 'anx-vue'
import {
  onQueryOrgConfigs,
  onSaveOrgConfig
} from '@/api/modules/orgConfig'
export default {
  components: {
    ProDialog,
    ProList,
    ProLayout,
  },
  data() {
    return {
      rootFormState: 'add',
      rootFormFlag: false,
      loading: false,
      tableDataList: [],
      queryParams: {},
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      rowData: {},
      editData: {}
    }
  },
  created() {
    this.onInquire()
  },
  methods: {
    async submitForm() {
      try {
        this.loading = true
        const res = await onSaveOrgConfig({
          ...this.editData
        })
        this.$message.success('保存成功')
        this.loading = false
        this.rootFormFlag = false
        this.onInquire()
      } catch (error) {
        this.loading = false
        console.log('error', error)
      }
    },
    async onInquire() {
      try {
        this.loading = true
        const res = await onQueryOrgConfigs({
          ...this.queryParams,
          ...this.pageParams
        })

        const { total, records } = res.result
        console.log(res.result)
        this.total = total
        this.tableDataList = records
        this.loading = false
      } catch (error) {
        this.loading = false
        console.log('error', error)
      }
    },
    // 编辑返显
    // async
    onEdit(row) {
      console.log(`onEdit`, JSON.parse(JSON.stringify(row)))
      this.rootFormState = 'edit'
      this.editData = JSON.parse(JSON.stringify(row))
      this.rootFormFlag = true
    },
    handleRootClose() {
      this.rootFormFlag = false
    }
  },
}
</script>

<style lang="scss" scoped>
.RoleAdmin {
  .link {
    color: #446abd;
    text-decoration: underline;
    text-decoration-color: #446abd;
    cursor: pointer;
  }
  ::v-deep .pro-table .query-conditions .actions {
    display: flex;
    margin-top: 10px !important;
  }

  ::v-deep.el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    padding: 15px !important;
  }

  ::v-deep.ProDialog .title:before {
    content: '';
    position: absolute;
    left: -15px;
    width: 4px;
    border-radius: 0 1px 1px 0;
    height: 20px;
    background-color: #134796;
  }

  .ProList {
    border-radius: 2px;
    // margin-top: 10px !important;
    padding: 10px;
    background-color: #fff;
  }

  .alert {
    display: flex;
    align-items: center;
    border: 1px solid #446abd;
    background-color: #ebf1fd;
    flex: 1;
    margin-left: 10px;
  }
}
</style>
