<!--
 * @Author: zj
 * @Date: 2023-03-02 11:05:51
 * @LastEditTime: 2023-03-02 11:05:51
 * @LastEditors: zj
 * @Description: 指标检测 达标评估
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/components/ComplianceAssessment.vue
-->
<template>
    <div class="complianceAssessment">  
        <div class="componentType" v-if="sendDiseaseType=='jbp'||sendDiseaseType=='jbs'">             
            <!-- 开启达标评估 -->
            <div class="openEstimate">
                <div class="setItem">
                    <div class="label"><span>指标范围</span></div>
                    <div class="contset">
                        <div class="padContent">
                            <el-checkbox-group v-model="sendEstimateDiseases.indicatorRange">
                                <el-checkbox v-for="v in indicatorRangeList" :key="v.value" :label="v.label" :value="v.value"></el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>
                <div class="setItem">
                    <div class="label"><span>达标值设置</span></div>
                    <div class="contset">
                        <ContractBloodPressure :senJmConDConDtoList="sendEstimateDiseases.jmConDConDtoList" />                      
                    </div>
                </div>
                <div class="setItem">
                    <div class="label"><span>评估频率设置</span></div>
                    <div class="contset">                      
                        <div class="leftwrap">
                            <div class="setFrequency padContent">
                                <el-select v-model="sendEstimateDiseases.serviceType" placeholder="请选择" class="rangewidth">
                                    <el-option
                                    v-for="item in serviceDateList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select> 
                                <div class="inputday">
                                    第 <el-input type="number" v-model="sendEstimateDiseases.dayNum" class="mo-input--number inputwidth"></el-input> 天
                                </div> 
                            </div>                       
                        </div>
                        <div class="rightwrap">
                            <div class="setDateTime padContent">
                                <!-- {{ sendEstimateDiseases.setDayTime.validateCode }} {{ sendEstimateDiseases.setDayTime.validateNum }} -->
                                <span class="setTimeDate">每  次</span>
                                <span class="chooseClear">请选择/清空</span>
                            </div>                       
                        </div>                    
                    </div>
                </div>
                <div class="setItem">
                    <div class="label"><span>评估算计设置</span></div>
                    <div class="contset">
                        <div class="padContent">                              
                            <el-radio-group v-model="sendEstimateDiseases.setcount">
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
                                <el-radio-group v-model="sendEstimateDiseases.trendsPash">        
                                    <el-radio
                                    v-for="item in trendsPashList"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.value"
                                    >{{item.label}}</el-radio>
                                </el-radio-group>  
                                <el-select v-model="sendEstimateDiseases.trendsPashValue" placeholder="请选择" class="trendswidth" v-show="sendEstimateDiseases.trendsPash == '1'">
                                    <el-option
                                    v-for="item in trendsValueList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>                                     
                            </div> 
                            <div class="setTrendsBottom">
                                <div class="trendItem">                                 
                                    <el-checkbox v-model="sendEstimateDiseases.standardParam.standardValue">满足达标值设置</el-checkbox>
                                    <div class="trendTip" v-show="sendEstimateDiseases.standardParam.standardValue">
                                        <span>推送频率调整为</span>
                                        <el-select v-model="sendEstimateDiseases.standardParam.standardType" placeholder="请选择" class="trendswidth" >
                                            <el-option
                                            v-for="item in trendsValueList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                            </el-option>
                                        </el-select> 
                                    </div>                             
                                </div>
                                <div class="trendItem">                                
                                    <el-checkbox v-model="sendEstimateDiseases.standardParam.nostandardValue">不满足达标值设置</el-checkbox>
                                    <div class="trendTip" v-show="sendEstimateDiseases.standardParam.nostandardValue">
                                        <span>推送频率调整为</span>
                                        <el-select v-model="sendEstimateDiseases.standardParam.nostandardType" placeholder="请选择" class="trendswidth" >
                                            <el-option
                                            v-for="item in trendsValueList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                            </el-option>
                                        </el-select> 
                                    </div>                                  
                                </div>                                                             
                            </div>                          
                        </div>
                    </div>
                </div>
                <div class="setItem">
                    <div class="label"><span>触发时机</span></div>
                    <div class="contset">
                        <div class="padContent">
                            <el-radio-group v-model="sendEstimateDiseases.contactTime">
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
            </div>
        </div>     

        <div class="componentCut" v-else>                 
            <!-- 开启达标评估 -->
            <div class="openEstimate">                 
                <div class="checkHeader">
                    <el-checkbox-group v-model="sendEstimateDiseases.checkGroupList">
                        <el-checkbox v-for="v in checkxyList" :key="v.value" :label="v.label" :value="v.value"></el-checkbox>
                    </el-checkbox-group>  
                </div>
                <div class="checkContList">
                    <div class="msgTxt">满足一下</div>
                    <ContractBloodPressure :senJmConDConDtoList="sendEstimateDiseases.jmConDConDtoList" /> 
                </div>             
            </div>
        </div>
    </div>
</template>

<script>
import ContractBloodPressure from './ContractBloodPressure.vue'
import {  } from '@/api/modules/SolutionCenter/index.js'
export default {
  props: {   
    sendEstimateDiseases: {
      type: Object,
      required: true
    },
    sendDiseaseType:{
      type: String,
      required: true
    } 
  },
  components: {
    ContractBloodPressure
  },
  created(){
    console.log(`指标监测-血压血糖 组件`, this.sendIndicatorList)
  },
  data() {
    return {
        checkxyList:[
            {
                label:'收缩压SBP',
                value:'1'
            },
            {
                label:'舒张压',
                value:'2'
            }
        ],       
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
        indicatorRangeList: [
            {
                label:'收缩压SBP',
                value:'1'
            },
            {
                label:'舒张压HR',
                value:'2'
            },
            {
                label:'心率',
                value:'3'
            }
        ], 
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
                label:'满足达标值后触发',
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
    
  }
};
</script>

<style lang="scss">
.el-input__inner{  
    font-size: 14px;                    
    height: 25px;
    line-height: 25px;
    background-color: rgba(247, 247, 247, 1);
}
.rangewidth .el-input__inner, .trendswidth .el-input__inner{    
    color: rgba(68, 106, 189, 1);    
} 
.rangewidth .el-input__inner::placeholder, .trendswidth .el-input__inner::placeholder {
    color: red;
}
.rangewidth .el-input__icon, .operwidth .el-input__icon, .trendswidth .el-input__icon{
    line-height: 25px;
} 
//排除样式
.trendswidth .el-input__inner{
    width:240px;
    border:none;
    background-color: rgba(255, 255, 255, 1);
}
.trendswidth .el-select__caret{
    color: rgba(68, 106, 189, 1) !important;  
}
</style>
<style lang="scss" scoped>
.complianceAssessment{       
    margin-top: 20px;
    border:1px solid #D3DCEC;
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
                    .inputwidth{
                        width:40%;
                    } 
                }    
            }
            .setDateTime{
                .setTimeDate{
                    font-size: 14px;
                    color: rgba(68, 104, 189, 1);            
                }
                .chooseClear{
                    padding-left:12px;
                    font-size: 14px;
                    color: rgba(245, 108, 108, 1);
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
                    .trendswidth{
                        margin-left: 12px;
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
    .openEstimate{
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
}
</style>