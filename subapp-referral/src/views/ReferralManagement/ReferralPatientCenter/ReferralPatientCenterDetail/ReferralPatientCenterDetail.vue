<template>
  <div class="ReferralListDetail">
    <ProLayout model="tab" mainBgColor="#F5F5F5" margin="0" padding="0">
      <template #title>{{ title }}</template>
      <template #tab>
        <el-tabs v-model="activeComponent" :before-leave="handleClick">
          <el-tab-pane v-for="item in tabDatas" :key="item.label" :name="item.component" :label="item.label"></el-tab-pane>
        </el-tabs>
      </template>
      <template #main>
        <keep-alive include="ApplicationForm">
          <!-- 在整个referalForm.vue 中监听整个ruleForm对象存在缓存里面 -->
          <component :is="activeComponent" :referralId="$route.query.referralId" :patId="$route.query.patId" /> 
        </keep-alive>                 
      </template>
    </ProLayout>  
    <div style="display:none">
      <ApplicationForm ref="parentReferralFormRef"></ApplicationForm>
    </div>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import ApplicationForm from '@/components/ApplicationFormComponents/ApplicationForm'
import MedicalRecords from '@/components/ApplicationFormComponents/MedicalRecords'
import ReferralRecords from '@/components/ApplicationFormComponents/ReferralRecords'
export default {
  components: {
    ProLayout,
    ApplicationForm,
    MedicalRecords,
    ReferralRecords,
  },
  data() {
    return {
      status: 'add',
      activeComponent: 'ApplicationForm',
      tabDatas: [  
        {
          label: '转诊申请单',
          component: 'ApplicationForm',
        },
        {
          label: '病情记录',
          component: 'MedicalRecords',
        },
        {
          label: '转诊记录',
          component: 'ReferralRecords',
        },
      ],
    }
  },
  computed: {
    title() {
      let temp = ''
      switch (this.status) {
        case 'add':
          temp = '新增'
          break
        case 'examine':
          temp = '查看'
          break
        case 'temporaryStorage':
          temp = '编辑'
          break
        case 'disabled':
          temp = '查看'
          break
        case 'notDisabled':
          temp = '编辑'
          break

        default:
          break
      }
      return temp
    },
  },
  created() {
    console.log('this.$route.query', this.$route.query)
    const { status, activeComponent = 'ApplicationForm' } = this.$route.query
    console.log('status=================', status)
    this.status = status
    this.activeComponent = activeComponent
  },
  //通过路由规则，离开该组件时被调用
  beforeRouteLeave(to, from, next){
    console.log('beforeRouteLeave',to,from); 
    let flagCut = window.sessionStorage.getItem('saveFlagParamsData') ? true : false;  
    let pathCut = from.query.status=='add' ? true : false;  
    console.log(this.status === 'add' , this.activeComponent == 'ApplicationForm' , !flagCut , pathCut)
    if(this.status === 'add' && this.activeComponent == 'ApplicationForm' && !flagCut && pathCut && !to.params.type){     
      this.$confirm('您有未保存的记录，确认要离开吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
        next(false)  
        //location.reload();        
      });
    }else{
      next()
    }     
  },
  methods: {      
    handleClick(activeName, oldActiveName) {   
      console.log(activeName, oldActiveName) 
      const { status, activeComponent = 'ApplicationForm', referralId } = this.$route.query
      //console.log(this.$route.query) 
      this.status = status;   
      let flagCut = window.sessionStorage.getItem('saveFlagParamsData') ? true : false;               
      if (this.status === 'add' && activeName === 'MedicalRecords') {
        this.$alert('病情记录请在转诊申请单暂存后查看!', '提示', {
          confirmButtonText: '确定',
          callback: (action) => {},
        })
        return false;
      } else if(this.status === 'add' && activeName === 'ReferralRecords' && !flagCut){       
        this.$confirm('是否暂存当前转诊申请单？', '提示', {
          confirmButtonText: '暂存',
          cancelButtonText: '不暂存',
          type: 'warning',
          distinguishCancelAndClose: true   
        }).then(() => {             
          let flag = this.$refs.parentReferralFormRef.onTemporaryStorage('tipsave')
          if(flag){
            this.$message.warning('表单校验未通过，请填写患者信息必填项')
            this.activeComponent = 'ApplicationForm';   
          }              
        }).catch((e) => {       
          //e-> cancel close : 不暂存 关闭         
          if(e == 'close') this.activeComponent = 'ApplicationForm';                     
        });                 
      } else {
        if ((!referralId || referralId === '' || referralId === '/') && activeName === 'MedicalRecords') {
          this.$alert('病情记录请在转诊申请单暂存后查看!', '提示', {
            confirmButtonText: '确定',
            callback: (action) => {},
          })
          return false;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// .ReferralListDetail {
// }
</style>
<style lang="scss">
.ReferralListDetail {
  .el-tabs__header {
    padding: 0;
    position: relative;
    margin: 0 !important;
  }
  .el-tabs__nav,
  .el-tabs__nav-scroll {
    background-color: #fff !important;
  }
  .el-tabs__item.is-top.is-active {
    border-bottom: none !important;
  }
  .el-tabs__item.is-active {
    color: #134796 !important;
  }
  .el-tabs__item {
    font-size: 16px;
    color: #949da3 !important;
  }
  .el-tabs__active-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background-color: #134796 !important;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    list-style: none;
    border-radius: 4px !important;
  }
  .el-tabs__nav-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    background-color: #e4e7ed;
    z-index: 1;
  }
}
</style>
