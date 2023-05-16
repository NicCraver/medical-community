<!--
 * @Author: Nic
 * @Date: 2023-02-01 10:42:01
 * @LastEditTime: 2023-03-01 16:29:21
 * @LastEditors: Nic
 * @Description: 方案配置
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/Plan/SchemeConfiguration.vue
-->
<template>
  <div class="schemeConfiguration">
    <PlanHeader title="方案配置" introduce="根据不同疾病分期和管理目标设计疾病管理子方案。">
      <el-button @click="openSubPlanDialog('addInstallment')">创建子方案</el-button>
    </PlanHeader>

    <main class="main-tab">
      <div class="tab-items">           
        <div
          v-for="(item, index) in schemeStageList"
          :key="index"
          class="tab-item"
          :class="item.seq === tabChangeIndex ? 'tab-item-selected' : ''"
          @click="tabChangeIndex = item.seq"
        >
          <div class="tab_txt">
            <!-- 
            <el-tooltip :class="['tab_name', 'item', { errTxtcolot: item.error }]" effect="dark" :content="item.name" placement="top-start" v-if="item.name.length >8">
              <span>{{ item.name }}</span>
            </el-tooltip>
            <div :class="['tab_name', { errTxtcolot: item.error }]" v-else>
              <span>{{ item.name }}</span>
            </div>           
            -->
            <div :class="['tab_name', { errTxtcolot: item.error }]">{{ item.name }}</div>
            <div class="tab_operation">
              <span class="icon_more"><i class="el-icon-more"></i></span>
              <div class="downbox">
                <span @click="openSubPlanDialog('copyInstallment', item)">复制</span>
                <span @click="delChange($event, item)">删除</span>
                <span @click="previewChange($event, item)">预览</span>
              </div>
            </div>
          </div>
        </div>     
      </div>
      <div class="tab-body">   
        <main class="tab-body-main">
          <!-- <el-scrollbar style="height: calc(100vh - 320px)">  </el-scrollbar>-->         
          <div v-for="(item, index) in schemeStageList" :key="index">
            <div class="schemeInformation" v-if="item.seq === tabChangeIndex">
                <div class="headTxt">
                    <div class="title">
                      {{ item.hiddleFlag ? '基本信息' : '子方案_基本信息' }} 
                      <div class="tagList" v-show="!item.hiddleFlag">
                          <span class="relevanceTag" v-for="cont in item.diseasePerId" :key="cont.id">{{cont.name}}</span>
                      </div>
                    </div>            
                    <div class="operate" @click="hiddleChange(item)" v-if="!item.editFlag">{{item.hiddleFlag ? '收起' : '展开'}} <i :class="item.hiddleFlag ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
                    <div class="saveBasic" v-if="item.editFlag">             
                      <el-button type="primary" @click="saveChange(item)">保存</el-button>
                      <el-button @click="resetChange(item)">取消</el-button>
                    </div> 
                  </div> 
                <div class="detailContent" v-show="item.hiddleFlag">
                    <span class="editBasic" @click="editChange(item)" v-if="!item.editFlag"><i class="el-icon-edit"></i></span>
                    <div class="basicItem basicItemFlex">
                      <div class="inputTxt">
                          <span class="label">子方案名称: </span>   
                          <div class="wrapInput">                                  
                            <el-input
                            placeholder="请输入"
                            v-model="item.name"
                            clearable
                            v-if="item.editFlag">
                            </el-input>
                            <p class="cont" v-else>{{item.name}}</p>
                          </div>  
                      </div>
                      <div class="inputTxt">
                          <span class="label">关联疾病分期: </span>
                          <div class="wrapInput tagList">
                              <span class="relevanceTag" v-for="cont in item.diseasePerId" :key="cont.id">{{cont.name}}</span>
                              <span class="addTag" @click="openSubPlanDialog('relevanceInstallment', item)" v-if="item.editFlag"><i class="el-icon-plus"></i></span>
                          </div>
                      </div>
                    </div>
                    <div class="basicItem basicItemWidth">
                      <div class="inputTxt">
                          <span class="label">子方案简诉: </span>     
                          <div class="wrapInput inputwidth">           
                            <el-input
                            placeholder="请输入"
                            v-model="item.subDescribe"
                            clearable
                            v-if="item.editFlag">
                            </el-input>
                            <p class="cont" v-else>{{item.subDescribe}}</p>
                          </div>   
                      </div>
                    </div>
                </div>
            </div> 
            <!-- @delConditionChange="delConditionChange" -->
            <!-- contentConfigOptions -->
            <SchemeConditions 
              ref="schemeConditionsRef"
              :hiddleFlag="hiddleFlagHeight"  
              :sendConditionList="item.sOptionDtoList"  
              :schemeConfigList="contentConfigOptions"                      
              @openSubPlanDialog="openSubPlanDialog" 
              @current-layer="handleChangeLayer"                 
              v-if="item.seq === tabChangeIndex"
            />    
          </div>      
        </main>

        <!--
        <footer class="tab-body-footer">
          底部--------------------------------
        </footer> 
        -->
      </div>
    </main>

    <!-- 弹窗 -->
    <!-- 
      :operatorOptions="operatorOptions"    
     -->
    <SubPlanDialog
      ref="SubPlanDialogFormRef"
      v-if="subPlanDialogVisible"
      v-model="subPlanDialogVisible"
      :title="subPlanDialogTitle"
      :state="subPlanDialogState" 
      :planData="planData" 
      :schemeOptionsList="diseaseInstallmentOptions"   
      :schemeConfigList="contentConfigOptions" 
      :checkedCitiesSave="checkedCitiesSave"    
      @getSubPlanDialogData="getSubPlanDialogData"
    />
    
  </div>
</template>

<script>
import eventBus from '@/utils/eventbus.js'
import SubPlanDialog from '../components/SubPlanDialog.vue'
import PlanHeader from '../components/PlanHeader.vue'
import SchemeConditions from '../components/SchemeConditions.vue'
import { getOperators, deleteScheme,
  saveSubScheme, getDiseasePerByPlanId, getSubSchemeByPlanId, getConfigInfo, subSchemeNameNotRepeat } from '@/api/modules/SolutionCenter/index.js'

// import Swiper from 'swiper/bundle'
// import 'swiper/swiper-bundle.css'
export default {
  // provide() {
  //   return {     
  //     queryData: this.planData
  //   }
  // },
  props: {  
    planData: {
      type: Object
    }
  },
  watch:{
   
  },
  components: {
    PlanHeader,
    SchemeConditions,
    SubPlanDialog,
  },
  data() {
    return {
      cycleNum:null,
      //方案id
      planId:'', 
      diseaseInstallmentOptions:[],
      contentConfigOptions:[],  
      // schemeOptionsList:[],
      // schemeConfigList:[],
      subPlanDialogTitle: '创建子方案',
      subPlanDialogState: 'addInstallment', 
      // 分期弹窗
      subPlanDialogVisible: false,   
      // 运算符
      operatorOptions: {},    
      tabChangeIndex: 0, 
      //基本信息
      hiddleFlagHeight:false,
      addTabindex:0, 
      //子方案列表    
      schemeStageList:[ 
        {
          //tab_name + 基本信息对象
          name:'高血压初诊管理方案',
          planId:'',
          seq:0,
          subDescribe:'子方案简诉', //简诉
          diseasePerId:[], //关联的疾病分期

          //指标检测 生活方式干预等..
          sOptionDtoList:[
            {
              name:'指标监测',
              seq:0,
              itemId:'', //指标监测itemId
              isDisplay:'0', 
              // 家庭血压 血糖 动态血压等
              soConditionDtoList:[ 
                {
                  //taskDtoType:区分不同疾病任务配置项 
                  //1.家庭血压 血糖
                  //2.诊室血压血糖
                  taskDtoType:'1', 
                  name:'家庭血压',
                  itemId:'', //家庭血压itemId
                  seq:0,
                  type:'', //患者自管 来源院内
                  //任务配置 + 达标评估
                  conditionTaskDtoList:{
                    //任务频率
                    pushType:'', //1服务 2纳入
                    pushDay:null,
                    pushCycle:'', //天 周 月cron表达式    
                    indexRange:[],  //指标范围              
                    taskItemRemindDtoList:[ //预警设置 收缩 舒张压liest
                      {
                        itemId:'', //血压 血糖name itemId
                        name:'',
                        unitId:'',
                        operatorId:'',
                        value1:'',
                        value2:'',  
                        type:'1', //1.任务 2.评估或预警                   
                      }
                    ],
                    remindFlag:'0', //达标 预警设置 0:关闭 1：开启
                    //评估频率
                    assessType:'',
                    assessDay:null,
                    assessCycle:'', //天 周 月cron表达式
                    assessSet:'', //计算设置
                    dynamicPush:'', //1开启动态推送，2：不开启动态推送
                    dynamicPushType:'', //1：满足达标值后即触发，2：满足达标值并询问患者，经过同意后触发

                    satisfyFlag:[ //1：满足达标值设置2：不满足达标值设置
                      {
                        value:'1', 
                        carbleFlag:false,
                        setTimecron:''
                      },
                      {
                        value:'2', 
                        carbleFlag:false,
                        setTimecron:'',
                      }
                    ],                                                        
                    triggerTime:'', //触发时机，1：评估后自动出发，2：经询问后触发

                  }
                },
                {
                  taskDtoType:'2', 
                  name:'诊室血压',
                  itemId:'', //家庭血压itemId
                  seq:1,
                  type:'', //患者自管 来源院内
                  //任务配置 + 达标评估
                  conditionTaskDtoList:{
                    //任务频率
                    pushType:'', //1服务 2纳入
                    pushDay:null,
                    pushCycle:'', //天 周 月cron表达式    
                    reminderObj:'', //提醒对象，1：患者，2：医生
                    reminderSch:'', //提醒时间，1：计划当天，2：计划前，3：超期
                    reminderMet:'', //提醒方式，1:系统消息，2：短信消息
                    remark:'', //复诊目的备注
                    remindFlag:'0', //达标 预警设置 0:关闭 1：开启
                    followupLabelDtoList:[ //复诊目的标签集合
                      {
                        itemId:'',
                        name:'常规复查',
                      }
                    ],
                    indexRange:[],
                    taskItemRemindDtoList:[ //预警设置 收缩 舒张压liest
                      {
                        itemId:'', //血压 血糖name itemId
                        name:'',
                        unitId:'',
                        operatorId:'',
                        value1:'',
                        value2:'',  
                        type:'2', //1.任务 2.评估或预警                   
                      }
                    ]
                  }
                }              
              ]
            }
          ]
        }
      ], 
      oldEditparam:{},     
      oneMinutes: 0,
      clock:null,
      commonId:{
        id:'',
        orgId:''
      },
      checkedCitiesSave:[],
      copyParamsData:[],
      // 每周列表
      weekList: [
        {
          label: '周一',
          value: 1       
        },
        {
          label: '周二',
          value: 2       
        },
        {
          label: '周三',
          value: 3         
        },
        {
          label: '周四',
          value: 4      
        },
        {
          label: '周五',
          value: 5     
        },
        {
          label: '周六',
          value: 6      
        },
        {
          label: '周日',
          value: 7     
        },
      ], 
      // 每月列表
      monthsList: [ 
        {
          label: '1',
          value: 1      
        },
        // 生成 1-31
        ...Array.from({ length: 30 }, (item, index) => {
          return {
            label: `${index + 2}`,
            value: index + 2        
          }
        }),
        {
          label: '最后一天',
          value: 32,        
        }
      ]
    }
  },
  created() { 
    const { planId } = this.$route.query;   
    this.planId = planId; 
    console.log(this.$route.query) 
    // 获取运算符
    this.getOperators()
    //获取关联疾病分期
    this.getDiseasePerByPlanId() 
    //查询子方案信息tab列表
    this.getSubSchemeByPlanId()
    //获取内容配置项
    this.getConfigInfo()  
  },
  mounted() {
    // new Swiper('.swiper', {
    //   loop: false,  // 是否循环轮播
    //   autoplay: false,  // 是否可以自动轮播
    //   slidesPerView: 10,  // 可是区域内可展示多少个块
    //   spaceBetween: 10,  // 块之间间隔距离
    //   initialSlide:0,  // 默认初始显示块
    //   freeMode: false,
    //   // 显示分页
    //   pagination: false,
    //   // 设置点击箭头
    //   navigation: false
    // })  
    eventBus.$off('watchChange')
    eventBus.$on("watchChange", (data) => {  
      this.cycleNum = data;  
      window.localStorage.setItem('cycleNum', this.cycleNum)                       
    });
  },
  methods: {  
    // 校验是否有数据为空 切换左侧tab时调用
    onValidate(draftFlg, stry, validateFlag) {
      console.log(`onValidate----------`)
      // 校验子方案信息
      //let flag = false;
      let returnData = this.schemeTabValidate()
      let flag = returnData.tagFlag;
      console.log(`flag`, flag)
      // 保存草稿
      if(!validateFlag) this.onSaveDraft(draftFlg, stry) 
      return flag;
    },
    // 保存草稿
    async onSaveDraft(draftFlg, stry) { //type
      //开启加载中状态      
      this.$parent.$parent.loading = true;  
      let diseaseDataForm = {};   
      if (draftFlg) {
        console.log(`存草稿`)
        diseaseDataForm.draftFlag = '1'
      } else {
        console.log(`方案发布`)
        diseaseDataForm.draftFlag = '0' //'2'
      }
      //合并开启预警或评估时数组
      this.schemeStageList.forEach(item => {
        if(item.sOptionDtoList && item.sOptionDtoList){
          item.sOptionDtoList.forEach(cont => {
            if(cont.soConditionDtoList && !cont.soConditionDtoList.length) return;

            if(cont.soConditionDtoList && cont.soConditionDtoList.length){
              cont.soConditionDtoList.forEach(cent => {
                //数据同步
                if(cent.conditionTaskDtoList.pushUnit=='DAY'){
                  cent.conditionTaskDtoList.pushCount = cent.conditionTaskDtoList.pushCycle;
                } 
                if(cent.conditionTaskDtoList.assessUnit=='DAY'){
                  cent.conditionTaskDtoList.assessCount = cent.conditionTaskDtoList.assessCycle;
                }
                if(cent.type == '1'){ //患者自管                
                  let {taskItemRemindDtoList, remindOpenDtoList} = cent.conditionTaskDtoList;
                  let parmAll = remindOpenDtoList ? taskItemRemindDtoList.concat(remindOpenDtoList) : taskItemRemindDtoList;
                  cent.conditionTaskDtoList.taskItemRemindDtoList = parmAll;
                }else{ //来源院内
                  let {taskItemRemindDtoList, contentDataAllList} = cent.conditionTaskDtoList;
                  let parmAll = contentDataAllList ? taskItemRemindDtoList.concat(contentDataAllList) : taskItemRemindDtoList;
                  cent.conditionTaskDtoList.taskItemRemindDtoList = parmAll;
                }  
              })
            }           
          })
        }   
      })   
      diseaseDataForm.planId = this.planId;
      diseaseDataForm.subScheMeDtoList = this.schemeStageList;         
      console.log(`diseaseDataForm`, diseaseDataForm)
      try {
        const res = await saveSubScheme(diseaseDataForm)
        console.log(`res`, res)
        if(res.code==0){
          //console.log(`stry`, stry)
          let timeCut = stry ? 3000 : 500;
          setTimeout(() => {
            this.$parent.$parent.loading = false;   
          }, timeCut);
        } 
        
        //if(type=='copy') return {code:0};

        if(stry){
          this.$message({
            message: '已保存草稿',                
            customClass: "myClass"
          });
          setTimeout(() => {
            this.$router.push({
              name: "DraftColumn"          
            });  
          }, 3000);
        }else{
          if(draftFlg){
            this.$message.success('保存成功!')
            this.getSubSchemeByPlanId()
          } else{
            this.sendCode()         
            const h = this.$createElement;
            this.$msgbox({                
              message: h('div', null, [
                h('p', {class: 'title'}, '发布成功'),
                h('p', {class: 'txt'}, [
                  h('span', null, '以保存在'),
                  h('span', { style: 'color:#446ABD; cursor: pointer;', on:{
                      click:() => {
                        this.goToRenew()
                      }
                  }}, ' 院内模板-开启中 '),
                  h('span', null, '查看'),
                ]),
                h('p', {class: 'txt'}, [
                  h('span', { class: 'timeDesc' }, '3'),
                  h('span', null, ' 秒 后自动跳转 '),
                  h('span', { style: 'color:#446ABD; cursor: pointer;', on:{
                      click:() => {
                        this.cancelChange()                  
                      }
                  }}, '取消'),
                ]),           
              ]),
              dangerouslyUseHTMLString: true,
              type: 'success',
              customClass: 'releaseDefault',
              closeOnClickModal: false        
            })
          }    
        }       
      } catch (error) {    
        console.log(`error`, error)          
      }
    },  
    sendCode() {    
      this.oneMinutes = 3; 
      this.clock = setInterval(() => {     
        this.oneMinutes--;    
        let tex = document.querySelector(".timeDesc")
        tex.innerHTML = this.oneMinutes;
        if (this.oneMinutes === 0) {      
          clearInterval(this.clock);
          tex.innerHTML = 3;
          this.goToRenew() 
        }
      }, 1000)
    },
    cancelChange(){
      clearInterval(this.clock);
      this.$msgbox.close(); 
      this.getSubSchemeByPlanId()
    },
    goToRenew(){
      this.$msgbox.close();      
      this.$router.push({
          name: "InnerTemplate"        
      });  
    },      
    // 在此统一校验方案配置
    schemeTabValidate(){
      let tagFlag = false;  
      let previewData = []; 
      let allErrList = [];               
      if(!this.schemeStageList.length){ 
        tagFlag = false; 
      } 
      if(this.schemeStageList.length){                   
        this.schemeStageList.forEach((item,index) => {
          let dtoValidateList = [];
          item.sOptionDtoList.forEach((cont,cndex) => {         
            if(cont.isDisplay=='0'){
              if(!cont.soConditionDtoList.length){
                  dtoValidateList.push(cndex); 
                  console.log('11')
                  return;
              } 

              cont.soConditionDtoList.forEach((cent,cedex) => {              
                if(!cent.conditionTaskDtoList||cent.conditionTaskDtoList=={}){
                  dtoValidateList.push(cedex) 
                  console.log('22')             
                } 
                //校验频率
                let {pushDay, pushUnit} = cent.conditionTaskDtoList;
                if((pushDay != 0 && !pushDay) || !pushUnit){              
                  dtoValidateList.push(cedex)    
                  console.log('33')                                 
                }                           
                if(cent.type=='1'){ //患者自管               
                  if(cent.conditionTaskDtoList.taskItemRemindDtoList.length){
                    let itemRemindDto = cent.conditionTaskDtoList.taskItemRemindDtoList.filter(val =>val.type=='1')
                    //console.log(itemRemindDto)
                    itemRemindDto.forEach(bton => {                
                      if(!bton.calibrationRange||(bton.calibrationRange=='1'&&(!bton.operatorId||!bton.value1||!bton.value2)||(bton.calibrationRange=='2'&&(!bton.operatorId||!bton.value1)))){
                        dtoValidateList.push(cedex) 
                        console.log('44')                 
                      } 
                    })
                  }
                }  
                if(cent.type=='2'){ //来源院内
                  if(!cent.conditionTaskDtoList.remark){              
                    dtoValidateList.push(cedex)  
                    console.log('55')
                  }         
                }                   
                if(cent.conditionTaskDtoList.remindFlag=='1'){           
                  if(!cent.conditionTaskDtoList.indexRange.length){
                    dtoValidateList.push(cedex)
                    console.log('66')
                  } 

                  if(cent.conditionTaskDtoList.taskItemRemindDtoList.length){
                    let itemRemindDto = cent.conditionTaskDtoList.taskItemRemindDtoList.filter(val =>val.type=='2')
                    itemRemindDto.forEach(bton => {
                      if(!bton.calibrationRange||(bton.calibrationRange=='1'&&(!bton.operatorId||!bton.value1||!bton.value2)||(bton.calibrationRange=='2'&&(!bton.operatorId||!bton.value1)))){
                        dtoValidateList.push(cedex)
                        console.log('77')
                      } 
                    })
                  }
                  if(cent.type=='1'){
                    let {assessDay, assessUnit} = cent.conditionTaskDtoList;
                    if((assessDay != 0 && !assessDay) || !assessUnit){
                      dtoValidateList.push(cedex)
                      console.log('88')
                    }               
                    if(cent.conditionTaskDtoList.dynamicPush=='1'){
                      if(!cent.conditionTaskDtoList.dynamicPushType) dtoValidateList.push(cedex)
                      cent.conditionTaskDtoList.satisfyFlag.forEach((ctone,ctdex) => {
                        //console.log(ctone.text, !ctone.text)
                        if(ctone.carbleFlag && !ctone.pushUnit) dtoValidateList.push(ctdex)
                      })
                    }  
                  }                                            
                }             
              })
            }    
          })        
          if(dtoValidateList.length){
            allErrList = allErrList.concat(dtoValidateList)
            this.setProperty(item, dtoValidateList, index)  
          } else previewData.push(item)                         
        })       
        // console.log(`optionDtoList`, optionDtoList)
        // console.log(`conditionDtoList`, conditionDtoList)

        console.log(`allErrList`, allErrList)       
        if(allErrList.length) tagFlag = false;
        else tagFlag = true;
      }  
      let paramsData = {
        previewData:previewData,
        tagFlag:tagFlag
      }
      return paramsData;
    },
    setProperty(item, list, index){
      //console.log(item, list, index)
      let obj = list.length ? {error: true} : {error: false};
      let art = Object.assign(item, obj) ;
      console.log(art)
      this.$set(this.schemeStageList, index, art);  
      console.log(this.schemeStageList)
    },
    saveChange(item){
      let {name, diseasePerId} = item;
      if(!name) return this.$message.warning('请填写方案名称'); 
      if(diseasePerId && !diseasePerId.length) return this.$message.warning('请选择子方案需要关联的疾病分期'); 
      item.editFlag = false;
    }, 
    editChange(item){   
      item.editFlag = !item.editFlag;
      this.oldEditparam = {
        name:item.name,
        subDescribe:item.subDescribe,
        diseasePerId:item.diseasePerId
      }
      console.log(this.oldEditparam)
    },
    //编辑 保存+取消   
    resetChange(item){
      item.editFlag = false;
      let { name, subDescribe, diseasePerId } = this.oldEditparam; //提取编辑前的值
      item.name = name;
      item.subDescribe = subDescribe;
      item.diseasePerId = diseasePerId;  
    },
    hiddleChange(item){
      item.hiddleFlag = !item.hiddleFlag;
      this.hiddleFlagHeight = item.hiddleFlag;
    },
    //获取关联疾病分期
    async getDiseasePerByPlanId() {
      try {
        const res = await getDiseasePerByPlanId({ planId: this.planId })     
        this.diseaseInstallmentOptions = res.result;  
        console.log(`this.diseaseInstallmentOptions`, this.diseaseInstallmentOptions)           
      } catch (error) {
        console.log(`error`, error)
      }
    },
    // 获取内容配置项
    async getConfigInfo() {
      try {
        const res = await getConfigInfo()      
        this.contentConfigOptions = res.result;
        console.log(`this.contentConfigOptions`, this.contentConfigOptions)             
      } catch (error) {
        console.log(`error`, error)
      }
    },
    // 查询运算符
    async getOperators() {
      try {
        const res = await getOperators()
        console.log(`查询运算符`, JSON.parse(JSON.stringify(res)))
        this.operatorOptions = res.result;
        window.localStorage.setItem('comonList', JSON.stringify(this.operatorOptions))
      } catch (error) {
        console.log(`error`, error)
      }
    },
    // 打开弹窗
    openSubPlanDialog(type, nextData) {
      console.log(type, nextData)
      if(this.schemeStageList.length >=20) return this.$message.error('最多可以创建20个子方案'); 

      const map = {
        addInstallment: () => {
          this.subPlanDialogTitle = '创建子方案'
          this.subPlanDialogState = 'addInstallment'            
        },
        copyInstallment:() => {
          this.subPlanDialogTitle = '复制子方案'
          this.subPlanDialogState = 'copyInstallment'      
          this.copyParamsData = nextData;                
        },
        inspectionCheck:() => {
          this.subPlanDialogTitle = '添加检验检查'
          this.subPlanDialogState = 'inspectionCheck' 
          this.addTabindex = nextData.seq;
        },  
        relevanceInstallment:() => {
          this.subPlanDialogTitle = '关联疾病分期'
          this.subPlanDialogState = 'relevanceInstallment' 
          this.checkedCitiesSave = nextData.diseasePerId;
        }    
      } 
      // if(type=='addInstallment'||type=='copyInstallment'){
      //   this.getDiseasePerByPlanId()
      //   this.getConfigInfo()
      // }   
      // this.schemeOptionsList = this.diseaseInstallmentOptions;
      // this.schemeConfigList = this.contentConfigOptions;
      map[type]()     
      this.subPlanDialogVisible = true; 

      if(type=='copyInstallment'){
        this.$nextTick(() => {         
          let { name, diseasePerId, subDescribe, sOptionDtoList} = this.copyParamsData;     
          let idlist = diseasePerId.map((ob) => { return ob.id })
          //console.log(idlist)

          let dtolist = sOptionDtoList.map((ob) => { return ob.itemId })
          //console.log(dtolist)                
          let planFormData = {
            subPlanName:name,
            diseaseInstallment:this.diseaseInstallmentOptions.filter(item => idlist.includes(item.id)),
            subPlanDesc:subDescribe,
            contentConfig:this.contentConfigOptions.filter(item => dtolist.includes(item.classifyId))
          }      
          //console.log(planFormData)
          this.$refs.SubPlanDialogFormRef.subPlanForm = planFormData;       
        })
      }   
    },
    // 获取创建子方案弹窗数据
    getSubPlanDialogData(row) {
      console.log(`getSubPlanDialogData`, JSON.parse(JSON.stringify(row)))
      // 新建子方案 复制子方案
      if (row.type === 'addInstallment' || row.type === 'copyInstallment') {
        this.addInstallment(row)
      }   
      // 检验检查
      if (row.type === 'inspectionCheck') {
        this.inspectionCheck(row)
      }
      if (row.type === 'relevanceInstallment'){
        this.relevanceInstallment(row)
      }
    },
    //校验方案分期名称是否重复
    subSchemeNameNotMethod(row, callback) {
      let data ={
        name:row.subPlanName,
        planId:this.planId
      }
      subSchemeNameNotRepeat(data).then((res)=>{
        if(res.code == 0) {       
          callback(res.result);
        }
      })
    },
    addInstallmentChange(row){
      let dataParam = row.contentConfig.map(item => ({
          name:item.classifyName,
          itemId:item.classifyId,  
          isDisplay:'0',       
          soConditionDtoList:[]  
      })); 
      let sortDataParam = this.sortChange(dataParam); 
      // console.log(sortDataParam)
      // console.log('--------新增--------')
      let index = !this.schemeStageList.length ? 0 : this.schemeStageList[this.schemeStageList.length-1].seq+1;
      let subTabPageData = {
          name:row.subPlanName,
          planId:this.planId,
          seq: index,
          subDescribe:row.subPlanDesc, //简诉
          diseasePerId:row.diseaseInstallment, //关联的疾病分期
          sOptionDtoList:sortDataParam
      }               
      //创建或复制子方案
      if(row.type === 'addInstallment'){
        this.schemeStageList.push(subTabPageData) 
        this.tabChangeIndex = this.schemeStageList[this.schemeStageList.length-1].seq;
      }else{ 
        let newDataList = [];
        //复制子方案
        let subIdList = subTabPageData.sOptionDtoList.map((item) => {
          return item.itemId;
        })
        let copyIdList = this.copyParamsData.sOptionDtoList.map((item) => {
          return item.itemId;
        })
        // console.log(subIdList)   
        // console.log(copyIdList)

        let cutList = this.copyParamsData.sOptionDtoList.filter(item => subIdList.includes(item.itemId))   
        let sutList = subTabPageData.sOptionDtoList.filter(item => !copyIdList.includes(item.itemId))
        // console.log(cutList) 
        // console.log(sutList) 

        newDataList = cutList.concat(sutList)       
        let sortNewDataList = this.sortChange(newDataList)
        // console.log(sortNewDataList)      
        // console.log('--------复制--------')
        // console.log(newDataList) 
        // 复制分期对象时引用地址值联动的问题 
        let newNewDataList = JSON.parse(JSON.stringify(sortNewDataList));     
        subTabPageData.sOptionDtoList = newNewDataList;
        //console.log(newDataList)
        this.schemeStageList.push(subTabPageData);        
        this.tabChangeIndex = this.schemeStageList[this.schemeStageList.length-1].seq;                       
      }             
      this.subPlanDialogVisible = false;  
      console.log('this.schemeStageList', this.schemeStageList) 
    },
    // 新建子方案
    async addInstallment(row) {
      console.log(`新建、复制子方案`, row) 

      let sameFlag = false;
      this.subSchemeNameNotMethod(row, (result) => {       
        if(result) sameFlag = true; 
        if(sameFlag) return this.$message.error('子方案名称不允许重复')  
        else this.addInstallmentChange(row)      
      });                                 
    },
    //内容配置项排序
    sortChange(dataParam){           
      let sortList = this.contentConfigOptions.map(ob => { return ob.classifyId });
      let stList = [];
      let index = 0;        
      sortList.forEach(value => {
        dataParam.forEach(cont => {        
          if(value == cont.itemId){          
            cont.seq = index++;
            stList.push(cont)
          } 
        })
      })        
      return stList       
    },
    //添加检验检查
    inspectionCheck(row){
      console.log(row)    
      let newmapList = row.useProductList.map(item=>({    
        taskDtoType: item.type=='1'?'1':'2',  //配置项区分
        name: item.itemName,
        itemId: item.itemCode,     
        type: item.type, 
        conditionTaskDtoList: {
          pushType:'1', //1服务 2纳入
          pushDay:0,
          pushUnit:'',
          pushCount:null,
          executeCount:null,
          text:'',
          pushCycle:'',
          //开启评估
          indexRange:[],
          assessType:'1', 
          assessDay:0, 
          assessSet:'1', 
          assessTxt:'',
          dynamicPush:'1', 
          dynamicPushType:'', 
          satisfyFlag: [ 
            { 
              carbleFlag:false, 
              value:1,          
              pushUnit:'',
              pushCount:null,
              executeCount:null,
              pushCycle:'',
              text:''           
            },
            { 
              carbleFlag:false,  
              value:2,          
              pushUnit:'',
              pushCount:null,
              executeCount:null,
              pushCycle:'',
              text:''            
            }
          ],
          assessUnit:'', //评估中的单位:DAY,WEEK,MONTH
          //assessExecuteTimes:null, //评估用户执行次数
          assessExecuteCount:null,
          assessCycle:'',
          assessCount:null,
          taskItemRemindDtoList: item.detailList.length ? item.detailList.map((cont)=>({
            itemId: cont.itemDetailCode, //血压 血糖name itemId
            name: cont.itemDetailName,
            standardRang: cont.standardRang, //JSON.parse(cont.standardRang),
            unitId: cont.unit,
            operatorId:'',
            value1:'',
            value2:'', 
            requisiteFlg:0, //0:和  1:或
            type:'1' //1.任务 2.评估或预警  
          })) : []
        }      
      }))  
      console.log(this.tabChangeIndex, this.addTabindex)
      // console.log(newmapList)  
      // console.log(this.schemeStageList)      
      newmapList.forEach(item => {
        this.schemeStageList[this.tabChangeIndex].sOptionDtoList[this.addTabindex].soConditionDtoList.push(item)
      })      
      this.schemeStageList[this.tabChangeIndex].sOptionDtoList[this.addTabindex].soConditionDtoList.forEach((item,index) => {
         item.seq = index; 
      })
      this.subPlanDialogVisible = false;      
      console.log(this.schemeStageList)
     
      // console.log(this.tabChangeIndex, this.addTabindex)
      // console.log(newmapList)  
      // console.log(this.schemeStageList)  
      // let newConditionsList = JSON.parse(JSON.stringify(this.schemeStageList[this.tabChangeIndex].sOptionDtoList));        
      // newmapList.forEach((item) => {        
      //   let newTaskParam = JSON.parse(JSON.stringify(item.conditionTaskDtoList))
      //   item.conditionTaskDtoList = newTaskParam;
      //   let newItem = JSON.parse(JSON.stringify(item))  
      //   newConditionsList[this.addTabindex].soConditionDtoList.push(newItem)      
      // })    
      // newConditionsList[this.tabChangeIndex].sOptionDtoList[this.addTabindex].soConditionDtoList.forEach((item,index) => {
      //    item.seq = index; 
      // })    
      // this.schemeStageList = newConditionsList;  
      // this.subPlanDialogVisible = false;      
      // console.log(this.schemeStageList)
    }, 
    //添加关联分期
    relevanceInstallment(row){
      //console.log(row)
      this.schemeStageList[this.tabChangeIndex].diseasePerId = row.dataList;
      this.subPlanDialogVisible = false;  
    }, 
    //查询子方案tab列表
    async getSubSchemeByPlanId(){ 
      try {
        const res = await getSubSchemeByPlanId({ planId: this.planId }) 
        if(res.code==0){         
          this.schemeStageList = res.result;
          if(this.schemeStageList.length){                     
            let tabchangList = [];
            this.schemeStageList.forEach(item => {          
              this.$set(item, 'hiddleFlag', false);
              this.$set(item, 'editFlag', false);
              //处理回显数据
              item.diseasePerId = JSON.parse(item.diseasePerId);  

              item.sOptionDtoList.forEach(cont => {
                cont.soConditionDtoList.forEach(cent => {
                  //处理回显数据
                  let { satisfyFlag, indexRange, pushUnit, pushCount, executeCount, pushCycle, remindFlag, pushDay, assessDay } = cent.conditionTaskDtoList; 
                  //console.log(satisfyFlag, indexRange)
                  cent.conditionTaskDtoList.satisfyFlag = JSON.parse(satisfyFlag) 
                  cent.conditionTaskDtoList.indexRange = JSON.parse(indexRange) 
                  //处理方案周期大于基本信息周期配置问题
                  if(this.cycleNum){
                    if(+pushDay > this.cycleNum) cent.conditionTaskDtoList.pushDay = this.cycleNum;
                    if(+assessDay > this.cycleNum) cent.conditionTaskDtoList.assessDay = this.cycleNum;
                  }  
                  if(pushUnit){
                    let parentParam = {
                        pushUnit:pushUnit, 
                        pushCount:pushCount, 
                        executeCount:executeCount, 
                        pushCycle:pushCycle
                    } 
                    cent.conditionTaskDtoList.text = this.txtTimeChange(parentParam)
                  } else {
                    cent.conditionTaskDtoList.text = ''
                  }                                
                  if(remindFlag=='1'){
                    let { assessUnit, assessCount, assessExecuteCount, assessCycle } = cent.conditionTaskDtoList;
                    if(assessUnit){                    
                      let param = {
                          pushUnit:assessUnit,
                          pushCount:assessCount,
                          executeCount:assessExecuteCount,
                          pushCycle:assessCycle
                      } 
                      cent.conditionTaskDtoList.assessTxt = this.txtTimeChange(param)  
                    }else{
                      cent.conditionTaskDtoList.assessTxt = '';
                    }                     
                  }
                })
                if(cont.isDisplay=='0' && cont.soConditionDtoList.length == 0) tabchangList.push(item)               
              })
            })
            if(tabchangList.length) this.tabChangeIndex = tabchangList[0].seq;  

            if(this.$parent.$parent.tabPlanActive){
              this.tabChangeIndex = +this.$parent.$parent.tabPlanActive;
              this.$parent.$parent.tabPlanActive = null;
            } 
          }else{
            this.tabChangeIndex = 0; 
          }            
          //校验必填
          if(this.schemeStageList.length) this.schemeTabValidate(2);                
          console.log(`schemeStageList`, this.schemeStageList)    
          
          return this.schemeStageList;
        }               
      } catch (error) {
        console.log(`error`, error)
      }
    },  
    txtTimeChange(data){
        let text = '';
        if (data.pushUnit === 'DAY') {
            text = `每${data.executeCount == '1' ? '' : data.executeCount}天${data.pushCycle}次`   
        }
        if (data.pushUnit === 'WEEK') {         
            let pushCycle = JSON.parse(data.pushCycle);
            let selectedWeekList = this.weekList.filter(item => pushCycle.includes(item.value)).map((cont => { return cont.label }));  
            //console.log(selectedWeekList)               
            text = `每${+data.pushCount - 1 === 0 ? '' : '隔' + (+data.pushCount - 1)}周${selectedWeekList.join(
            '、',
            )}`
        }
        if (data.pushUnit === 'MONTH') {
            let pushCycle = JSON.parse(data.pushCycle);         
            let selectedMonthsList = this.monthsList.filter((item) => pushCycle.includes(item.value)).map((item) => (item.label === '最后一天' ? item.label : item.label + '号'))
            //console.log(selectedMonthsList)                
            text = `每${
                +data.pushCount - 1 === 0 ? '' : '隔' + (+data.pushCount - 1) + '个'
            }月${selectedMonthsList.join('、')}`
        }
        return text;
    },     
    // 删除分期
    delChange(e, cont) {
      if (e && e.stopPropagation) e.stopPropagation()
      else window.event.cancelBubble = true;
      var htmlText =
        '是否确认删除子方案<span style="font-size:14px;font-weight:bold;color:#446ABD">' +
          cont.name +
        '</span>? 删除后不支持恢复。';
      this.$confirm(htmlText, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      })
      .then(() => {      
        console.log(cont)  
        this.schemeStageList = this.schemeStageList.filter(item => item.seq !== cont.seq);
        this.tabChangeIndex = 0;
        this.$message.success('删除成功')         
        if(cont.id){
          let params = {
            planId:this.planId,
            subId:cont.id
          }
          this.deleteScheme(params)
        }                 
      })
      .catch(() => {})      
    },   
    async deleteScheme(params) {    
      try {
        const res = await deleteScheme(params)
        //console.log(res)
      } catch (error) {
        console.log(`error`, error)
      }
    }, 
    handleChangeLayer(data){
      this.$nextTick(() => {
        // console.log(data)
        // console.log(this.tabChangeIndex)
        console.log(this.$refs.schemeConditionsRef)
        let subTypeIndex = this.$refs.schemeConditionsRef[0].subTypeIndex;
        //console.log(subTypeIndex)
        this.schemeStageList[this.tabChangeIndex].sOptionDtoList.forEach(item => {
          if(item.itemId == subTypeIndex) item.soConditionDtoList = data
        })       
        //console.log(this.schemeStageList)
      })        
    },   
    //预览功能  
    previewChange(e, cont){
      
    }  
  }
}
</script>

<style lang="scss">
// 发布成功弹窗样式
.releaseDefault{
  text-align: center;
  .el-message-box__status{
    margin-bottom: 20px;
    font-size: 60px!important;
    color:#5BD171 !important;
    position: static;
    transform: translateY(0) !important;
  }
  .el-message-box__message{
    padding:0;
    .title{      
      font-size: 20px;
      color: rgba(16, 16, 16, 1);     
    }
    .txt{
      margin-top: 10px;
      font-size: 14px;
      color: rgba(16, 16, 16, 1);  
      &.txttop{
        margin-top: 20px;
      }              
      .timeDesc{
        color:red;
      }
    }
  }
  .el-message-box__header{ display: none; }
  .el-message-box__btns{ display: none; }
}
</style>
<style lang="scss" scoped>
.schemeConfiguration {
  height: 100%;
  padding-bottom: 10px;
  .main-tab {
    margin-top: 20px;
    height: 100%;
    .tab-items {
      display: flex;
      .tab-item {
        padding: 0 15px 0 20px;
        margin-right: 10px;
        height: 40px;
        line-height: 40px;    
        font-size: 16px;
        color: rgba(100, 100, 100, 1);
        background-color: #fafafa;
        border: 1px solid rgba(211, 220, 236, 1);
        border-radius: 3px 3px 0px 0px;
        z-index: 10;
        cursor: pointer;     
        .tab_txt {
          display: flex;
          justify-content: space-between;
          // .tab_name{
          //   display: block;
          //   width: 128px;
          //   white-space: nowrap;
          //   overflow: hidden;//文本超出隐藏
          //   text-overflow: ellipsis;//文本超出省略号替代
          // }
          .errTxtcolot{
            color:red;
          }
          .tab_operation {
            position: relative;
            .icon_more {
              padding: 0 8px;
              color: #bbbbbb !important;
            }
            .downbox {
              display: none;
              position: absolute;
              right: -15px;
              top: 40px;
              width: 92px;
              height: 96px;
              border-bottom-left-radius: 3px;
              border-bottom-right-radius: 3px;
              background: #fff;
              box-shadow: 2px 2px 12px 4px rgb(210, 210, 210);
              span {
                display: block;
                line-height: 32px;
                font-size: 14px;
                color: #4e5969;
                padding-left: 12px;
                cursor: pointer;
                &:hover {
                  background-color: #fafafa;
                }
              }
            }
          }
          .tab_operation:hover .downbox {
            display: block;
          }
        }
      }
      .tab-item-selected {
        color: rgba(68, 106, 189, 1);
        font-weight: bold;
        border-bottom: none;
        background-color: #fff;
      }
    }    

    .tab-body {
      z-index: 5;
      margin-top: -1px;
      border: 1px solid rgba(211, 220, 236, 1);
      background-color: #fff;
      height: calc(100% - 140px);
      padding: 20px;
      border-radius: 0px 0px 3px 3px;
      position: relative;
      .tab-body-main{      
        .schemeInformation{
            width: 100%;         
            background-color: rgba(247, 247, 247, 1);              
            box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 12);
            .headTxt{
                display: flex;
                justify-content: space-between;
                padding:14px 20px;         
                .title{                                         
                    font-size: 16px;
                    color: rgba(78, 89, 105, 1);
                    font-weight: bold;                         
                    height: 24px;
                    line-height: 24px;
                    display: flex;
                    .tagList{
                        margin: -2px 0 0 12px;                            
                    }             
                }
                .operate{
                    font-size: 14px;
                    color: rgba(94, 133, 219, 1);
                    cursor: pointer;
                    .el-icon-arrow-down{
                        color:#B8B9BC;
                    }
                }
                .saveBasic{
                    .el-button{
                        width: 60px;
                        height: 24px;
                        line-height: 6px;
                        border-radius: 2px;                
                        font-size: 14px;
                        color: rgba(255, 255, 255, 1);                                 
                        box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 12);
                        cursor: pointer;
                    }                         
                }
            }
            .detailContent{   
                padding:0 20px 8px;  
                position: relative;  
                .editBasic{
                    position: absolute;
                    top: 5px;
                    right: 20px;
                    color: #446ABD;
                    cursor: pointer;
                }  
                .basicItemFlex{
                  display: flex;
                }   
                .basicItemWidth{
                  .label{
                    width:5%;
                  }
                  .inputwidth{
                      width: 95%;
                  } 
                }           
                .basicItem{                
                    margin-bottom: 12px;
                    .inputTxt{             
                        display: flex;
                        line-height: 32px;
                        margin-right: 50px;                                                         
                        .label{                        
                            display: inline-block;                                           
                            font-size: 14px;
                            color: rgba(78, 89, 105, 1);
                        }
                        .wrapInput{                        
                          margin-left: 10px;
                          .cont{                       
                              font-size: 14px;
                              color: rgba(48, 49, 51, 1);
                          }                                                
                        }                                                                
                    }
                    .tagList{
                        margin: -2px 10px 0 0; 
                    }
                    
                }
            }
            .relevanceTag,.addTag{ 
                cursor: pointer;
                margin-right: 5px;
                display: inline-block;
                padding: 0 12px;                
                height:24px;  
                line-height: 24px;                                              
                font-size: 12px;
                color: rgba(87, 153, 228, 1);
                border-radius: 4px;
                background-color: rgba(211, 228, 247, 1);                
            }
        }
      }
      .tab-body-header {
        display: flex;
        justify-content: space-between;
        .title {
          color: rgba(78, 89, 105, 1);
          font-size: 18px;
        }
        .introduce {
          padding-left: 4px;
          color: rgba(153, 153, 153, 1);
          font-size: 14px;
        }
        .add_condition {
          width: 150px;
          height: 32px;
          border-radius: 2px;
          background-color: #446abd;
          .el-dropdown {
            width: 100%;
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            color: #ffffff;
            text-align: center;
            .el-dropdown-link {
              display: block;
            }
          }
        }
      }     
      .tab-body-footer {
        position: absolute;
        left: 0px;
        bottom: 0px;
        width: calc(100% - 40px);
        margin: 20px;
        height: 40px;
        border-radius: 4px;
        background-color: rgba(246, 248, 252, 1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      }
    }
  }

  .dialogTitle {
    ::v-deep.ProDialog .title {
      padding-left: 24px !important;
    }
    ::v-deep.ProDialog .title:before {
      left: 10px !important;
    }
    ::v-deep.ProDialog .el-dialog__headerbtn {
      top: 10px !important;
    }  
  }
}
</style>
