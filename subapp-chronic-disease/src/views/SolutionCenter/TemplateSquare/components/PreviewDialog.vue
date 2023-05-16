<!--
 * @Author: Zjj
 * @Date: 2023-04-06 14:34:44
 * @LastEditTime: 2023-04-06 14:34:44
 * @LastEditors: Zjj
 * @Description: PreviewDialog
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/components/PreviewDialog.vue
-->
<template>
    <el-drawer
      :title="title"
      :visible.sync="previewDialogVisible"      
      :size="718"    
      :wrapper-closable="false"
      :before-close="handleClose"
      class="universal-dialog"   
    >
      <template #title>
        <div class="dialog-head">{{ title }}</div>
      </template>
      <div class="dialog-body" v-loading='loading'>
        <div class="stageitem">
            <div class="label">疾病分期:</div>
            <div class="stagelist">
                <div class="all" :class="tabChangeIndex==0 ? 'active' : ''" @click="dressingAllChange">全部</div>
                <div class="line"></div>
                <div class="itemlist">                                                                              
                    <div                    
                    v-for="item in diseaseInstallmentList" 
                    :key="item.seq"
                     class="item" 
                    :class="screenList.includes(item.seq) ? 'active' : ''" 
                    @click="dressingChange(item)">
                    {{ item.name }}
                    </div>                        
                </div>
            </div>
        </div>
        <div class="stageconent">
            <el-scrollbar style="height: calc(100vh - 120px)"> 
                <div class="diseaselist" v-for="item in disaseListOption" :key="item.seq">
                    <div class="item-name" :class="{ 'item-top': item.seq >0 }">
                        <span>{{ item.seq+1 }}</span> {{ item.name }}
                    </div>
                    <div class="itemcontain">
                        <div class="item-list" v-for="cont in item.conditionsList" :key="cont.seq">                        
                            <div :class="['andsqueLine', { andsqueLine0: (item.conditionsList.length >1 && (cont.seq+1) != item.conditionsList.length) && cont.requisiteFlg==0 },{ andsqueLine1: (item.conditionsList.length >1 && (cont.seq+1) != item.conditionsList.length) && cont.requisiteFlg==1 }]">        
                                <div :class="cont.requisiteFlg === 0 ? 'andsque' : 'andsquecolor'">{{ cont.requisiteFlg==0 ? '和' : '或' }}</div>    
                            </div>                            
                           
                            <div class="ConfigurationList">
                                <div class="name">
                                    <i :class="['line', { line_liney: cont.requisiteFlg==1 }]"></i> 
                                    <i :class="['circle', { circle_liney: cont.requisiteFlg==1 }]"></i>
                                    {{ cont.name }} 
                                    <span v-if="cont.needTot">
                                        {{ cont.needTot==cont.conDetailList.length ? '全部满足':`满足任一${cont.needTot}个`}}                          
                                    </span>
                                </div>
                                <!-- 检验检查 -->
                                <div 
                                  class="inspectioncontain"
                                  v-if="cont.conDetailList && cont.conDetailList.length && cont.name=='院内检验检查'">
                                    <div class="item_list" v-for="cent in cont.conDetailList" :key="cent.seq">
                                        <div :class="['rangeSque', { rangeQueLine0: (cont.conDetailList.length >1 && (cent.seq+1) != cont.conDetailList.length) && cent.requisiteFlg==0 },{ rangeQueLine1: (cont.conDetailList.length >1 && (cent.seq+1) != cont.conDetailList.length) && cent.requisiteFlg==1 }]">                                       
                                            <div :class="cent.requisiteFlg === 0 ? 'sonsque' : 'sonsquecolor'" @click="sonsqueChange(item)">
                                                {{ cent.requisiteFlg==0 ? '和' : '或' }}
                                            </div>                    
                                        </div> 
                                        <div class="rangeContent">
                                           <div class="title">{{cent.name}}</div> 
                                           <pointDiseaseTag 
                                            :senJmConDConDtoList="cent.jmConDConDtoList"
                                            :operatorList1="operatorList1"/> 
                                        </div>  
                                    </div>
                                </div>
                                <!-- 病例信息 -->   
                                <div 
                                    class="caseinformationbox"
                                    v-if="cont.conDetailList && cont.conDetailList.length && cont.name=='病历信息'">
                                    <CaseInformationCut 
                                    ref="caseInformationCutRef"
                                    :sendIndicatorList="cont.conDetailList"   
                                    :operatorList2="operatorList2"
                                    :type="2"/>     
                                </div>                                                                                   
                            </div>
                        </div>
                    </div>               
                </div>
            </el-scrollbar>  
        </div>                 
      </div>     
    </el-drawer>
  </template>
  
<script>
import pointDiseaseTag from './pointDiseaseTag.vue'
import CaseInformationCut from "./CaseInformation.vue";
import {  } from '@/api/modules/SolutionCenter/index.js'
export default {
name: 'PreviewDialog',
components: {
    pointDiseaseTag,
    CaseInformationCut        
},
props: {   
    previewDialogVisible: {
        type: Boolean  
    },
    title: {
        type: String
    },
    planData:{ 
        type: Object
    },
    diseaseInstallmentList:{
        type: Array,
        required: true
    },
    operatorOptionsList:{
        type: Object,
        required: true
    },  
    defaultParam:{
        type:Object
    }    
},
model: {
    prop: 'previewDialogVisible',
    event: 'close',
},
data() {
    return {   
        tabChangeIndex: 0,  
        operatorList2:[],
        operatorList1:[],
        screenList:[],      
        planId: '',
        disaseListOption:[],
        loading:true
    }
},
created() {
    const { planId } = this.$route.query
    this.planId = planId;    
},
watch:{
    loading:{
      deep:true,
      handler(newValue){ 
        if(!newValue){
            this.initChange()
        }
      }
    }
},
mounted() {   
    this.operatorList1 = this.operatorOptionsList['c01984dc21a34ab7b894b4abac46c517']; 
    this.operatorList2 = this.operatorOptionsList['3cefd874eaea401db79daead8f689d5e'];      
},
methods: { 
    initChange(){     
        if(this.defaultParam.type=='1'){
            this.tabChangeIndex = 0;
            this.disaseListOption = this.diseaseInstallmentList;
        }else{
            this.tabChangeIndex = 1;
            let idList = this.defaultParam.list.map(item => {return item.id})                    
            this.diseaseInstallmentList.forEach(item => {
                if(idList.includes(item.id)){
                    this.disaseListOption.push(item)
                    this.screenList.push(item.seq);
                }
            })
        }
    },
    dressingAllChange(){
        this.screenList = [];
        this.tabChangeIndex = 0;
        this.disaseListOption = this.diseaseInstallmentList;
    }, 
    dressingChange(item){
        this.tabChangeIndex = 1; //取消全部
        let index = item.seq;
        if(!this.screenList.includes(index)){
            this.screenList.push(index)
        }else{
            this.screenList = this.screenList.filter(val => val !== index)
        }
        if(!this.screenList.length){
            this.tabChangeIndex = 0;
            this.disaseListOption = this.diseaseInstallmentList;
        }else{
            this.disaseListOption = this.diseaseInstallmentList.filter(item => this.screenList.includes(item.seq))
        } 
        // console.log('screenList', this.screenList)
        // console.log('disaseListOption', this.disaseListOption)
    },     
    handleClose() {
     this.$emit('close', false)
    }
},
}
</script>

<style lang="scss" scoped>
.universal-dialog {
::v-deep .el-drawer__header {    
    margin-bottom: 0; 
    font-size: 16px;
    color: rgba(48, 49, 51, 1);
    padding: 10px 0 10px 35px !important;
    border-bottom: 1px solid #D3DCEC;
}  
::v-deep .el-drawer__body {
    padding: 10px;     
}
.dialog-head{
    position: relative;
    font-weight: 700;
    &::before {
        content: '';
        position: absolute;
        left: -15px;
        width: 3px;
        height: 19px;
        margin-top: 4px;
        background-color: #134796;
    }
}  
.dialog-body{
    .stageitem{
        padding: 0 0 10px;
        display: flex;       
        font-size: 14px;
        color: rgba(78, 89, 105, 1);
        .label{
            width: 70px;
            height: 32px;
            line-height: 32px;
        }
        .stagelist{
            display: flex;
            .all{
                width: 40px;
                height: 32px;
                line-height: 32px; 
                border-radius: 4px;  
                text-align: center; 
                cursor: pointer;                                  
                &.active{
                    color:#446ABD;
                    background: #F1F5FB;
                }
            }
            .line{               
                width: 1px;
                height: 25px;
                background: rgba(211, 220, 236, 1);
                margin: 3.5px 10px 0;  
            }
            .itemlist{ 
                width: 572px;  
                overflow: hidden;
                overflow-x: auto;
                white-space: nowrap;                                
                display: flex;                                   
                .item{
                    padding: 0 5px;
                    height: 32px;
                    line-height: 32px; 
                    border-radius: 4px;
                    margin-right: 10px;  
                    cursor: pointer;                
                    &.active{
                        color:#446ABD;
                        background: #F1F5FB;
                    }
                }
            }
        }
    }
    .stageconent{
        padding: 0 5px;
        .diseaselist{
            .item-name{
                margin-right: 5px;
                font-size: 14px;
                color: rgba(100, 100, 100, 1);
                span{  
                    display: inline-block;                  
                    width: 20px;
                    height: 20px;
                    line-height: 20px;
                    border-radius: 100%;
                    background-color: rgba(68, 104, 189, 1);
                    color: rgba(255, 255, 255, 1);
                    font-size: 14px;
                    text-align: center;
                    //font-family: Roboto;
                }
            }
            .item-top{
                margin-top: 15px;
            }
            .itemcontain{
                margin-top:15px;               
                .item-list{
                    display: flex;
                    .andsqueLine{
                        width:12px;                                                                     
                        &.andsqueLine0{
                            border-right: 3px dotted rgb(245, 108, 108); 
                        }
                        &.andsqueLine1{
                            border-right: 3px dotted rgba(228, 148, 59, 1);
                        }
                        .andsque,.andsquecolor{       
                            width: 24px;
                            height: 24px;      
                            line-height: 24px;
                            border-radius: 4px;                        
                            font-size: 14px;
                            color: rgba(245, 108, 108, 1);  
                            text-align: center;
                            background-color: rgba(249, 210, 210, 1);      
                        }
                        .andsquecolor{                              
                            color: rgba(228, 148, 59, 1); 
                            background-color: rgba(249, 235, 210, 1);   
                        } 
                            
                    }
                    .ConfigurationList{
                        margin-left: 12px;
                        padding-bottom: 15px;
                        width:662px;
                        .name{
                            margin-bottom: 10px;
                            font-size: 14px;
                            color: rgba(68, 106, 189, 1);
                            font-weight: bold;
                            .line{
                                padding: 1.5px 10px;
                                border-top: 3px dotted rgb(245, 108, 108);
                                display: inline-block;    
                                &.line_liney {
                                    border-top: 3px dotted rgba(228, 148, 59, 1);
                                }
                            }
                            .circle{           
                                width: 8px;
                                height: 8px;  
                                border-radius: 100%;  
                                display: inline-block;          
                                background-color: rgba(245, 108, 108, 1);    
                                &.circle_liney {
                                    background-color: rgba(228, 148, 59, 1);    
                                }        
                            } 
                            span{
                                color: rgba(153, 153, 153, 1);  
                            }
                        }
                        .caseinformationbox{
                            margin-left: 24px;
                        }
                        .inspectioncontain{
                            margin-left: 24px;
                            .item_list{
                                display: flex;
                                .rangeSque{ 
                                    position: relative;                 
                                    width: 12px;
                                    padding: 0 0 24px;               
                                    &.rangeQueLine0{
                                        border-right: 3px dotted rgb(245, 108, 108); 
                                    }  
                                    &.rangeQueLine1{
                                        border-right: 3px dotted rgba(228, 148, 59, 1);
                                    }                                     
                                    .sonsque,.sonsquecolor{        
                                        width: 24px;
                                        height: 24px;
                                        line-height: 24px;                            
                                        border-radius: 4px;
                                        background-color: rgba(249, 210, 210, 1);
                                        font-size: 14px;
                                        color: rgba(245, 108, 108, 1);       
                                        text-align: center;
                                        cursor: pointer;              
                                    }
                                    .sonsquecolor{
                                        background-color: rgba(249, 235, 210, 1);
                                        color: rgba(228, 148, 59, 1);   
                                    } 
                                } 
                                .rangeContent{
                                    margin-left: 24px;  
                                    .title{
                                        margin-bottom: 12px;
                                        font-size: 14px;
                                        color: rgba(78, 89, 105, 1);
                                        font-family: Roboto;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
} 
}
::-webkit-scrollbar {
width: 5px;
height: 5px;
border-radius: 5px;
overflow: auto;   
}

::-webkit-scrollbar-thumb {
background-color: #D2D2D8;
} 
</style>
  