<!--
 * @Author: Nic
 * @Date: 2023-02-06 09:05:51
 * @LastEditTime: 2023-02-06 09:05:51
 * @LastEditors: Nic
 * @Description: 评估量表组件
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/components/AssessmentReport.vue
-->
<template>
    <div class="assessmentreport">  
        <div class="table_header" v-if="sendIndicatorList.jmCDCDetailDtoList && sendIndicatorList.jmCDCDetailDtoList.length">
            <div class="head_classification"><span>内容分类</span></div>
            <div class="head_name"><span>名称</span></div>
            <div class="head_type"><span>问卷类型</span></div>
            <div class="head_criteria"><span>筛选条件</span></div>
            <div class="head_label"><span>量表标签</span></div>
            <div class="head_operation"><span>操作</span></div>
        </div>         
        <div :class="['table_list', { table_list_bottom: index+1 !== sendIndicatorList.length }]" v-for="(item, index) in sendIndicatorList" :key="index">
            <div :class="item.sonAndOr ? 'sonsque' : 'sonsquecolor'" @click="item.sonAndOr = !item.sonAndOr">{{ item.sonAndOr ? '和' : '或' }}</div> 
            <div class="table_content">
                <div class="classification">
                    <div>{{ item.diseaseClassification=='1'?'疾病评估':(item.diseaseClassification=='2'?'服务评估':'随访问卷') }}</div>
                </div>
                <div class="name">
                    <div>{{ item.name }}</div>
                </div>
                <div class="type">
                    <div>{{ item.questionnaireTypel=='1'?'计分型':'条件升级' }}</div>
                </div>
                <div class="criteria">
                    <div class="seartalue" v-if="item.questionnaireTypel=='1'">
                        <el-input type="number" v-model="item.filterCriteria.minvalue" class="mo-input--number"></el-input>                   
                        <el-select v-model="item.filterCriteria.unit" placeholder="请选择">
                            <el-option
                            v-for="sont in uintList"
                            :key="sont.value"
                            :label="sont.label"
                            :value="sont.value">
                            </el-option>
                        </el-select>
                        <el-input type="number" v-model="item.filterCriteria.maxvalue" class="mo-input--number"></el-input>  
                    </div>
                    <div class="searselect" v-else>
                        <el-select v-model="item.filterSelect" multiple clearable placeholder="请选择">
                            <el-option
                            v-for="sont in uintLabelList"
                            :key="sont.value"
                            :label="sont.label"
                            :value="sont.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="label">
                    <div class="tag">{{item.gaugeLabel}}</div>
                </div>    
                <div class="operation">
                    <span class="eye"><i class="el-icon-eleme"></i></span>
                    <span class="del"><i class="el-icon-delete"></i></span>
                </div>                                   
            </div>         
        </div>         
    </div>
</template>

<script>
export default {
  props: {   
    sendIndicatorList: {
      type: Array,
      required: true
    }
  },
  components: {
   
  },
  created(){

  },
  data() {
    return {
        uintList:[
            {
                label:'<',
                value:'1'
            },
            {
                label:'~',
                value:'2'
            },
            {
                label:'>',
                value:'3'
            },
            {
                label:'=',
                value:'4'
            },
            {
                label:'≥',
                value:'5'
            },
            {
                label:'≤',
                value:'6'
            }
        ],
        uintLabelList:[
        {
                label:'高危人群',
                value:'1'
            },
            {
                label:'糖尿病者',
                value:'2'
            },
            {
                label:'糖尿病前期',
                value:'3'
            },
            {
                label:'正常',
                value:'4'
            }            
        ]
    };
  },
  methods: {
   
  }
};
</script>

<style lang="scss">
/* 去掉右侧上下箭头  */
.mo-input--number {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
}
.criteria .seartalue .el-input__inner,.criteria .seartalue .el-input,.criteria .searselect .el-input__inner{
    width:65px;
    height:24px;
    line-height: 24px;
    background-color: rgba(240, 240, 240, 1) !important;
}
.criteria .searselect .el-input__inner{
    width:200px !important;   
} 
.criteria .el-input__icon {  
    line-height: 24px;
}
</style>
<style lang="scss" scoped>
.assessmentreport{
    .table_header{    
        margin: 0 0 10px 34px;     
        height: 36px;
        line-height: 36px;           
        background-color: rgba(250, 250, 250, 1);  
        border: 1px solid #E8E8E8; 
        box-sizing: border-box;
        display: flex;
        div{                
            font-size: 12px;
            color: #101010;
            font-weight: bold; 
            span{
                padding-left:12px;
            } 
            &.head_classification{
                width:10%;           
            }  
            &.head_name{
                width:20%;              
            }  
            &.head_type{
                width:10%;             
            }   
            &.head_criteria{
                width:25%;             
            }   
            &.head_label{
                width:25%;              
            }    
            &.head_operation{
                width:10%;              
            }                           
        }   
    }
    .table_list{
        display: flex;         
        &.table_list_bottom{
           padding-bottom: 10px;          
        }        
        .sonsque,.sonsquecolor{             
            width: 24px;
            height: 24px;    
            line-height: 24px;   
            margin-top: 10px;         
            border-radius: 4px;
            font-size: 14px;
            color: rgba(245, 108, 108, 1);       
            text-align: center;
            background-color: rgba(249, 210, 210, 1);   
            cursor: pointer;            
        } 
        .sonsquecolor{
            background-color: rgba(249, 235, 210, 1);
            color: rgba(228, 148, 59, 1);   
        } 
        .table_content{
            width:100%;
            margin-left: 10px;
            border: 1px solid #D3DCEC; 
            box-sizing: border-box;      
            display: flex;   
            padding:10px 0;   
            .classification{
                width:10%;                   
            }
            .name{
                width:20%;         
            } 
            .type{
                width:10%;             
            } 
            .criteria{
                width:25%;            
                .seartalue,.searselect{
                    display: flex;
                    padding-left: 12px;               
                }
            } 
            .label{
                width:25%;    
                display: flex;
                .tag{   
                    display: inline-block;
                    padding: 0 5px;            
                    height: 24px;
                    line-height: 24px;
                    margin-left: 12px;
                    border-radius: 4px;
                    background-color: rgba(255, 242, 232, 1);
                    font-size: 12px;
                    color: rgba(250, 86, 31, 1);                                 
                }       
            }           
            .classification,.name,.type,.label,.operation{
                div{
                    height: 24px;
                    line-height: 24px;
                    font-size: 14px;
                    color: rgba(78, 89, 105, 1); 
                    padding-left:12px;                              
                }
                span{
                    padding-left: 12px;  
                }
            }           
        }
    } 
}
</style>