<!--
 * @Author: Nic
 * @Date: 2023-02-07 14:34:44
 * @LastEditTime: 2023-03-02 17:03:45
 * @LastEditors: Nic
 * @Description: SubPlanDialog
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/components/SubPlanDialog.vue
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="subPlanDialogVisible"
    :width="state === 'inspectionCheck'?'530px':'800px'"    
    :close-on-click-modal="false"
    :show-close="false"
    :before-close="handleClose"
    class="universal-dialog"
  >
    <template #title>
      <div class="dialog-head">{{ title }}</div>
    </template>
    <div class="dialog-body">
      <el-form :model="subPlanForm" :rules="subPlanFormRules" ref="subPlanFormRef" label-width="140px" v-if="state === 'addInstallment' || state === 'copyInstallment'">
        <el-form-item label="子方案名称" prop="subPlanName">
          <el-input v-model="subPlanForm.subPlanName" placeholder="请控制在20字以内"></el-input>
        </el-form-item>
        <el-form-item label="关联疾病分期" prop="diseaseInstallment">         
          <el-checkbox-group v-model="subPlanForm.diseaseInstallment">
            <el-checkbox v-for="v in schemeOptionsList" :key="v.id" :label="v">{{ v.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="方案简述">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            v-model="subPlanForm.subPlanDesc"
            maxlength="100"
            placeholder="简述方案参考依据、方案特点、管理目标等"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容配置项" prop="contentConfig">
          <el-checkbox-group v-model="subPlanForm.contentConfig">
            <el-checkbox v-for="v in schemeConfigList" :key="v.id" :label="v" :disabled="v.classifyName=='生活方式干预'">{{ v.classifyName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="inspectionstyle" v-if="state === 'inspectionCheck'">
        <div class="searchbox"> 
          <!--  placeholder="请输入要添加的检验(检查)项目名称" -->
          <el-input           
            v-model="subInspection.productname"          
            class="input-with-select"
            @focus="focusChange" 
            @input="getContentChange">
            <el-select v-model="subInspection.source" slot="prepend" placeholder="" @change="sourceChange">                         
              <el-option label="患者自管" value="1"></el-option>
              <el-option label="来源院内" value="2"></el-option>  
              <el-option label="全部" value="3"></el-option>             
            </el-select>        
            <!-- <el-button slot="append" icon="el-icon-search" @click="getItemInfo"></el-button> -->
          </el-input>  
          <span class="searchIcon" @click="getItemInfo"><i class="el-icon-search"></i></span>             
        </div>
        <!-- searchResultList.length>2 ? 'heightstyle' : '' --> 
        <el-scrollbar class="searchResult" :class="childListFlag ? 'heightstyle' : ''" v-if="searchFlag">         
          <!-- <div v-show="searchFlag"> </div> -->
          <!-- <div class="pointTop"></div> -->
          <!--  -->
          <div @mouseleave="searchFlag = false">
            <div class="itemBox" v-if="searchResultList.length">
              <div class="itemList" v-for="item in searchResultList" :key="item.id">
                <div class="headType">   
                  <!-- v-if="item.itemType=='3'"  -->
                  <div v-if="subInspection.source == '3'" class="wibox1">
                      <span :class="['source', { greenTxt: item.itemType=='2' },{ blueTxt: item.itemType=='1' }]">
                        {{ item.itemType=='2'?'来源院内':'患者自管' }}
                      </span>
                      <span class="calourd">{{ item.classifyName }}</span>
                  </div>
                  <div v-if="subInspection.source == '2'" class="wibox2">
                    <span class="calourdone">{{ item.classifyName }}</span>
                  </div>
                </div>
                <div class="productname" v-for="cont in item.itemInfo" :key="cont.id"> 
                  <div class="nameBox" @click="usedChange(cont)">
                    <div class="nameTile" v-html="cont.itemName"></div>
                    <div class="nameDetail" @mouseenter="mouseenterTip($event, cont)" @mousemove="mousemoveTip" @mouseleave="mouseleaveTip">                                       
                      (<span v-for="(ston,index) in cont.detailList" :key="ston.id">
                        {{ ston.itemDetailName }}
                        <i v-show="index !== cont.detailList.length-1">,</i> 
                      </span>)                                        
                    </div>
                  </div>
                </div>
              </div>
            </div>       
            <div class="empty" v-else>暂无查询项目...</div>      
          </div>   
        </el-scrollbar>
        <div class="tipMsg" v-if="isShowHidden" :style="stylePosition">
          <span class="start"></span>
          {{hiddenname}}
        </div>
        <div class="recommend">
          <span class="txt1">推荐项目:</span> 
          <div class="itemBox">
            <div class="item" v-for="cont in recommendList" :key="cont.id">   
              <el-tooltip class="item" effect="dark" :content="(cont.hiddentx)" placement="bottom" popper-class="text_tooltip">        
                 <el-button size="medium" @click="usedChange(cont)" :disabled="usedList.includes(cont.id)">{{ cont.itemName }}</el-button>     
              </el-tooltip>                        
            </div>
          </div>
        </div>
        <div class="selected">
          <span class="txt2">以选择 <i class="line"></i></span>
          <div class="itemBox">
            <div class="item" v-for="item in useProductList" :key="item.id">
              <div :class="['selectedstyle', { greenTxt: item.itemType=='2' },{ blueTxt: item.itemType=='1' }]">              
                  {{ item.itemName }} 
                  <i class="el-icon-close" @click="delUseChange(item)"></i>                   
              </div>            
            </div>
          </div>
        </div>
      </div>
      <div class="relevancestyle" v-if="state === 'relevanceInstallment'">
        <div class="titleCheck">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">关联疾病分期</el-checkbox> 
        </div> 
        <div class="contentCheck">
          <el-scrollbar style="height:360px"> 
            <el-checkbox-group class="checkboxTis" v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="v in schemeOptionsList" :key="v.id" :label="v">{{v.name}}</el-checkbox>
            </el-checkbox-group>     
          </el-scrollbar>            
        </div>           
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm(state)" :disabled="state === 'inspectionCheck' && !useProductList.length">
        {{ state === 'addInstallment' || state === 'copyInstallment' ? '保存' : '确认添加' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getItemInfo } from '@/api/modules/SolutionCenter/index.js'
export default {
  name: 'RuleDialog',
  props: {
    schemeOptionsList: {
      type: Array,
      required: true    
    },
    schemeConfigList:{
      type: Array,
      required: true  
    },
    subPlanDialogVisible: {
      type: Boolean,
      required: true   
    },
    title: {
      type: String
    },
    state: {
      type: String
    },
    planData:{ 
      type: Object
    },
    checkedCitiesSave:{
      type: Array
    }  
  },
  model: {
    prop: 'subPlanDialogVisible',
    event: 'close',
  },
  data() {
    return {     
      planId: '',
      // 子方案表单
      subPlanForm: {
        // 子方案名称
        subPlanName: '',
        // 关联疾病分期
        diseaseInstallment: [],
        // 方案简述
        subPlanDesc: '',
        // 内容配置项
        contentConfig: []
      },  
      subInspection:{
        productname:'',
        source:'3' //默认全部
      },        
      subPlanFormRules: {
        subPlanName: [
          { required: true, message: '请输入子方案名称', trigger: 'change' },
          { min: 1, max: 20, message: '请控制在20字符以内', trigger: 'change' },
        ],
        diseaseInstallment: [{ type: 'array', required: true, message: '请选择关联疾病分期', trigger: 'change' }],
        contentConfig: [{ type: 'array', required: true, message: '请选择内容配置项', trigger: 'change' }]
      }, 
      searchResultList:[],
      recommendList:[],
      useProductList:[],
      usedList:[],
      searchFlag:false,
      checkAll: false,
      isIndeterminate: false,
      checkedCities: [],
      citiesList: [],
      isShowHidden:false,
      stylePosition:{
        position: 'fixed',
        zIndex: 999,       
        left:'0',
        top:'0'      
      },
      hiddenname:'',
      childListFlag:false
    }
  },
  created() {
    const { planId } = this.$route.query
    this.planId = planId;
  },
  mounted() {
    this.getItemInfo('recommend')
    //回显关联疾病标签
    let idList = this.checkedCitiesSave.map((obj) => {
      return obj.id;
    })
    console.log(idList)  
    console.log(this.schemeOptionsList)   
    this.checkedCities = this.schemeOptionsList.filter(item => idList.includes(item.id))  
    console.log(this.checkedCities)
    console.log('_____')
    this.checkAll = this.schemeOptionsList.length === this.checkedCities.length;
    this.isIndeterminate = (this.checkedCities.length > 0 && this.checkedCities.length < this.schemeOptionsList.length)
  },
  watch:{             
    useProductList(list) {    
      if(list.length){     
        let cut = list.map((obj) => {
          return obj.id
        })             
        this.usedList = cut;        
      }     
      console.log(this.usedList)         
    }
  },
  methods: { 
    mouseenterTip(e, cont){
      //console.log(e)
      let attrdata = e.target.getBoundingClientRect();
      console.log(attrdata)
      if(attrdata.width >=250){       
        this.isShowHidden = true;   
        this.stylePosition.left = (e.pageX + 52) + 'px';
        this.stylePosition.top = (e.pageY - 12) + 'px';  
        
        let title = cont.itemName;
        let nameList = cont.detailList.map(ct => { return ct.itemDetailName })
        this.hiddenname = `${title} (${nameList.join(',')})`;  
      }           
      //console.log(cont)
    },
    mousemoveTip(e){
      this.stylePosition.left = (e.pageX + 52) + 'px';
      this.stylePosition.top = (e.pageY - 12) + 'px';  
    },
    mouseleaveTip(){
      this.isShowHidden = false;   
    },
    sourceChange(){
      this.subInspection.productname = '';
      this.searchFlag = false;
    }, 
    handleCheckAllChange(val) {
      //console.log(val)             
      this.checkedCities = val ? this.schemeOptionsList : [];
      this.isIndeterminate = false;     
    },
    handleCheckedCitiesChange(list) {
      console.log(list) 
      let checkedCount = list.length;          
      this.$nextTick(() => {
        this.checkAll = (checkedCount === this.schemeOptionsList.length)?true:false;
        this.isIndeterminate = (checkedCount > 0 && checkedCount < this.schemeOptionsList.length) ? true : false;
      })     
    },  
    usedChange(cont) {
      // console.log(this.useProductList)
      // console.log(cont)    
      let useFlag = this.useProductList.filter(item => item.id === cont.id);
      if(useFlag.length) return this.$message.warning('该项目以选择，不能添加重复项目');
      cont.itemName = this.edelHtmlTag(cont.itemName)
      //console.log(cont)   
      this.useProductList.push(cont);
    },
    edelHtmlTag (str) {
      return str.replace(/<[^>]+>/g, '')
    },
    //删除以选择
    delUseChange(cont){     
      this.useProductList = this.useProductList.filter(item => item.id !== cont.id);
      console.log(this.useProductList)
    },
    focusChange(e){
      console.log(e)
      //if(this.subInspection.source=='1') this.getItemInfo()
      this.getItemInfo()
    }, 
    getContentChange(){
      setTimeout(() => {
        this.getItemInfo()
      }, 500);
    },
    async getItemInfo(str) {
      try {
        let { productname, source } = this.subInspection;
        let paramData = {};
        //str=='recommend' 查询推荐项目
        if(str=='recommend'){
          delete paramData.itemName;
          paramData.itemType = '3';
          paramData.isRecommend = '1';       
          paramData.rootDiseaseId = this.planData.tagDiseaseDeptId;
        }else{
          paramData.itemName = productname;
          paramData.itemType = source;
        }
        const res = await getItemInfo(paramData)   
        if(str=='recommend'){ //查询推荐项目          
          this.recommendList = [];  
          res.result.forEach(item => {
            item.itemInfo.forEach(cont => {
              cont.itemType = item.itemType;
              this.recommendList.push(cont)
            })
          })
          this.recommendList.forEach(item => {
            let txtList = item.detailList.map(txt => { return txt.itemDetailName })
            item.hiddentx = `${item.itemName}(${txtList.length ? txtList.join(',') : ''})`;          
          })
        }else{ //查询搜索项目列表     
          this.searchFlag = true;
          let childList = [];
          res.result.forEach(item => {           
            if(productname && item.itemInfo.length){
              this.changeColor(productname, item.itemInfo)   
            }         
            item.itemInfo.forEach(cont => {
              childList.push(cont)           
              cont.itemType = item.itemType;                         
            })
          })
          if(childList.length >7) this.childListFlag = true;
          else this.childListFlag = false;
          //console.log(childList)
          this.searchResultList = res.result; 
        }  

        console.log(`this.recommendList`, this.recommendList)      
        console.log(`this.searchResultList`, this.searchResultList)             
      } catch (error) {
        console.log(`error`, error)
      }
    },
    //模糊查询字体高亮 
    changeColor(productname, result) {       
      result.map((item, index) => {
        //console.log(item)      
        let replaceReg = new RegExp(productname, "ig");
        let replaceString = `<i style="color: #446ABD">${productname}</i>`;
        result[index].itemName = item.itemName.replace(replaceReg, replaceString);      
      });
      // console.log(result)
      // return result;
    },   
    // 返回弹窗数据
    returnData() {
      console.group('returnData')
      const map = {
        addInstallment: () => {                                 
          let {subPlanName, diseaseInstallment, subPlanDesc, contentConfig} = this.subPlanForm;
          let indicatorListList = diseaseInstallment.map((item) => ({
            name:item.name,
            id:item.id,
            planId:item.planId      
          }));          
          //console.log(`indicatorListList`, indicatorListList)
          this.$emit('getSubPlanDialogData', {              
            subPlanName:subPlanName,
            diseaseInstallment:indicatorListList,
            subPlanDesc:subPlanDesc,
            contentConfig:contentConfig,
            type: 'addInstallment'
          })
        },
        copyInstallment: () => {         
          let {subPlanName, diseaseInstallment, subPlanDesc, contentConfig} = this.subPlanForm;
          let indicatorListList = diseaseInstallment.map((item) => ({
            name:item.name,
            id:item.id,
            planId:item.planId      
          }));   
          //console.log(`indicatorListList`, indicatorListList)
          this.$emit('getSubPlanDialogData', {
            subPlanName:subPlanName,
            diseaseInstallment:indicatorListList,
            subPlanDesc:subPlanDesc,
            contentConfig:contentConfig,
            type: 'copyInstallment'
          })
        },
        //添加检验检查   
        inspectionCheck: () => {  
          // let newuseProductList = [];          
          // this.useProductList.forEach(item => {         
          //   item.itemInfo.forEach(cont => {          
          //     cont.type = item.itemType;
          //     newuseProductList.push(cont)
          //   })
          // })
          // console.log(newuseProductList) 

          this.useProductList.forEach(item => {
            item.type = item.itemType
          })
                          
          this.$emit('getSubPlanDialogData', {
            useProductList:this.useProductList,
            type: 'inspectionCheck'
          })
        },
        relevanceInstallment: () => {
          console.log(this.checkedCities)
          let dataList = this.checkedCities.map((val) => {
            return {            
              id:val.id,
              name:val.name,
              planId:val.planId
            }
          })
          console.log(dataList)
          this.$emit('getSubPlanDialogData', {
            dataList:dataList,
            type: 'relevanceInstallment'
          })
        }         
      }
      console.groupEnd()
      map[this.state]()
      //this.$emit('getSubPlanDialogData', this.subPlanForm)
    },
    // 提交
    submitForm(state) {
      if(state === 'addInstallment' || state === 'copyInstallment'){
        this.$refs['subPlanFormRef'].validate((valid) => {
          if (valid) {
            this.returnData()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }else if(state === 'inspectionCheck'){
        if(!this.useProductList.length) return this.$message.warning('请选择需要添加的检验检查项目');
        //校验添加的检验检查项目是否已经存在
        //console.log(this.$parent.schemeStageList, this.$parent.tabChangeIndex, this.$parent.addTabindex)
        
        let {schemeStageList, tabChangeIndex, addTabindex} = this.$parent;
        console.log(schemeStageList, tabChangeIndex, addTabindex)

        let itemIdList = schemeStageList[tabChangeIndex].sOptionDtoList[addTabindex].soConditionDtoList.map((item) => {
          return item.itemId;
        })
        //console.log(itemIdList)
   
        let list = this.useProductList.map((cont) => {
          return {
            itemCode:cont.itemCode,
            itemName:cont.itemName
          }
        })      
        let productCode = list;
        
        //console.log(productCode)

        let nameList = productCode.filter(item => itemIdList.includes(item.itemCode)).map((cont) => {
          return cont.itemName
        })
        if(nameList.length) return this.$message.warning(`${nameList.join(',')}项目已被添加，不允许重复添加该项目`); 

        this.returnData() 
      }else{
        this.returnData() 
      }    
    },
    handleClose() {
      this.$emit('close', false)
    }
  },
}
</script>

<style lang="scss">
.searchbox {
  .el-input__inner{
    background: #fff;
  }
  .el-input-group__prepend{
    width:125px;
    background: #fff;
    .el-input__icon{
      line-height: 25px;
    }
    .el-button--default{
      color:#919191;
    }
  }
}
.text_tooltip{
  line-height: 20px;
  max-width: 350px;  
}
</style>

<style lang="scss" scoped>
.universal-dialog {
  ::v-deep .el-dialog__footer {
    text-align: center;
    border-top: none !important;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    padding: 10px 15px;
    color: rgba(48, 49, 51, 1);
    font-size: 16px;
    padding: 10px 15px 10px 25px !important;
  }
  ::v-deep .el-dialog__footer {
    border-top: 1px solid #e9e9e9;
    // padding: 10px 15px;
  }
  ::v-deep .el-dialog__body {
    padding: 20px 20px 20px 0px;
  }

  .dialog-head {
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
    .searchbox{
      position: relative;
      .searchIcon{
        display: block;
        position: absolute;
        right: 5px;
        top:5px;
        cursor: pointer;
      }
    }  
    .inspectionstyle{
      padding: 0 25px 200px;
      position: relative;
    }
    .greenTxt,.blueTxt{
      padding:5px 0;  
      border-radius: 4px; 
      text-align: center;   
    }                            
    .greenTxt{                                         
      background-color: rgba(246, 255, 237, 1);
      color: rgba(112, 206, 70, 1);                        
    }
    .blueTxt{                          
      background-color: rgba(230, 255, 251, 1);
      color: rgba(29, 197, 196, 1);               
    }
    .heightstyle{
      height: 285px;
      overflow: hidden;
    }
    .searchResult{
      position: absolute;
      width: 350px;
      left: 150px;
      top: 38px;
      border-radius: 4px;
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
      font-size: 12px;
      background: #fff;
      //position: relative;  
      .pointTop{
        display: none;
        // position: absolute;
        // left: 14px;
        // top: -10px;
        // width: 0;
        // height: 0;
        // border-left: 10px solid transparent;
        // border-right: 10px solid transparent;
        // border-bottom: 10px solid #f2f2f2;
      } 
      .itemBox{
        padding:10px;      
        .itemList{  
          .headType{  
            div{
              display: flex;                        
            }                      
          }
          .wibox1{
            .source{
              width:18%;
              display: inline-block;
            }
            .calourd{
              display: inline-block;
              width:82%; 
              padding:5px 0 5px 2%;               
              color: rgba(153, 153, 153, 1);  
              background-color: rgba(245, 245, 245, 1);                
            }  
          }
          .wibox2{
            .calourdone{
              display: inline-block;
              width:100%; 
              padding:5px 0 5px 2%;               
              color: rgba(153, 153, 153, 1);  
              background-color: rgba(245, 245, 245, 1);                
            }  
          }
          .productname{  
            width:100%;                      
            color: rgba(90, 94, 102, 1);   
            cursor: pointer;          
            .nameBox{
              display: flex;
              padding: 5px 0 5px 2%;
              .nameTile{
                min-width: 35px;
              }
              .nameDetail{
                margin-left: 5px;
                min-width: 100px;
                max-width: 250px;
                white-space: nowrap;
                overflow: hidden;//文本超出隐藏
                text-overflow: ellipsis;//文本超出省略号替代
                span{
                  color:#B8B9BC;
                }
              }
            }                               
          }
          .productname:hover{
            background: #F3F6F9;
            color:#5A5E66;
          }
        }
      }    
    }
    .empty{
      padding: 10px 15px;
    } 
    .tipMsg{
      width:360px;
      padding:5px 15px;
      font-size: 12px;
      color:#fff;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.8);
      .start{       
        position: absolute;
        left: -16px;
        top: 10px;
        width: 0; 
        height: 0;
        border-width: 8px;
        border-style: solid;
        border-color: transparent rgba(0, 0, 0, 0.8) transparent transparent;
      }
    }
    .recommend,.selected{
      margin-top: 12px;
      display: flex;
      .txt1,.txt2{  
        display: block; 
        min-width: 75px;        
        font-size: 14px; 
        text-align: right;     
      }
      .txt1{          
        color: rgba(184, 185, 188, 1);
      }
      .txt2{
        color: rgba(16, 16, 16, 1); 
        padding-right: 10px;
        position: relative;
        .line{
           display: inline-block; width:2px; height:14px; background: #446ABD;
           position: absolute;
           top:4px;
           right:0 
        }            
      }
      .itemBox{
        display: flex;
        flex-wrap: wrap;
        margin-left: 5px;
        .item{  
          margin: 0 0 5px 5px; 
          .el-button--default{
            min-width: 85px;
            height: 22px;
            line-height: 22px;           
            font-size: 12px;
            color: #686868 !important;
            padding: 0 !important;
            border:1px solid #D9D9D9 !important;
          }
          .el-button--default:hover{
            background: #fff !important;
          }
          .is-disabled{
            background: #F5F5F5;
            color:#B8B9BC !important;
          }
          .selectedstyle{
            min-width: 85px;
            padding: 0 5px;
            font-size: 12px;
            cursor: pointer;
          }
        }       
      }       
    } 
    
    .relevancestyle{
      padding: 0 25px;
      .contentCheck{
        margin-top: 15px;
      }
    }

    .checkboxTis{
      .el-checkbox{
        display: block;
        margin-bottom: 5px;
      }
    }
    
  }
}
</style>
