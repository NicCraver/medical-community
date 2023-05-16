<!--
 * @Author: Nic
 * @Date: 2023-02-01 16:41:30
 * @LastEditTime: 2023-02-01 17:05:50
 * @LastEditors: Nic
 * @Description: 诊断条件组件
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/components/DiagnosticConditions.vue
-->
<template>
  <div class="conditionscontain" v-if="sendConditionList && sendConditionList.length"> 
    <div :class="['item_contain', { item_contain_bottom: index+1 !== sendConditionList.length }]" v-for="(item, index) in sendConditionList" :key="index">
      <div class="item_txt">
        <div :class="['andsqueLine', { andsqueLine0: (sendConditionList.length >1 && (index+1) != sendConditionList.length) && item.requisiteFlg==0 },{ andsqueLine1: (sendConditionList.length >1 && (index+1) != sendConditionList.length) && item.requisiteFlg==1 }]">        
          <div :class="item.requisiteFlg === 0 ? 'andsque' : 'andsquecolor'" 
          v-if="(item.conDetailList && item.conDetailList.length) || (sendConditionList && sendConditionList.length >1)" 
          @click="sendConditionList.length >1 ? (item.requisiteFlg === 0 ? item.requisiteFlg = 1 : item.requisiteFlg = 0) : item.requisiteFlg = 0">{{ item.requisiteFlg==0 ? '和' : '或' }}</div>    
        </div>                             
      </div>  
      <div :class="['item_wrap', {item_wrap_hover: itemWrapHover}]" @mouseenter="itemWrapHover = !itemWrapHover" @mouseleave="itemWrapHover = !itemWrapHover">    
        <div class="name">
          <div class="name_left">   
            <div class="circle-line" v-if="item.conDetailList && item.conDetailList.length">
              <i :class="['line', { line_liney: item.requisiteFlg==1 }]"></i> 
              <span :class="['circle', { circle_liney: item.requisiteFlg==1 }]"></span>
            </div>       
            <span class="title">{{ item.name }}</span> 
            <div class="anyster" v-if="item.conDetailList && item.conDetailList.length && (item.conDetailList.filter(item => item.requisiteFlg == 0)).length == 0">
              以下检验条件满足          
              <div class="downtxt">
                任一
                <el-select v-model="item.needTot" placeholder="">
                    <el-option
                    v-for="val in item.conDetailList.length"
                    :key="val"
                    :label="val"
                    :value="val">
                    </el-option>
                </el-select>
              </div>               
            </div> 
          </div> 
          <div class="delCut" @click="delProduct(item, index)">删除</div>
        </div>  
        <div class="item_component">
          <!-- 评估量表 /评估报告 -->
          <!-- 判断条件 待改 -->
          <!-- <AssessmentReportCut :sendIndicatorList="item.conditionChildList"  v-if="item.name == '评估量表'"/> -->

          <!-- 检验检查 :operatorList1="operatorOptionsList['c01984dc21a34ab7b894b4abac46c517']" -->
          <InspectionComponentCut 
            :sendIndicatorList="item.conDetailList"               
            :operatorList1="operatorOptionsList['c01984dc21a34ab7b894b4abac46c517']" 
            :fartherIndex="index"  
            @needTotChange="needTotChange"  
            v-if="item.conDetailList && item.conDetailList.length && item.name=='院内检验检查'"/>
            
          <!-- 病例信息 -->
          <CaseInformationCut 
            ref="caseInformationCutRef"
            :sendIndicatorList="item.conDetailList"            
            :operatorList2="operatorOptionsList['3cefd874eaea401db79daead8f689d5e']" 
            :fartherIndex="index" 
            :type="1" 
            @needTotChange="needTotChange"  
            @dialogListData="dialogListData"
            v-if="item.conDetailList && item.conDetailList.length && item.name=='病历信息'"/>

          <div class="noDataProduct" v-if="item.conDetailList && !item.conDetailList.length">
            <span>{{ item.name=='院内检验检查'?'暂无检验项目':'暂无病例信息' }}</span>
          </div>     

          <!-- 公用添加项目-->   
          <div class="addLine">
            <div class="add_item" @click="addProductChange(item)"><i class="el-icon-plus"></i>添加项目</div>   
          </div> 
        </div>           
      </div>
    </div>

    <ProDialog
      :visible.sync="addDialogVisible"  
      :append-to-body="true"   
      :close-on-click-modal = "false"   
      :wordResultCut = "wordResultCut"      
      width="350px"
    >
      <div class="caseInfoDialog">
        <div class="titleHeader">
          <div class="defalut-title" v-if="titleType">
            <div class="title">{{ title }}</div>
            <div class="icon" @click="searchChange" v-if="citiesList.length == 1"><i class="el-icon-search"></i></div>
          </div>
          <div class="defalut-search" v-if="citiesList.length==1 && !titleType">
            <div class="back" @click="backChange"><i class="el-icon-arrow-left"></i></div> 
            <div class="inputTxt">
              <el-input
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                clearable
                v-model="searchValue"
                @input="inputValueFind">
              </el-input>
            </div>           
          </div>         
        </div>
        <div class="tipList">
          <div v-show="titleType">当前共展示<span>{{txtList}}</span>条</div>
          <div v-show="!titleType && txtFlag">共检索到<span>{{txtList}}</span>条相关信息</div> 
          <!-- {{ titleType ? `当前共展示<span>${txtList}</span>条`: `共检索到${txtList}条相关信息` }} -->
        </div>
        <div v-if="citiesList.length">
          <div v-for="(item, index) in citiesList" :key="index">            
            <div class="titleCheck">           
              <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="handleCheckAllChange($event,item,index)" v-if="Object.keys(params).includes('parentId')">{{item.label}}</el-checkbox> 
              <span v-else>{{item.label}}</span>
            </div> 
            <div class="contentCheck">
              <el-scrollbar :class="item.children.length>15 ? 'heightstyle' : ''"> 
                <el-checkbox-group v-model="item.checkedCities" @change="handleCheckedCitiesChange($event,item,index)">
                  <el-checkbox v-for="item in item.children" :key="item.value" :label="item.value">
                    <span v-html="item.label"></span>
                    <!-- {{item.label}} -->
                  </el-checkbox>
                </el-checkbox-group>     
              </el-scrollbar>            
            </div>
          </div>  
        </div>
        <div class="nodata" v-else>
          <span>暂无数据</span>
        </div>                      
      </div>
      <template #footer>
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <!-- :disabled="citiesList.length ? false : true" -->
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </template>
    </ProDialog>     
  </div>
</template>
<script>
import ProDialog from "@/components/ProDialog/index.vue";
import InspectionComponentCut from "./InspectionComponent.vue";
import CaseInformationCut from "./CaseInformation.vue";
import AssessmentReportCut from "./AssessmentReport.vue";

export default {
  components: {
    InspectionComponentCut,
    CaseInformationCut,
    AssessmentReportCut,
    ProDialog
  },
  props: {   
    sendConditionList: {
      type: Array,
      required: true
    },
    operatorOptionsList:{
      type: Object,
      required: true
    }
  },
  watch:{   
    addDialogVisible:{
      handler(newValue){ 
        if(!newValue) this.titleType = true;      
      }
    },
  },
  created(){
     this.activeTopTempList = this.sendConditionList;
  },
  mounted() {
      
  },
  data() {
    return {
      itemWrapHover:false,
      timer:null,
      searchValue:'',
      titleType:true,
      wordResultCut:true,
      activeTopTempList: [],
      //添加关键词 
      keyTitle:'',
      title:'',
      addDialogVisible:false,    
      checkAll: false,
      checkedCities: [],
      citiesList: [],
      isIndeterminate: false,
      tabIndex:0,
      tabDesc:'',
      url:'',
      params:{},
      txtList:null,
      txtFlag:false
    };
  },
  methods: {  
    backChange(){
      this.titleType = true;  
      this.txtFlag = false;        
    }, 
    inputValueFind(){    
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {      
        let data = {
          directoryType: 'ICD10-A',
          value:this.searchValue
        }    
        this.txtFlag = true;  
        this.$refs.caseInformationCutRef[0].getIcdTypeForOrderChange(this.url, data, this.tabIndex)
      }, 500)
    },  
    searchChange(){
      this.titleType = false; 
      this.searchValue = '';
    },      
    handleCheckAllChange(val, item, index) { 
      console.log(val, item, index)
      if(val){
        item.checkedCities = item.children.map((ob) => { return ob.value })
      }else{
        item.checkedCities = [];
      }     
      item.isIndeterminate = false;    
    },
    handleCheckedCitiesChange(val, item, index) {
      console.log(val, item, index)
      // console.log(value)
      // console.log(this.checkedCities)
      let checkedCount = val.length;
      item.checkAll = checkedCount === item.children.length;
      item.isIndeterminate = checkedCount > 0 && checkedCount < item.children.length;
    },
    submitForm(){     
      console.log(this.citiesList)

      let isImpty = [];
      this.citiesList.forEach((item, index) => {
        if(!item.checkedCities.length) isImpty.push(index)
      })
      if((Object.keys(this.params).includes('parentId') && isImpty.length >1) || (Object.keys(this.params).includes('directoryType') && isImpty.length >0)) return this.$message.warning('请选择添加关键词');

      let allResult = [];
      this.citiesList.forEach(cont => {
        const result = cont.children.filter(vc => cont.checkedCities.includes(vc.value)).map((cont) => ({
          name:cont.label,
          itemId:cont.value       
        }));           
        allResult = allResult.concat(result)
      })
      console.log(allResult);
   
      if(Object.keys(this.params).includes('directoryType')){
        let yarstList = this.sendConditionList.filter(item => item.name === this.tabDesc);     
        yarstList[0].conDetailList.forEach((obj, index) => {
          if(index === this.tabIndex){ 
            // console.log(index, this.tabIndex)  
            // console.log(obj)  

            let dataList = obj.jmConDConDtoList[0].cdcDetailDtoList.concat(allResult);
            //console.log(dataList)

            let map = new Map();        
            dataList.forEach(item => {        
              item.name = this.edelHtmlTag(item.name)
              map.set(item.itemId, item);
            })
            //console.log([...map.values()])   
            let sameList = [...map.values()]                        
            console.log(sameList)
            obj.jmConDConDtoList[0].cdcDetailDtoList = sameList;                                       
          }       
        })
      }else{
        let yarstList = this.sendConditionList.filter(item => item.name === this.tabDesc);     
        yarstList[0].conDetailList.forEach((obj, index) => {
          if(index === this.tabIndex) obj.jmConDConDtoList[0].cdcDetailDtoList = allResult;       
        })
      }     
      this.addDialogVisible = false;   
      console.log(this.sendConditionList)
    },
    edelHtmlTag (str) {
      return str.replace(/<[^>]+>/g, '')
    },
    dialogListData(row){  
      console.log(row)
      this.$nextTick(() => {
        //this.keyTitle = row.keyTitle, 
        this.title = row.title;
        this.tabIndex = row.tabIndex;
        this.tabDesc = row.name;
        this.citiesList = row.keywordList;
        this.url = row.url;
        this.params = row.params;

        if(Object.keys(this.params).includes('directoryType')){
          this.txtList = this.citiesList[0].children ? this.citiesList[0].children.length : 0;         
        }       
       
        // 初始化复选框状态       
        // this.checkedCities = [];
        this.citiesList.forEach(cont => {
          let itemList = (row.stageList && row.stageList.length) ? row.stageList.map((obj) => {
              return obj.itemId;
          }) : [];
          //console.log(itemList)
          cont.checkedCities = cont.children.filter(vt => itemList.includes(vt.value)).map((vc) => {
            return vc.value;
          }); 
          //console.log(cont.checkedCities)

          if(!cont.checkedCities.length){
            cont.isIndeterminate = false;
            cont.checkAll = false;
          }else{
            if(cont.checkedCities.length == cont.children.length){
              cont.checkAll = true;
              cont.isIndeterminate = false;    
            } 
            if(cont.checkedCities.length>0 && cont.checkedCities.length < cont.children.length){
              cont.checkAll = false;
              cont.isIndeterminate = true;    
            }  
          }
        })
        
        // this.checkedCities = (row.stageList && row.stageList.length) ? row.stageList.map((obj) => {
        //     return obj.itemId;
        // }) : [];
        // if(!this.checkedCities.length){
        //   this.isIndeterminate = false;
        //   this.checkAll = false;
        // } else {
        //   if(this.checkedCities.length == this.citiesList.length){
        //     this.checkAll = true;
        //     this.isIndeterminate = false;    
        //   } 
        //   if(this.checkedCities.length>0 && this.checkedCities.length <this.citiesList.length){
        //     this.checkAll = false;
        //     this.isIndeterminate = true;    
        //   }  
        // }
        this.addDialogVisible = true;       
      })        
    },
    needTotChange(row){
      console.log(row) 
      this.sendConditionList[row.notIndex].needTot = row.notValue;     
    },
    delProduct(val, index){
      this.sendConditionList.splice(index, 1);
      this.sendConditionList.forEach((item, index) => {
        item.seq = index+1
      })
      if(this.sendConditionList.length == 1) this.sendConditionList[0].requisiteFlg = 0;
        
      this.$message.success('删除成功');            
    },
    addProductChange(item){
      //console.log(item)
      let param = {
        label:item.name,
        value:item.itemId
      }
      this.$parent.$parent.openPlanDialog(param.label, param.value, '2')
    }
  },
  filters:{
      flagCut: function(list){     
        //console.log(list) return
      }
  }
};
</script>


<style lang="scss">
.anyster .el-input__inner{
    width:80px;
    height:24px;
    line-height: 24px;
    background-color: rgba(245, 245, 245, 1) !important;
}
.anyster .el-input__icon {  
    line-height: 24px;
}
.inputTxt{
  .el-input__inner{
    border-radius: 8px;
  }
} 
.item_wrap_hover:hover .emptyCover{
  background-color: rgba(246, 248, 252, 1) !important;     
}
</style>
<style lang="scss" scoped>
.caseInfoDialog{ 
  .tipList{
    margin-bottom: 5px;
    span{
      color:#446ABD;
      font-weight: bold;
    }
  }
  .titleHeader{
    margin-bottom: 12px;
    .defalut-title{   
      position: relative;    
      .title{   
        font-size: 14px; 
        color: rgba(68, 106, 189, 1); 
        font-weight: bold;
      } 
      .icon{
        position: absolute;
        right: 0;
        top: 1px;
        cursor: pointer;
      }            
    }   
    .defalut-search{
      display: flex;
      justify-content: space-between;    
      .back{
        line-height: 32px;
        width: 5%; 
        cursor: pointer;  
      }
      .inputTxt{
        width: 92%;            
      }     
    }
  }
  .titleCheck{   
    font-size: 12px;
    color: rgba(153, 153, 153, 1);
    padding: 5px 10px;
    background-color: rgba(245, 245, 245, 1);  
  }
  .contentCheck{
    padding: 10px;
    .heightstyle{
      height: 400px;
    }
    .el-checkbox{
      display: block;
      margin-bottom: 5px;
    }
  }
  .nodata{
    span{
      padding-left: 10px;
    }
  }
}
.conditionscontain{
  .item_contain{
    display: flex;    
    .item_txt{
      display: flex;
      padding-top:10px;     
      .andsqueLine{
        width:12px;
        padding-bottom: 52px;
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
          background-color: rgba(249, 210, 210, 1);
          font-size: 14px;
          color: rgba(245, 108, 108, 1);  
          text-align: center;   
          cursor: pointer;     
        }
        .andsquecolor{       
          background-color: rgba(249, 235, 210, 1);
          color: rgba(228, 148, 59, 1);    
        }      
      }       
    }
    .item_wrap_hover:hover{
      border-radius: 4px;
      background-color: rgba(246, 248, 252, 1);      
      box-shadow: 0px 1px 4px 0px rgb(205 205 205);    
      border: 1px solid rgba(211, 220, 236, 1);
      box-sizing: border-box;
    }  
    .item_wrap_hover:hover .name .delCut{display: block;} 
    .item_wrap{    
      width:100%;
      padding:10px 0;
      margin-left: 24px;
      .name{         
        display: flex;
        justify-content: space-between;  
        .name_left{                   
          display: flex;
          font-size: 14px;       
          color: rgba(68, 106, 189, 1);       
          .circle-line{          
            .line{
              padding: 1.5px 15px;
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
          }
          .title{
            padding-left: 6px;
            font-weight: bold;
          }
          .anyster{  
            display: flex;   
            margin-left: 10px;                
            color: rgba(153, 153, 153, 1);          
            .downtxt{
              margin-left: 10px;  
              padding-left: 10px;
              color: rgba(68, 106, 189, 1);    
              background-color: rgba(245, 245, 245, 1);
              .el-select{
                margin-left: 10px;     
              }
            }
          }
        }
        .delCut{       
          display: none;       
          margin-right: 15px;
          cursor: pointer;       
        }
      }  
      .item_component{         
        padding: 10px 0;     
        margin-left: 72px;      
        .noDataProduct{     
          margin-left: 34px;   
          font-size: 14px;
          color: rgba(141, 148, 159, 1);         
          text-align: center;
          padding: 10px 0;
          background-color: rgba(246, 248, 252, 1);                
        }
        .addLine{        
          margin: 10px 0 0 34px;
          border-bottom: 1px dotted rgba(177, 203, 249, 1);     
          .add_item{   
              float: right;        
              width: 84px;
              height: 30px;
              border-radius: 0px 0px 4px 4px; 
              line-height: 30px;
              text-align: center;
              font-size: 14px;
              color: rgba(94, 133, 219, 1);                
              background-color: rgba(211, 227, 255, 1);    
              cursor: pointer;        
          }
        } 
      }     
    }
  }
}
</style>