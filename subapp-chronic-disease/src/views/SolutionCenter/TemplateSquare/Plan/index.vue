<!--
 * @Author: Nic
 * @Date: 2023-01-31 18:01:02
 * @LastEditTime: 2023-03-01 10:12:04
 * @LastEditors: Nic
 * @Description: 方案组件
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/Plan/index.vue
-->
<template>
  <div>
    <PlanLayout>
      <template #leftHeader>
        <IconText
          :componentActive="componentActive"
          componentText="BasicInformation"
          text="基本信息"
          :error="showBasicInformationError"
          @click.native="onToggle('BasicInformation')"
        />
        <IconText
          :componentActive="componentActive"
          componentText="DiseaseStage"
          text="疾病分期"
          :error="showDiseaseStageError"
          @click.native="onToggle('DiseaseStage')"
        />
        <IconText
          :componentActive="componentActive"
          componentText="SchemeConfiguration"
          text="方案配置"
          :error="showSchemeConfigurationError"
          @click.native="onToggle('SchemeConfiguration')"
        />
      </template>
      <template #leftFooter1>
        <div class="ip-left-footer-item1">
          <div class="ip-left-footer-item1-btn" @click="previewChange">
            <i class="el-icon-share"></i>
            方案预览
          </div>
          <div class="line"></div>
          <div class="ip-left-footer-item1-btn">
            <i class="el-icon-share"></i>
            操作记录
          </div>
        </div>
      </template>
      <template #leftFooter2>
        <el-button type="primary" @click="schemeRelease">方案发布</el-button>
        <el-button @click="saveBackChange">保存并返回</el-button>
      </template>

      <template #ipRight>
        <div class="statusLoading" v-loading='loading'>        
          <BasicInformation  ref="BasicInformationRef" v-show="componentActive === 'BasicInformation'" :planData="planData" />
          <DiseaseStage ref="DiseaseStageRef" v-show="componentActive === 'DiseaseStage'" :planData="planData" :widthcutsize="widthcutsize" />
          <SchemeConfiguration ref="SchemeConfigurationRef" v-show="componentActive === 'SchemeConfiguration'" :widthcutsize="widthcutsize" :planData="planData" />
        </div>
        <!-- v-loading='loading' -->
        <!-- <component
          ref="componentActiveRef"
          :is="componentActive"
          :planData="planData"
          @test1="test1"
          @test2="test2"
          @test3="test3"
        /> -->
      </template>
    </PlanLayout>
    
    <!-- 预览提示窗 -->
    <!-- width="350px" -->
    <ProDialog 
      :visible.sync="schemePreviewVisible" 
      :close-on-click-modal="false"
      @close="previewVisibleClose" 
      title="方案预览" 
      width="350px" 
      class="dialogRedultBox">
      <div class="schemePreviewCent">
        <div class="heade_title">
          <div class="close">
            <i class="el-icon-close" @click="schemePreviewVisible = false"></i>
          </div>
          <div class="title">方案预览</div>    
          <div class="tipmsg" v-if="tipFlag">当前子方案待完善无法预览</div>   
        </div>
        <div class="item_content">
          <div class="tip">请确认以下预览信息：</div>
          <div class="item">
            <div class="label">预览子方案为</div>
            <div class="inputbox">
              <el-select v-model="planContId" placeholder="请选择">
                <el-option
                  v-for="item in previewList"
                  :key="item.seq"
                  :label="item.name"
                  :value="item.seq">
                </el-option>
              </el-select>
            </div>       
          </div>
          <div class="item">
            <div class="label">设定“服务开始”日</div>
            <div class="inputbox">
              <el-date-picker
                v-model="serveDate"
                suffix-icon="el-icon-date"
                type="date"
                prefix-icon
                :clearable="false"
                placeholder="选择日期">
              </el-date-picker>
              <i class="icon_date el-icon-date"></i>
            </div>        
          </div>
        </div>      
      </div>
      <template #footer>
        <el-button @click="schemePreviewVisible = false">取 消</el-button>     
        <el-button type="primary" @click="previewPageTo">确定</el-button>
      </template>
    </ProDialog>
  </div>
</template>

<script>
import ProDialog from '@/components/ProDialog/index.vue'
import { onQueryJmPlanById } from '@/api/modules/SolutionCenter'
import IconText from '../components/IconText.vue'
import PlanLayout from '../components/PlanLayout.vue'
import BasicInformation from './BasicInformation.vue' //基本信息
import DiseaseStage from './DiseaseStage.vue' //疾病分期
import SchemeConfiguration from './SchemeConfiguration.vue' //方案配置
import dayjs from 'dayjs'
export default {
  components: {
    ProDialog,
    IconText,
    PlanLayout,
    BasicInformation,
    DiseaseStage,
    SchemeConfiguration
  },
  data() {
    return {
      schemePreviewVisible:false,
      previewList:[],
      planContId:'',
      serveDate:'',   
      loading: false,
      componentActiveOld: '',
      componentActive: 'BasicInformation', 
      planId: '',
      planData: {},
      showBasicInformationError: false,
      showDiseaseStageError: false,
      showSchemeConfigurationError: false,
      nextBasicInforForm:'',
      nextDiseaseStageList:'',
      nextSchemeStageList:'',
      routername:'',
      tipFlag:false,
      tabChangeIndex:null,
      tabPlanActive:null,
      widthcutsize:null
    }
  },
  async created() {
    const { planId, componentActive, tabPlanIndex } = this.$route.query;
    this.planId = planId;

    if(componentActive) this.componentActive = componentActive;

    if((componentActive=='DiseaseStage'||componentActive=='SchemeConfiguration') && tabPlanIndex){
      this.tabPlanActive = tabPlanIndex;
    } 
    console.log(this.tabPlanActive)
    console.log(this.$route.query)  
    await this.onQueryJmPlanById()
    this.changeBreadcrumbData(this.planData.name, false)   
  },
  mounted() {  
    // let elementResizeDetectorMaker = require("element-resize-detector");
    // let erd = elementResizeDetectorMaker();
    // //监听class为staticNextMain的元素 大小变化
    // let self = this;
    // //侦听元素的调整大小事件，并使用元素作为调整大小事件的参数来调用侦听器函数。传递给函数的选项将        
    // //覆盖实例选项
    // if (self.timer !== null) clearTimeout(self.timer)
    // self.timer = setTimeout(() => {
    //   erd.listenTo(document.getElementsByClassName("ip-right"), function(element) {      
    //       let width = element.offsetWidth;                                 
    //       self.widthcutsize = width;
    //   });
    // }, 1000)     
    //统一校验必填项 
    setTimeout(() => {  
      let flag = this.$refs.BasicInformationRef || this.$refs.DiseaseStageRef || this.$refs.SchemeConfigurationRef;
      if(flag){           
        let basicFlag = this.$refs.BasicInformationRef.basicTabValidate()
        let diseaseFlag = this.$refs.DiseaseStageRef.diseaseTabValidate()
        let schemeFlag = this.$refs.SchemeConfigurationRef.schemeTabValidate()
        
        console.log(basicFlag, diseaseFlag, schemeFlag) 

        if(!basicFlag){
          this.showBasicInformationError = true;         
        } 
        if(!diseaseFlag){
          this.showDiseaseStageError = true;      
        }
        if(!schemeFlag.tagFlag){
          this.showSchemeConfigurationError = true;      
        } 
      }
    }, 1000);       
  },
  methods: { 
    previewVisibleClose(){
      this.schemePreviewVisible = false; 
    }, 
    previewPageTo(){
      let dataParam = {
        planId:this.planId, 
        componentActive: this.componentActive,
        planContId: this.planContId,
        tabPlanIndex: this.tabChangeIndex 
      }     
      this.$router.push({
        name: 'SchemePreview',
        query: dataParam
      })
    },  
    //方案预览   
    previewChange(){   
      //4.无可预览子方案
      let dataCut = this.$refs.SchemeConfigurationRef.schemeTabValidate()
      let dataList = dataCut.previewData; 
      if(!dataList.length){          
        return this.$message({
          message: '无可预览子方案',              
          duration:3000,        
          customClass:'emptyBox'
        });
      } else{
        if(this.componentActive=='BasicInformation'){       
          this.commonChange(dataList)
        }else if(this.componentActive=='DiseaseStage'){
          let {tabChangeIndex} = this.$refs.DiseaseStageRef;
          this.tabChangeIndex = tabChangeIndex;
          this.commonChange(dataList)
        }else{
          // console.log(this.nextSchemeStageList)
          // console.log(JSON.stringify(this.$refs.SchemeConfigurationRef.schemeStageList))
          // console.log(this.nextSchemeStageList == JSON.stringify(this.$refs.SchemeConfigurationRef.schemeStageList))
          //先判断是否需要保存
          //校验选中的子方案tab是否填写完整
          let {schemeStageList, tabChangeIndex} = this.$refs.SchemeConfigurationRef;
          this.tabChangeIndex = tabChangeIndex;
          if(this.nextSchemeStageList == JSON.stringify(schemeStageList)){
            let tabIndexList = dataList.filter(item => item.seq == tabChangeIndex);          
            if(!tabIndexList.length){
              this.tipFlag = true;
              this.commonChange(dataList)  
            }else{
              this.tipFlag = false;
              this.commonChange(dataList, this.tabChangeIndex)  
            }                 
          }else{
            this.$refs.SchemeConfigurationRef.onValidate(true, undefined, false);          
            setTimeout(() => {
              let tabIndexList = dataList.filter(item => item.seq == tabChangeIndex);          
              if(!tabIndexList.length){
                this.tipFlag = true;
                this.commonChange(dataList)  
              }else{
                this.tipFlag = false;
                this.commonChange(dataList, this.tabChangeIndex)  
              }            
            }, 1000);        
          }
        }
      }      
    },
    commonChange(dataList, tabIndex){
      this.previewList = dataList.map((item, index) => {
        return {
          name:item.name,
          seq:index,
          id:item.id
        }
      })
      this.planContId = tabIndex ? tabIndex : this.previewList[0].seq;
      let date = new Date()
      this.serveDate = dayjs(date).format('YYYY-MM-DD')       
      this.schemePreviewVisible = true; 
    },
    changeBreadcrumbData(name,type){
      window.microApp.dispatch({
        breadcrumbData: type? name + '集' : [
          {
            meta: { breadcrumb: false, icon: '', lastNode: false, name: 'app-chronicDisease', title: this.$route.query.routeName },
            path: '',
          },
          {
            meta: { breadcrumb: false, icon: '', lastNode: false, name: 'app-chronicDisease', title: name + '集' },
            path: 'title',
          },
        ],
        update: type
      })
    },
    //方案发布
    schemeRelease(){
      let rangeFlag = false;
      //调用统一校验 
      let basicFlag = this.$refs.BasicInformationRef.basicTabValidate()
      let diseaseFlag = this.$refs.DiseaseStageRef.diseaseTabValidate()
      let schemeFlag = this.$refs.SchemeConfigurationRef.schemeTabValidate()
      console.log(basicFlag, diseaseFlag, schemeFlag)

      if(!basicFlag){
        this.showBasicInformationError = true;     
        return this.$message.error('发布失败，基本信息页必填项不能为空')
      } 
      if(!diseaseFlag){
        this.showDiseaseStageError = true;  
        return this.$message.error('发布失败，疾病分期页必填项不能为空')    
      }  
      //填写完毕做统一数值范围校验
      if(diseaseFlag){       
        rangeFlag = this.$refs.DiseaseStageRef.validateRangeFlag()
        console.log(`rangeFlag`, rangeFlag)
        if(!rangeFlag.validateFlag){          
          this.$confirm('发布失败，疾病分期页检验检查项目数值范围填写存在冲突', '提示', { //确认删除
            confirmButtonText: '确认更改',
            cancelButtonText: '返回',       
            type: 'warning'
          })
          .then(() => {   
            this.$refs.DiseaseStageRef.changeBorderRed()                            
          })
          .catch(() => {
            //不做处理...
          }) 
          return;              
        }
      }     
      if(!schemeFlag.tagFlag){
        this.showSchemeConfigurationError = true;  
        return this.$message.error('发布失败，方案配置页必填项不能为空')    
      }  
   
      console.log('=====')

      if(this.componentActive == 'BasicInformation'){ //基本信息  
        this.$refs.BasicInformationRef.onSaveDraft(false)       
      }
      if(this.componentActive == 'DiseaseStage'){ //疾病分期
        this.$refs.DiseaseStageRef.onSaveDraft(false)     
      } 
      if(this.componentActive == 'SchemeConfiguration'){ //方案配置
        this.$refs.SchemeConfigurationRef.onSaveDraft(false)     
      } 
    },
    saveBackChange(){ 
      //tab切换时上一组件表单数据已被保存，只需保存并返回当前组件的表单数据          
      if(this.componentActive == 'BasicInformation'){ //基本信息  
        this.onToggle('BasicInformation', '1')       
      }
      if(this.componentActive == 'DiseaseStage'){ //疾病分期
        this.onToggle('DiseaseStage', '2')       
      }
      if(this.componentActive == 'SchemeConfiguration'){ //方案配置
        this.onToggle('SchemeConfiguration', '3')       
      }                               
    },   
    async onQueryJmPlanById() {
      this.loading = true;
      try {
        const res = await onQueryJmPlanById({
          id: this.planId,
        })
        console.log(`onQueryJmPlanById`, res)
        this.planData = res.result;             
        let cyclesave = (this.planData.cycleUnitId=='582eda772fbc4956ac3d2e12f2271290' && this.planData.cycleNum)?this.planData.cycleNum:null;
        window.localStorage.setItem('cycleNum', cyclesave)
        //首次记录基本信息
        this.nextBasicInforForm = JSON.stringify(this.planData); 
        setTimeout(() => {
          this.loading = false
        }, 100);
      } catch (error) {
        console.error(`error`, error)
        this.loading = false;
      }
    },
    getPaseDataList(){
     
    },
    onToggle(type, stry) {
      // 记录上一个组件
      this.componentActiveOld = this.componentActive;
      this.componentActive = type; 

      //取消tab标签点击自身保存的问题  
      if(this.componentActiveOld == this.componentActive && !stry) return;     

      //判断上一tab页是否存在修改，如果未做改动则不进行保存
      if(this.componentActive=='BasicInformation'){   
        this.nextBasicInforForm = JSON.stringify(this.$refs.BasicInformationRef.basicInforForm);        
      }
      if(this.componentActive=='DiseaseStage'){
        // let dataPromise = this.$refs.DiseaseStageRef.getDiseasePerByPlanId();
        // console.log(dataPromise)
        // dataPromise.then(list => {
        //   console.log(list)
        //   this.nextDiseaseStageList = JSON.stringify(list);  
        // })              
        this.nextDiseaseStageList = JSON.stringify(this.$refs.DiseaseStageRef.diseaseStageList);               
      }
      if(this.componentActive=='SchemeConfiguration'){            
        // let dataPromise = this.$refs.SchemeConfigurationRef.getSubSchemeByPlanId();
        // console.log(dataPromise)
        // dataPromise.then(list => {
        //   console.log(list)
        //   this.nextSchemeStageList = JSON.stringify(list); 
        // })  
        //重新请求关联疾病分期
        this.$refs.SchemeConfigurationRef.getDiseasePerByPlanId();     
        this.nextSchemeStageList = JSON.stringify(this.$refs.SchemeConfigurationRef.schemeStageList);                           
      }
      
      let validateFlag = false; //true 走校验不走保存
      if (this.componentActiveOld === 'BasicInformation') {            
        if(JSON.stringify(this.$refs.BasicInformationRef.basicInforForm) == this.nextBasicInforForm){       
          validateFlag = true;
        }   
        // console.log(JSON.stringify(this.$refs.BasicInformationRef.basicInforForm) === this.nextBasicInforForm)
        // console.log(stry, validateFlag)     
        if(stry) validateFlag = false; 
        const { flag, name } = this.$refs.BasicInformationRef.onValidate(true, stry, validateFlag)
        this.showBasicInformationError = !flag
        this.changeBreadcrumbData(name, true)      
      }
      if (this.componentActiveOld === 'DiseaseStage') {                  
        if(JSON.stringify(this.$refs.DiseaseStageRef.diseaseStageList) == this.nextDiseaseStageList){     
          validateFlag = true;
        }     
        // console.log(JSON.stringify(this.$refs.DiseaseStageRef.diseaseStageList) === this.nextDiseaseStageList)
        // console.log(stry, validateFlag)      
        if(stry) validateFlag = false;
        const flag = this.$refs.DiseaseStageRef.onValidate(true, stry, validateFlag) 
        this.showDiseaseStageError = !flag     
      }
      if (this.componentActiveOld === 'SchemeConfiguration') {            
        if(JSON.stringify(this.$refs.SchemeConfigurationRef.schemeStageList) == this.nextSchemeStageList) {      
          validateFlag = true;
        }
        // console.log(JSON.stringify(this.$refs.SchemeConfigurationRef.schemeStageList) === this.nextSchemeStageList)
        // console.log(stry, validateFlag)       
        if(stry) validateFlag = false;
        const flag = this.$refs.SchemeConfigurationRef.onValidate(true, stry, validateFlag) 
        this.showSchemeConfigurationError = !flag  
      }
      // 解决 tab页保存时id更新问题
      // if(this.componentActive=='DiseaseStage'){
      //   this.$refs.DiseaseStageRef.getDiseasePerByPlanId(); 
      // } 
      // if(this.componentActive=='SchemeConfiguration'){
      //   this.$refs.SchemeConfigurationRef.getSubSchemeByPlanId();
      //   this.$refs.SchemeConfigurationRef.getDiseasePerByPlanId();       
      // }        
    },
    test1(row) {
      console.log(`row1`, row)
    },
    test2(row) {
      console.log(`row2`, row)
    },
    test3(row) {
      console.log(`row3`, row)
    },
  },
}
</script>

<style lang="scss">
.dialogRedultBox{
  .el-dialog__header{
    display: none;
  }
  .el-dialog__body{
    .el-input__inner {
      width:310px;
      border-left: none;
      border-right: none;
      border-top: none;
      border-bottom: 1px solid #D3DCEC;    
      color:#446ABD !important;
    }
    
    .el-input--prefix{
      .el-input__inner{
        padding-left: 15px;
      }
      .el-input__prefix{
        display: none;
      }
    } 
    .el-input__suffix{
      .el-input__icon{
        color:#446ABD !important;
      }    
    }
  } 
  .el-dialog__footer{
    margin-top: 20px;
    padding-bottom: 20px;
    border:none;
    text-align: center;
  } 
}
.emptyBox{
  min-width: 250px !important;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
  background-color: rgba(0, 0, 0, 0.9) !important;
  .el-message__icon{
    display: none;
  }
  .el-message__content{
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
    font-family: Roboto;
  }
}
</style>
<style lang="scss" scoped>
.statusLoading{
  flex: 1;
  height: 100%;
}
.dialogRedultBox{
  .schemePreviewCent{
    padding: 0 10px;
  }
  .heade_title{
    position: relative;
    .title{    
      font-size: 20px;
      color: rgba(78, 89, 105, 1);
      font-family: SourceHanSansSC-regular;
      text-align: center;     
    }
    .close{
      text-align: right;
      font-size: 14px;
      color:#BFBFBF;
      cursor: pointer;
    }
    .tipmsg{
      text-align: center;
      font-size: 14px;
      color:#F56C6C;
    }
  }
  .item_content{
    margin-top:20px;
    .tip{
      font-size: 14px;
      color:#BFBFBF;
    }
    .item{
      margin-top: 10px;
      .label{
        font-size: 14px;
        color:#4E5969;
      }
      .inputbox{
        position: relative;
        margin-top: 5px;
        font-size: 14px;
        color:#446ABD;
        .icon_date{
          position: absolute;
          right: 10px;
          top: 10px;
          color:#BFBFBF;
        }
      }
    }
  }
}
</style>

