<!--
 * @Author: zj
 * @Date: 2023-03-01 11:05:51
 * @LastEditTime: 2023-03-15 10:37:55
 * @LastEditors: Nic
 * @Description: 指标检测 血压血糖组件
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/components/CommonTagDiseases.vue
-->
<template>
    <div class="commonTagDiseases">  
        <div class="componentType" v-if="senTaskDtoType == '1'">
            <div class="setItem">
                <div class="label"><span>推送频率</span></div>
                <div class="contset">
                    <div class="leftwrap">
                        <div class="setFrequency padContent">
                            <el-select v-model="sendTagDiseases.pushType" placeholder="请选择" class="rangewidth">
                                <el-option
                                v-for="item in serviceDateList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select> 
                            <div class="inputday">                                           
                                第 <el-input type="number" v-model="sendTagDiseases.pushDay" @input="inputValueChange($event,'1')" class="mo-input--number rangewidth inputwidth"></el-input> 天
                            </div> 
                        </div>                       
                    </div>
                    <div class="rightwrap">
                        <div class="setDateTime padContent">                                                                                
                            <span class="setTimeDate" @click="returnDisplay('pushCycle')" v-show="sendTagDiseases.text">{{sendTagDiseases.text}}</span>
                            <span class="chooseClear" @click="selectClearChange('pushCycle')"> {{ sendTagDiseases.text?'清空':'请选择' }}</span>
                        </div>                       
                    </div>
                </div>
            </div>
            <div class="setItem">
                <div class="label"><span>预警设置</span></div>
                <div class="contset">
                    <ContractBloodPressure 
                    :senJmConDConDtoList="sendTagDiseases.taskItemRemindDtoList.filter(parm => parm.type=='1')" 
                    typeDefault="1"
                    v-if="sendTagDiseases.taskItemRemindDtoList && sendTagDiseases.taskItemRemindDtoList.length"/>                
                </div>
            </div>                     
        </div>        
        <div class="componentCut" v-else>      
            <div class="setItem">
                <div class="label"><span>推送频率</span></div>
                <div class="contset">
                    <div class="leftwrap">
                        <div class="setFrequency padContent">
                            <el-select v-model="sendTagDiseases.pushType" placeholder="请选择" class="rangewidth">
                                <el-option
                                v-for="item in serviceDateList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select> 
                            <div class="inputday">                              
                                第 <el-input type="number" v-model="sendTagDiseases.pushDay" @input="inputValueChange($event,'1')" class="mo-input--number rangewidth inputwidth"></el-input> 天
                            </div>   
                            <div class="setDateTime">                           
                                <span class="setTimeDate" style="cursor:pointer;" @click="returnDisplay('pushCycle')" v-show="sendTagDiseases.text">{{sendTagDiseases.text}}</span>
                                <span class="chooseClear" @click="selectClearChange('pushCycle')">{{ sendTagDiseases.text?'清空':'请选择' }}</span>
                            </div>                       
                        </div> 
                    </div>
                    <div class="rightwrap">
                        <div class="addCondition padContent">
                            <el-button type="primary" icon="el-icon-plus" disabled>添加条件</el-button>
                        </div>  
                    </div>
                </div>
            </div>      
            <!--
            <div class="setItem">
                <div class="label"><span>复诊提醒</span></div>
                <div class="contset">
                    <div class="leftwrap reminderList">
                        <div class="reminderParam padContent">
                            <span>提醒对象</span>
                            <el-checkbox-group v-model="sendTagDiseases.reminderObj">
                                <el-checkbox v-for="v in reminderObject" :key="v.value" :label="v.label" :value="v.value"></el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="reminderType padContent">
                            <span>提醒方式</span>
                            <el-checkbox-group v-model="sendTagDiseases.reminderMet">
                                <el-checkbox v-for="v in reminderMethod" :key="v.value" :label="v.label" :value="v.value"></el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>           
                    <div class="rightwrap">
                        <div class="padContent">
                            <span>提醒时间</span>
                            <el-checkbox-group v-model="sendTagDiseases.reminderSch">
                                <el-checkbox v-for="v in reminderTime" :key="v.value" :label="v.label" :value="v.value"></el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>
            </div> 
            -->
            <div class="setItem">
                <div class="label"><span>患者提醒</span></div>
                <div class="contset">
                    <div class="consultaPurpose padContent">
                        <!--
                        <div class="tagList">
                            <span v-for="(item,index) in sendTagDiseases.followupLabelDtoList" :key="index">{{ item.name }} <i class="el-icon-close"></i></span>
                        </div> 
                        -->
                        <div class="discriction">
                            <span>检测目的：</span>
                            <el-input
                            type="textarea"
                            placeholder=""
                            v-model="sendTagDiseases.remark"
                            maxlength="100"
                            show-word-limit
                            >                         
                            </el-input>
                        </div>
                    </div>
                </div>
            </div>          
        </div>
        <!-- 达标评估 @change="remindFlagChange"-->
        <div class="estimateFlag">
            <el-switch
                v-model="sendTagDiseases.remindFlag"
                active-color="#ADBCF9 "
                inactive-color="#E0E3E5"
                active-value="1"
                inactive-value="0">
            </el-switch>
            <div class="warinTxt">
                {{ senTaskDtoType == '1'?'达标评估':'预警设置'}} 
                <span>{{ senTaskDtoType == '1'?'非必选项。设置达标评估后，患者端将展示达标评估结果，并接受动态推送。':'请设置要预警的指标范围和条件'}}</span>   
            </div>                               
        </div>       
        <!-- 达标评估配置项 -->
        <div class="componentType" v-if="senTaskDtoType == '1' && sendTagDiseases.remindFlag=='1'">                               
                <div class="setItem">
                    <div class="label"><span>指标范围</span></div>
                    <div class="contset">
                        <div class="padContent">                                  
                            <el-checkbox-group v-model="sendTagDiseases.indexRange" @change="getRangeChange($event, '1')">
                                <el-checkbox v-for="v in sendTagDiseases.taskItemRemindDtoList.filter(parm => parm.type=='1').map(item => { return {label:item.name,value:item.itemId,unitId:item.unitId} })" :label="v.value" :key="v.value">{{ v.label }}</el-checkbox>
                            </el-checkbox-group>                                                                                   
                        </div>
                    </div>
                </div>        
                <div class="setItem">
                    <div class="label"><span>达标值设置</span></div>
                    <div class="contset">
                        <ContractBloodPressure 
                        :senJmConDConDtoList="sendTagDiseases.taskItemRemindDtoList.filter(parm => parm.type=='2')" 
                        typeDefault="1"
                        v-if="sendTagDiseases.taskItemRemindDtoList && sendTagDiseases.taskItemRemindDtoList.length"
                        />                      
                    </div>
                </div>
                <div class="setItem">
                    <div class="label"><span>评估频率设置</span></div>
                    <div class="contset">                      
                        <div class="leftwrap">
                            <div class="setFrequency padContent">
                                <el-select v-model="sendTagDiseases.assessType" placeholder="请选择" class="rangewidth">
                                    <el-option
                                    v-for="item in serviceDateList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select> 
                                <div class="inputday">
                                    第 <el-input type="number" v-model="sendTagDiseases.assessDay" @input="inputValueChange($event,'2')" class="mo-input--number rangewidth inputwidth"></el-input> 天
                                </div> 
                            </div>                       
                        </div>
                        <div class="rightwrap">
                            <div class="setDateTime padContent">             
                                <span class="setTimeDate" v-show="sendTagDiseases.assessTxt" @click="returnDisplay('assessCycle')">{{ sendTagDiseases.assessTxt }}</span> 
                                <span class="chooseClear" @click="selectClearChange('assessCycle')">{{ sendTagDiseases.assessTxt?'清空':'请选择' }}</span>
                            </div>                       
                        </div>                    
                    </div>
                </div>
                <div class="setItem">
                    <div class="label"><span>评估计算设置</span></div>
                    <div class="contset">
                        <div class="padContent">                              
                            <el-radio-group v-model="sendTagDiseases.assessSet">
                                <el-radio
                                v-for="item in setcountList"
                                :key="item.value"
                                :value="item.value"
                                :label="item.value"
                                >{{item.label}}</el-radio>
                            </el-radio-group>                                               
                        </div>
                    </div>
                </div>
                <div class="setItem">
                    <div class="label"><span>动态推送设置</span></div>
                    <div class="contset">
                        <div class="padContent">                     
                            <div class="setTrendsTop">
                                <!--
                                <el-radio-group v-model="sendTagDiseases.dynamicPush" @change="handleChange">        
                                    <el-radio
                                    v-for="item in trendsPashList"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.value"
                                    >{{item.label}}</el-radio>
                                </el-radio-group>   
                                -->
                                <el-radio v-model="sendTagDiseases.dynamicPush" label="1">开启后动态推送</el-radio>                              
                                <el-select v-model="sendTagDiseases.dynamicPushType" class="autoWidth-select" popperClass="area-choose" placeholder="请选择" v-show="sendTagDiseases.dynamicPush == '1'">
                                    <template slot="prefix" >
                                        <span style="text-decoration: underline solid #4468BD">{{ (trendsValueList.find(item => item.value === sendTagDiseases.dynamicPushType)||{}).label }}</span>
                                    </template>
                                    <el-option
                                    v-for="item in trendsValueList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>  
                                <el-radio v-model="sendTagDiseases.dynamicPush" label="2">不开启动态推送</el-radio>                                   
                            </div> 
                            <div class="setTrendsBottom" v-show="sendTagDiseases.dynamicPush == '1'"> 
                                <div class="trendItem" v-for="(item,index) in sendTagDiseases.satisfyFlag" :key="index">                                 
                                    <el-checkbox v-model="item.carbleFlag">{{item.value==1?'满足达标设置':'不满足达标设置'}}</el-checkbox>  
                                    <div class="trendTip" v-show="item.carbleFlag">
                                        <span class="setTimeDate" v-show="item.text" @click="returnDisplay('satisfyFlag', item)">{{item.text}}</span>
                                        <span class="chooseClear" @click="selectClearChange('satisfyFlag', item)">{{ item.text?'清空':'请选择' }}</span>
                                    </div>                             
                                </div>                              
                            </div>                          
                        </div>
                    </div>
                </div>
                <!--
                <div class="setItem">
                    <div class="label"><span>触发时机</span></div>
                    <div class="contset">
                        <div class="padContent">
                            <el-radio-group v-model="sendTagDiseases.triggerTime">
                                <el-radio
                                v-for="item in contactList"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label"
                                >{{item.label}}</el-radio>
                            </el-radio-group>                            
                        </div>
                    </div>
                </div> 
                -->
        </div>     
        <div class="componentCut" v-if="senTaskDtoType == '2' && sendTagDiseases.remindFlag=='1'">                         
            <div class="openEstimate">                 
                <div class="checkHeader">
                    <el-checkbox-group v-model="sendTagDiseases.indexRange" @change="getRangeChange($event, '2')">
                        <el-checkbox v-for="v in sendTagDiseases.taskItemRemindDtoList.filter(parm => parm.type=='1').map(item => { return {label:item.name,value:item.itemId,unitId:item.unitId} })" :label="v.value" :key="v.value">{{ v.label }}</el-checkbox>
                    </el-checkbox-group>  
                </div>              
                <div class="checkContList">
                    <div class="msgTxt">满足以下</div>
                    <ContractBloodPressure 
                    :senJmConDConDtoList="sendTagDiseases.taskItemRemindDtoList.filter(parm => parm.type=='2')" 
                    typeDefault="2"
                    v-if="sendTagDiseases.taskItemRemindDtoList && sendTagDiseases.taskItemRemindDtoList.length"
                    /> 
                </div>             
            </div>
        </div>

        <FrequencySettingDialog
        v-if="frequencySettingDialogVisible"
        v-model="frequencySettingDialogVisible"
        :cycle="cycleNum"
        :editData="frequencySettingData"
        @frequencySettingOnSubmit="frequencySettingOnSubmit"
        @close="onClose"
        />
    </div>   
</template>

<script>
import ContractBloodPressure from './ContractBloodPressure.vue'
import FrequencySettingDialog from '@/components/FrequencySettingDialog/index.vue'
import { filter } from 'lodash';
export default {
  //inject: ['queryData'],
  props: {   
    sendTagDiseases: {
      type: Object,
      required: true
    },
    senTaskDtoType:{
      type: String,
      required: true 
    } 
  },
  components: {
    ContractBloodPressure,
    FrequencySettingDialog
  },
  created(){
    console.log(`指标监测-血压血糖 组件`, this.sendTagDiseases)  
  },
  mounted() {
    
  },
  watch:{   
    // sendTagDiseases:{ 
    //     deep:true, 
    //     handler:function(data){  
    //         // console.log(data)     
    //         // console.log(this.senTaskDtoType)          
    //         // console.log('--------------')  
    //         let { remindFlag } = data;         
    //         this.remindFlagChange(remindFlag)                            
    //     }
    // },
    // 'sendTagDiseases.remindFlag':{
    //     deep:true, 
    //     handler:function(data){  
    //         // console.log(data)     
    //         // console.log(this.senTaskDtoType)          
    //         // console.log('--------------')  
    //         let { remindFlag } = data;         
    //         this.remindFlagChange(remindFlag)                            
    //     }
    // }
  },
  data() {
    return { 
        frequencySettingData:{},
        cycleNum:null,
        distinguish:'', //标识任务 评估预警 动态推送
        satisfyIndex:null,
        frequencySettingDialogVisible: false,
        contentDataAllList:[],   
        indexRange:[], 
        earlywarn:[],
        remindOpenDtoList:[],
        serviceDateList:[
            {
                label:'服务开始后',
                value:'1'
            },
            {
                label:'纳入后',
                value:'2'
            }
        ],
        reminderObject:[
            {
                label:'患者',
                value:'1'
            },
            {
                label:'医生',
                value:'2'
            }
        ],
        reminderMethod:[
            {
                label:'系统消息',
                value:'1'
            },
            {
                label:'短信消息(仅患者)',
                value:'2'
            }
        ],
        reminderTime:[
            {
                label:'计划当天',
                value:'1'
            },
            {
                label:'计划前',
                value:'2'
            },
            {
                label:'超期',
                value:'3'
            }
        ], 
        checkxyList:[],            
        indicatorRangeList: [], 
        earlywarningList:[],    
        setcountList:[
            {
                label:'周期均值',
                value:'1'
            },
            {
                label:'最近监测值',
                value:'2'
            }
        ],   
        contactList:[
            {
                label:'评估后自动触发',
                value:'1'
            },
            {
                label:'经询问后触发',
                value:'2'
            }
        ], 
        trendsPashList:[
            {
                label:'开启后动态推送',
                value:'1'
            },
            {
                label:'不开启动态推送',
                value:'2'
            }
        ],
        trendsValueList:[
            {
                label:'满足达标值后即触发',
                value:'1'
            },
            {
                label:'满足达标值并询问患者，经过同意后触发',
                value:'2'
            }
        ]           
    };
  },
  methods: {  
    inputValueChange(val,type){  
        setTimeout(() => {
            this.cycleNum = +window.localStorage.getItem('cycleNum');                 
            let name = type=='1'?'pushDay':'assessDay'
            if(+val<0) this.$set(this.sendTagDiseases, name, 0)
            if(+val>this.cycleNum) this.$set(this.sendTagDiseases, name, this.cycleNum)   
            if(!(/(^[0-9]\d*$)/.test(+val))){
                this.$set(this.sendTagDiseases, name, null)   
                this.$message.warning('请输入整数')
            } 
        }, 500);      
    },
    frequencySettingOnSubmit(data) {
        console.log(`frequencySettingOnSubmit`, data)
        // 每天1次
        // { "pushUnit": "DAY", "clockingTimes": 0, "text": "每天1次", "executeCount": "1", "pushCycle": "1" }
        // 每周周一周三
        // { "pushUnit": "WEEK", "clockingTimes": 0, "text": "每周周一、周三", "pushCount": "1", "pushCycle": [1, 3] }
        // 每月1号最后一天
        // { "pushUnit": "MONTH", "clockingTimes": 0, "text": "每月1号、最后一天", "pushCount": "1", "pushCycle": [1, 32] }

        // pushUnit (单位:DAY,WEEK,MONTH)
        // pushCycle(频率,例如：没几天，每一周周几，每一个月第几天)
        // executeCount(用户需要执行次数)
        // clockingTimes(用户打卡次数) --


        // pushUnit (单位:DAY,WEEK,MONTH)
        // pushCount(每隔的周数，每隔的月数)
        // pushCycle(频率,例如：没几天，每一周周几，每一个月第几天)
        // executeCount(用户需要执行次数)

        //meitian pushUnit pushCycle  executeCount

        //周 月 pushUnit pushCount  pushCycle

        let param = {
            pushUnit: data.pushUnit, 
            pushCount:(data.pushUnit=='WEEK'||data.pushUnit=='MONTH')?data.pushCount:null, 
            executeCount:data.pushUnit=='DAY'?data.executeCount:null, 
            pushCycle:data.pushCycle, 
            text:data.text
        }    
        let parList = ['pushUnit','pushCount','executeCount','pushCycle','text']; 
        if(this.distinguish=='pushCycle'){          
            parList.forEach(name => {             
                //this.$set(this.sendTagDiseases, name, param[name])  
                this.sendTagDiseases[name] = param[name];       
            })
            //console.log(this.sendTagDiseases)
            this.frequencySettingDialogVisible = false;
            this.frequencySettingData = {}            
        }
        if(this.distinguish=='assessCycle'){          
            let nameList = ['assessUnit','assessCount','assessExecuteCount','assessCycle','assessTxt'];
            parList.forEach((name, index) => {            
                //this.$set(this.sendTagDiseases, nameList[index], param[name])   
                this.sendTagDiseases[nameList[index]] = param[name];           
            })
            //console.log(this.sendTagDiseases)
            this.frequencySettingDialogVisible = false;
            this.frequencySettingData = {}  
        }
        if(this.distinguish=='satisfyFlag'){
            let { satisfyFlag } = this.sendTagDiseases;
            parList.forEach(name => { 
                //console.log(name, param[name])   
                satisfyFlag[this.satisfyIndex-1][name] = param[name];       
                //this.$set(satisfyFlag[this.satisfyIndex-1], name , param[name])             
            })                   
            //console.log(this.sendTagDiseases)
            this.frequencySettingDialogVisible = false;
            this.frequencySettingData = {}          
        }              
    },  
    handleChange(val){
        //console.log(val=='2')
        if(val=='2'){         
            let resetData = [ 
                {
                    value:1,   
                    carbleFlag:false,                 
                    pushUnit:'',
                    pushCount:null,
                    executeCount:null,
                    pushCycle:'',
                    text:''
                },
                { 
                    value:2,   
                    carbleFlag:false,                 
                    pushUnit:'',
                    pushCount:null,
                    executeCount:null,
                    pushCycle:'',
                    text:''
                }
            ]
            this.$set(this.sendTagDiseases,'dynamicPushType', '')
            this.$set(this.sendTagDiseases,'satisfyFlag', resetData)
            console.log(this.sendTagDiseases)
        }
    },
    getRangeChange(list, type){
        console.log(list, type)
        //let creatMapList = type=='1'?this.indicatorRangeList:this.checkxyList;
        let creatMapList = this.sendTagDiseases.taskItemRemindDtoList.filter(parm => parm.type=='1').map(item => {           
            return {label:item.name, value:item.itemId, unitId:item.unitId, standardRang:item.standardRang} 
        })
        console.log(creatMapList)   
        this.remindOpenDtoList = creatMapList.filter(item => list.includes(item.value)).map((item) => {
            return {
                itemId: item.value, 
                name: item.label,
                unitId: item.unitId,
                standardRang:item.standardRang,
                operatorId:'',
                value1:'',
                value2:'',  
                requisiteFlg:0, //0:和  1:或
                type:'2', //1.任务 2.评估或预警    
            };
        });   
        let remindDtoList = this.sendTagDiseases.taskItemRemindDtoList.filter(parm => parm.type=='1');  
        //console.log(remindDtoList)       
        let allDataList = remindDtoList.concat(this.remindOpenDtoList)
        console.log(allDataList)       
        this.$set(this.sendTagDiseases, 'taskItemRemindDtoList', allDataList)
        console.log(this.sendTagDiseases)  
        console.log('----------------------')                   
    },
    remindFlagChange(val){     
        //    let remindDtoList = this.sendTagDiseases.taskItemRemindDtoList.filter(parm => parm.type=='1');     
        //    if(val == 1 && this.senTaskDtoType=='1'){                            
        //       let indexRangeList = remindDtoList.map((item) => {
        //         return {
        //             label: item.name,
        //             value: item.itemId,
        //             unitId: item.unitId 
        //         }
        //       })  
            
        //       this.indicatorRangeList = indexRangeList;
        //       //console.log(this.indicatorRangeList)                                    
        //    }
        //    if(val == 1 && this.senTaskDtoType=='2'){      
        //       let indexRangeList = remindDtoList.map((item) => {
        //         return {
        //             label: item.name,
        //             value: item.itemId,
        //             unitId: item.unitId 
        //         }
        //       })           
        //       this.checkxyList = indexRangeList;
        //       //console.log(this.checkxyList) 
        //    }    
    },
    returnDisplay(type, cont){
        this.distinguish = type;  
        this.frequencySettingDialogVisible = true; 

        let setTimeParam = {};                  
        if(type=='pushCycle'||type=='satisfyFlag'){   
            if(type=='satisfyFlag'){
                this.satisfyIndex = cont.value; //索引  
            }     
            let {pushUnit, pushCount, executeCount, pushCycle} = (type=='pushCycle')?this.sendTagDiseases:this.sendTagDiseases.satisfyFlag[cont.value-1];
            setTimeParam.pushUnit = pushUnit;
            setTimeParam.pushCount = pushCount;
            setTimeParam.executeCount = executeCount;
            setTimeParam.pushCycle = pushUnit=='DAY'?pushCycle:(typeof(pushCycle)=='string'?JSON.parse(pushCycle):pushCycle);
        }
        if(type=='assessCycle'){          
            let {assessUnit, assessCount, assessExecuteCount, assessCycle} = this.sendTagDiseases;
            setTimeParam.pushUnit = assessUnit;
            setTimeParam.pushCount = assessCount;
            setTimeParam.executeCount = assessExecuteCount;
            setTimeParam.pushCycle = assessUnit=='DAY'?assessCycle:(typeof(assessCycle)=='string'?JSON.parse(assessCycle):assessCycle);
        }
        // if(type=='satisfyFlag'){
        //     this.satisfyIndex = cont.value; //索引 
        //     let { pushUnit, pushCount, executeCount, pushCycle } = this.sendTagDiseases.satisfyFlag[cont.value-1];
        //     setTimeParam.pushUnit = pushUnit;
        //     setTimeParam.pushCount = pushCount;
        //     setTimeParam.executeCount = executeCount;
        //     setTimeParam.pushCycle = pushUnit=='DAY'?pushCycle:(typeof(pushCycle)=='string'?JSON.parse(pushCycle):pushCycle);
        // }
        console.log(this.sendTagDiseases)
        console.log(setTimeParam)
        console.log('-------------------')
        this.frequencySettingData = setTimeParam;
    },
    onClose(){
        this.frequencySettingDialogVisible = false;
        this.frequencySettingData = {}
    },
    //请选择 清空
    selectClearChange(type, cont){
        this.distinguish = type;   
               
        if(this.distinguish=='pushCycle'){
            let parList = ['pushUnit','pushCount','executeCount','pushCycle','text'];         
            if(this.sendTagDiseases.text){
                //this.$delete(this.sendTagDiseases,'text'),
                //this.$set(this.sendTagDiseases,'text','');
                console.log(this.sendTagDiseases)
                parList.forEach(name => {
                    this.sendTagDiseases[name] = '';                     
                })    
                this.$forceUpdate()
                console.log(this.sendTagDiseases)                   
            }else this.frequencySettingDialogVisible = true;                       
        } 
        if(this.distinguish=='assessCycle'){
            let nameList = ['assessUnit','assessCount','assessExecuteCount','assessCycle','assessTxt'];
            if(this.sendTagDiseases.assessTxt){
                //this.$delete(this.sendTagDiseases,'assessTxt'),
                //this.$set(this.sendTagDiseases,'assessTxt','');
                nameList.forEach(name => {
                    this.sendTagDiseases[name] = '';     
                })
                this.$forceUpdate()
            }else this.frequencySettingDialogVisible = true;             
        } 
        if(this.distinguish=='satisfyFlag'){           
            this.satisfyIndex = cont.value; //索引     
            let parList = ['pushUnit','pushCount','executeCount','pushCycle','text'];      
            if(cont.pushUnit){
                // this.$delete(cont,'text'),
                // this.$set(cont,'text','')  
                parList.forEach(name => {
                    cont[name] = '';                     
                })             
                // cont.text = ''
                // cont.pushUnit = ''
                // cont.pushCycle = ''
                // cont.pushCount = null;
                // cont.executeCount = ''  
                this.$forceUpdate()         
            }else this.frequencySettingDialogVisible = true;  
            console.log(cont)              
        }           
    }   
  }
};
</script>

<style lang="scss">
.rangewidth .el-input__inner{                    
    height: 25px;
    line-height: 25px;
    background-color: #F0F0F0;
    border:none
}
.rangewidth .el-input__icon{
    line-height: 25px;
} 
.rangewidth .el-input__inner::placeholder,.autoWidth-select .el-input__inner::placeholder{
    color: red;
}
.rangewidth .el-input__inner,.autoWidth-select .el-input__inner{    
    color: rgba(68, 106, 189, 1);    
} 
.inputwidth .el-input__inner{    
    color: #606266 !important;    
} 
// .rangewidth .el-select__caret,.autoWidth-select .el-select__caret{
//     color: rgba(68, 106, 189, 1) !important;  
// } 

// .commonTagDiseases .el-input__inner{  
//     font-size: 14px;                    
//     height: 25px;
//     line-height: 25px;
//     background-color: rgba(247, 247, 247, 1);
// }
// .rangewidth .el-input__inner, .trendswidth .el-input__inner{    
//     color: rgba(68, 106, 189, 1);    
// } 
// .rangewidth .el-input__inner::placeholder, .trendswidth .el-input__inner::placeholder,.operwidth .el-input__inner::placeholder {
//     color: red;
// }
// .rangewidth .el-input__icon, .operwidth .el-input__icon, .trendswidth .el-input__icon{
//     line-height: 25px;
// } 
// //排除样式
// .trendswidth .el-input__inner{
//     border:none;
//     background-color: rgba(255, 255, 255, 1);
// }
// .trendswidth .el-select__caret{
//     color: rgba(68, 106, 189, 1) !important;  
// } 

.autoWidth-select {
    min-width: 120px;   
    margin-right: 20px;
    text-align: start; 
    cursor: pointer;
}
.autoWidth-select  .el-input__prefix {  
    position: relative;
    padding: 0 32px;
    height: 32px;
    line-height: 32px;
    //visibility: hidden;
    color: transparent;
}
.autoWidth-select  .el-input__inner {
    position: absolute;  
    border:none;
    background: #ffffff;
} 
.autoWidth-select .el-select__caret{
    color: #446ABD !important;     
}

.area-choose{
    .el-select-dropdown__item{
        padding: 0 20px 0 28px !important;
    }
    .popper__arrow{
        display: none !important;
    }
}
.area-choose[x-placement^=bottom] {
    margin-top: 0 !important;
}
</style>
<style lang="scss" scoped>
.commonTagDiseases{       
    margin-top: 20px;  
    .componentType,.componentCut{
        border:1px solid #D3DCEC;
    }
    .componentCut{
        .checkHeader{
            padding: 10px;
        }
        .checkContList{
            padding: 10px 0; 
            background: #F7F7F7;
            .msgTxt{   
                padding: 0 0 10px 10px;         
                color: rgba(100, 100, 100, 1);
                font-size: 14px;
                font-weight: bold;
            }
        }
    }
    .setItem{
        display: flex;
        border-bottom:1px solid #D3DCEC;
        .label{
            width: 12%; 
            padding: 12px 0;
            background: #F7F7F7;
            text-align: right;
            border-right:1px solid #D3DCEC;
            box-sizing: border-box;
            span{
                font-size: 14px;
                color: rgba(78, 89, 105, 1);
                padding-right: 12px;
                i{
                    font-size: 12px;
                    color: #F56C6C;  
                }
            }        
        }
        .contset{
            width: 88%; 
            padding: 12px 0;  
            display: flex;  
            .leftwrap{
                width: 60%;         
                border-right: 1px solid #D3DCEC;
                box-sizing: border-box;
            } 
            .rightwrap{
                width:40%; 
            }  
            .padContent{
                padding: 0 10px;         
            }

            .setFrequency{
                display: flex; 
                .inputday{
                    margin-left: 12px;
                    .rangewidth{
                        width:40%;
                    } 
                }    
            }
            .setDateTime{
                .setTimeDate{    
                    cursor:pointer;      
                    font-size: 14px;
                    color: rgba(68, 104, 189, 1);            
                }
                .chooseClear{
                    padding-left:12px;
                    font-size: 14px;
                    color: rgba(245, 108, 108, 1);
                    cursor: pointer;
                }
            } 
            .addCondition{
                .el-button{
                    width: 98px;
                    height: 25px;
                    padding: 0;
                    background-color: rgba(68, 106, 189, 1);              
                    font-size: 14px;
                    color: rgba(255, 255, 255, 1);
                    text-align: center;
                    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.2);
                }                            
            }           
            .reminderList{
                display: flex;
                span{ 
                    margin: 1px 10px 0 0;
                    display: inline-block;                                    
                    font-size: 14px; 
                    color:#4E5969;    
                    &::before{                    
                        content: '*';                 
                        font-size: 12px;
                        color: #F56C6C;     
                    }             
                }
                .reminderParam{
                    display: flex;
                    width: 40%;
                    border-right: 1px solid #D3DCEC;
                    box-sizing: border-box;
                }
                .reminderType{
                    display: flex;
                    width: 60%;                
                }
            }                                
            .consultaPurpose{
                width: 100%;
                .tagList{
                display: flex;
                span{  
                    padding: 5px 10px;
                    margin-right: 10px;
                    display: inline-block;                                            
                    font-size: 14px;      
                    color: rgba(16, 16, 16, 1);  
                    border-radius: 3px;                  
                    border: 1px solid rgba(220, 224, 231, 1);
                    cursor: pointer;
                    i{
                        display: none;
                    }
                    &:hover{                      
                        background-color: rgba(233, 243, 255, 1);                             
                        border: 1px solid rgba(56, 148, 255, 1);
                        i{
                            display: inline-block;
                        }
                    }
                    
                }
                }
                .discriction{
                    // margin-top:10px; 
                    border:1px solid #D3DCEC; 
                    box-sizing: border-box;
                    display: flex;   
                    span{
                        display: inline-block;
                        width: 90px;
                        font-size: 14px;
                        color: #B8B9BC;
                        padding:5px 0 0 10px;
                        background: #F7F7F7; 
                    }   
                    ::v-deep .el-textarea__inner{
                        border:none;
                        background-color: #F7F7F7 !important;
                    }                               
                }
            }
            .setTrendsTop{                     
                .trendswidth{
                    margin-left: 12px;
                }
            }
            .setTrendsBottom{
                margin-top: 12px;
                .trendItem{
                    display: flex;
                    margin-top: 12px; 
                    .trendTip{
                        padding-left: 15px;
                    } 
                    .setTimeDate{
                        cursor:pointer;      
                        font-size: 14px;
                        color: rgba(68, 104, 189, 1);   
                    }
                    .chooseClear{
                        padding-left:12px;
                        font-size: 14px;
                        color: rgba(245, 108, 108, 1);
                        cursor: pointer;
                    }                                 
                }
            }
            .checkHeader{
                padding: 10px 0;
            }   
            .checkContList{
                padding: 10px 0;
                background: #F7F7F7;
                .msgTxt{                 
                    color: rgba(100, 100, 100, 1);
                    font-size: 14px;   
                    font-weight: bold;              
                }
            }
        }
    }   
    .estimateFlag{
        margin: 12px 0;   
        display: flex;            
        .warinTxt{
            margin-left: 10px;
            line-height: 20px;   
            font-size: 14px;
            color: rgba(78, 89, 105, 1);           
            span{
                font-size: 12px;
                color: rgba(245, 108, 108, 1);                              
            }  
        }                                     
    } 
}
</style>