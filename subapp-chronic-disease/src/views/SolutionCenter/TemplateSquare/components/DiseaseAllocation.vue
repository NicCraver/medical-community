<!--
 * @Author: zj
 * @Date: 2023-03-01 09:05:51
 * @LastEditTime: 2023-03-01 09:05:51
 * @LastEditors: zj
 * @Description: 指标检测
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/components/IndicatorDetectionBpBs.vue
-->
<template>
    <div class="indicatorDetectionps">  
        <div class="diseaseContainList" v-for="(item, index) in sendIndicatorList" :key="index">
            <div class="diseaseTitle">
                <span>{{ item.seq + 1 }}</span>
                {{ item.name }}
            </div>  
            <div class="diseaseContent">
               <div class="tipDel">
                  <div class="msg">
                    <!--
                    任务/复诊计划
                    <span>以每日疾病管理任务的形式在患者端展示/可提醒患者按时就医</span>  
                    -->                 
                    {{item.type =='1'?'患者自管':'来源院内'}}
                    <span>{{item.type =='1'?'以每日疾病管理任务的形式在患者端展示':'可提醒患者按时就医'}}</span>                                                    
                  </div>
                  <div class="del" @click="delProductChange(item)">删除</div>
                </div>
                <!-- 血压/血糖 taskDtoType -->           
                <CommonTagDiseases
                    :sendTagDiseases="item.conditionTaskDtoList"  
                    :senTaskDtoType="item.type" 
                    v-if="Object.keys(item.conditionTaskDtoList).length"                                                                                         
                /> 
                <!--
                <div class="estimateFlag">
                    <el-switch
                        v-model="item.estimate"
                        active-color="#ADBCF9 "
                        inactive-color="#E0E3E5">
                    </el-switch>
                    <div class="warinTxt">
                        {{ (item.diseaseType == 'jbp'||item.diseaseType == 'jbs')?'达标评估':'预警设置'}} 
                         <span>{{ (item.diseaseType == 'jbp'||item.diseaseType == 'jbs')?'非必选项。设置达标评估后，患者端将展示达标评估结果，并接受动态推送。':'请设置要预警的指标范围和条件'}}</span>   
                    </div>                               
                </div>  
                -->
                <!-- 达标评估配置 -->
                <!--
                <ComplianceAssessment
                    :sendEstimateDiseases="item.conditionTaskDtoList"                                                                                                          
                />                  
                -->
            </div>          
        </div>              
    </div>
</template>

<script>
import CommonTagDiseases from './CommonTagDiseases.vue'

export default {
  props: {   
    sendIndicatorList: {
      type: Array,
      required: true
    }  
  },
  components: {
    CommonTagDiseases
  },
  created(){
    
  },
  mounted() {   
    
  },
  data() {
    return {
       
    };
  },
  methods: {  
    delProductChange(data){
      // console.log(data)
      // console.log(this.sendIndicatorList) 
           
      let delList = this.sendIndicatorList.filter(item => item.itemId !== data.itemId)
      console.log(delList)
      this.$emit("current-layer", delList);
     
      //this.sendIndicatorList = delList;         
    }
  }
};
</script>

<style lang="scss" scoped>
.indicatorDetectionps{       
    .diseaseContainList{
        margin-top:20px; 
        .diseaseTitle{
            font-size: 14px;        
            color: rgba(100, 100, 100, 1);            
            span{
                margin-right: 5px;
                display: inline-block;           
                width: 20px;
                height: 20px;
                line-height: 20px;
                border-radius: 100%;
                background-color: rgba(29, 197, 196, 1);
                font-size: 14px;
                color: rgba(255, 255, 255, 1); 
                text-align: center;                      
            }
        }
        .diseaseContent{
            margin-top:10px;
            padding: 10px 20px;
            &:hover{             
                box-shadow: 0px 1px 4px 0px rgb(206 205 205);
            }
            .tipDel{
                display: flex;
                justify-content: space-between;
                .msg{
                    font-size: 14px;
                    color: #646464;   
                    font-weight: bold;            
                    span{
                        font-size: 12px;
                        color: rgba(245, 108, 108, 1); 
                        font-weight: normal;                                
                    }  
                }
                .msg::before{
                    content: '*';                 
                    font-size: 12px;
                    color: #F56C6C;                  
                }  
                .del{                   
                    font-size: 14px;
                    color: rgba(94, 133, 219, 1);
                    cursor: pointer;
                }
                           
            }    
            // .estimateFlag{
            //     margin-top: 15px;   
            //     display: flex;            
            //     .warinTxt{
            //         margin-left: 10px;
            //         line-height: 20px;   
            //         font-size: 14px;
            //         color: rgba(78, 89, 105, 1);           
            //         span{
            //             font-size: 12px;
            //             color: rgba(245, 108, 108, 1);                              
            //         }  
            //     }                                     
            // }                     
        }       
    }   
}
</style>