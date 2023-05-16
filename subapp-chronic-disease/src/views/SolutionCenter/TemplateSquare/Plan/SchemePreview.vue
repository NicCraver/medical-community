<!--
 * @Author: Zjj
 * @Date: 2023-04-04 18:00:00
 * @LastEditTime: 2023-04-04 18:00:00
 * @LastEditors: Zjj
 * @Description: 方案预览
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/Plan/SchemePreview.vue
-->
<template>
    <div class="schemePreview">     
      <div class="schemeHeader">
        <div class="leftConent">
            <div class="backBtn" @click="backFormChange">退出预览</div>
            <div class="nameDescribe">
                <div class="txt">高血压管理方案集 <span>方案简述</span></div>
            </div>
        </div>
        <div class="rightConent">
            <div class="diseaseBtnAll" @click="openPreviewDialog('1')">
                <IconSvg iconClass="bingan" width="16" style="margin: 0 5px 0 0" /> 
                疾病分期
            </div>
        </div>
      </div>
  
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
              <div class="tab_name">{{ item.name }}</div>
            </div>
          </div>     
        </div>
        <div class="tab-body">   
          <main class="tab-body-main">         
            <div v-for="(item, index) in schemeStageList" :key="index">
              <div class="schemeInformation" v-if="item.seq === tabChangeIndex">
                  <div class="headTxt"> 
                    <div class="headLeft">
                        <div class="label">关联疾病分期：</div> 
                        <div class="tagList">
                            <span class="relevanceTag" v-for="cont in item.diseasePerId" :key="cont.id">{{cont.name}}</span>
                        </div>
                    </div>    
                    <div class="headRight" @click="openPreviewDialog('2', item.diseasePerId)">
                        查看分期
                    </div>                                                                               
                  </div> 
                  <div class="headDescribe">{{item.subDescribe}}</div>                          
              </div>             
              <PreviewConditions 
                ref="previewConditionsRef"    
                :sOptionDtoList = "item.sOptionDtoList"                        
                v-if="item.seq === tabChangeIndex"
              />                
            </div>      
          </main>         
        </div>
      </main>
  
      <!-- 分期预览弹窗 -->    
      <PreviewDialog          
        ref="previewDialogRef"
        v-if="previewDialogVisible"
        v-model="previewDialogVisible"
        :title="previewDialogTitle"        
        :defaultParam="defaultParam"     
        :diseaseInstallmentList="diseaseInstallmentOptions"  
        :operatorOptionsList="operatorOptions"        
      />
      
    </div>
  </template>
  
  <script>
  import PreviewDialog from '../components/PreviewDialog.vue'
  import PlanHeader from '../components/PlanHeader.vue'
  import PreviewConditions from '../components/PreviewConditions.vue'
  import { getDiseasePerByPlanId, getOperators } from '@/api/modules/SolutionCenter/index.js'
  
  export default {  
    props: {  
    
    },
    watch:{
     
    },
    components: {
      PlanHeader,
      PreviewConditions,
      PreviewDialog
    },
    data() {
      return {
        previewDialogVisible:false,
        previewDialogTitle:'疾病分期_诊断标准',
        //方案id
        planId:'', 
        diseaseInstallmentOptions:[],
        // 运算符
        operatorOptions: {},
        defaultParam:{},            
        tabChangeIndex: 0,      
        //子方案列表    
        schemeStageList:[ 
          {       
            name:'高血压管理方案集',
            planId:'',
            seq:0,
            id:'d0e67ed0524f4d7ba5c4f84d31599b20',
            subDescribe:'子方案说明子方案说明子方案说明子方案说明子方案说明子方案说明子方案说明子方案说明子方案说明子方案说明子方案说明',
            diseasePerId:[
                {
                    id: "4454b118f66c40fab354b72b5e6f0c4e",
                    name: "第四个"
                },
                {
                    id: "01e4e56e82b5421e8139562522983ea8",
                    name: "第11个"
                }             
            ], //关联的疾病分期
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
              },
              {
                name:'复诊计划',
                seq:1,
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
          },
          {
            name:'高血压管理方案集11',
            planId:'',
            seq:1,
            id:'c02d2af076d746ee92e2e6e5de9526af',
            subDescribe:'子方案说明子方案说明子方案说明子方案说明子方案说明子方案说明子方案说明子方案说明',
            diseasePerId:[
                {
                    id: "4454b118f66c40fab354b72b5e6f0c4e",
                    name: "第一个"
                },
                {
                    id: "01e4e56e82b5421e8139562522983ea8",
                    name: "第二个"
                }             
            ], //关联的疾病分期
  
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
              },
              {
                name:'复诊计划',
                seq:1,
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
        ]       
      }
    },
    created() {        
      const { planId, componentActive, planContId, tabPlanIndex } = this.$route.query;   
      this.planId = planId; 
      
      this.tabChangeIndex = planContId;
      window.localStorage.setItem('componentActive', componentActive)    
      window.localStorage.setItem('tabPlanIndex', tabPlanIndex)       
      console.log(this.$route.query)   
      //获取疾病分期配置列表
      this.getDiseasePerByPlanId() 
      // 获取运算符
      this.getOperators()   
    },
    mounted() {  
        
    },
    methods: {  
        //退出预览
        backFormChange(){
            let componentActive = window.localStorage.getItem('componentActive');
            let tabPlanIndex = window.localStorage.getItem('tabPlanIndex');
            this.$router.push({
                name: 'EditPlan',
                query: { 
                    planId:this.planId,                
                    componentActive:componentActive,
                    tabPlanIndex:tabPlanIndex
                }
            })
        },         
        openPreviewDialog(type, list){
            this.defaultParam = {
                type: type,
                list: list?list:[]
            }
            this.previewDialogVisible = true;
        },
        // 查询运算符
        async getOperators() {
            try {
                const res = await getOperators()              
                this.operatorOptions = res.result; 
                console.log(`查询运算符`, JSON.parse(JSON.stringify(res)))            
            } catch (error) {
                console.log(`error`, error)
            }
        },
        //获取疾病分期配置列表
        async getDiseasePerByPlanId() {
            try {
                const res = await getDiseasePerByPlanId({ planId: this.planId })     
                this.diseaseInstallmentOptions = res.result;   
                //结束加载状态，初始化预览疾病分期            
                if(this.$refs.previewDialogRef) this.$refs.previewDialogRef.loading = false; 
                console.log(`diseaseInstallmentOptions`, this.diseaseInstallmentOptions)           
            } catch (error) {
                console.log(`error`, error)
            }
        }      
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .schemePreview {
    height: 100%;
    padding: 0 10px 10px;
    background: #F0F0F0;
    border:1px solid red;
    .schemeHeader{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .leftConent{
          .backBtn{         
            width: 78px;
            height: 24px;
            line-height: 24px;           
            border-radius: 2px;                    
            font-size: 14px;
            color: rgba(100, 100, 100, 1);
            text-align: center;
            box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 12);
            // font-family: Roboto;
            border: 1px solid rgba(184, 185, 188, 1);
            background-color: rgba(255, 255, 255, 1);
            cursor: pointer;
          }
          .nameDescribe{
            margin-top:10px;
            .txt{                             
                font-size: 20px;
                color: rgba(78, 89, 105, 1);
                //font-family: SourceHanSansSC-bold;
                font-weight: bold;
                span{                                    
                    font-size: 14px;
                    color: rgba(153, 153, 153, 1);
                    font-weight: normal;
                    //font-family: SourceHanSansSC-regular; 
                }
                font-variant: small-caps; 
                text-transform: capitalize; 

            }
          }  
        }
        .rightConent{
            .diseaseBtnAll{    
                position: relative;
                padding: 0 25px 0 45px;          
                margin-top: 10px;                    
                height: 52px;
                line-height: 52px;
                border-radius: 100px;                              
                font-size: 14px;
                color: rgba(16, 16, 16, 1);
                //font-family: Roboto;
                text-align: center;
                box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 12);               
                background-color: rgba(255, 255, 255, 1);
                cursor: pointer;              
                .svg-icon{
                    position: absolute;
                    top: 15px;
                    left: 20px;                  
                }
            }
        }
    }
    .main-tab {
      margin-top: 20px;
      height: 100%;
      .tab-items {
        display: flex;
        .tab-item {
          padding: 0 20px;
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
        .tab-body-main{      
          .schemeInformation{
              width: 100%;                                   
              .headTxt{ 
                display: flex;
                justify-content: space-between;  
                .headLeft{                              
                    //font-family: SourceHanSansSC-regular;
                    display: flex;
                    .label{
                        width: 98px;
                        height:24px;  
                        line-height: 24px;  
                        font-size: 14px;
                        color: rgba(78, 89, 105, 1);   
                    }
                    .tagList{
                        margin-left: 12px;  
                        .relevanceTag{
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
                .headRight{    
                    height:24px;  
                    line-height: 24px;                                                             
                    font-size: 14px;
                    color: rgba(68, 106, 189, 1);   
                    text-decoration:underline; 
                    cursor: pointer;            
                    //font-family: SourceHanSansSC-regular;
                }                                                           
              }  
              .headDescribe{
                margin-top: 17px;                             
                font-size: 14px;
                color: rgba(153, 153, 153, 1);               
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
  