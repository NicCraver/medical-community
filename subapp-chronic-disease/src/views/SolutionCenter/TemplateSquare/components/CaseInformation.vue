<!--
 * @Author: Nic
 * @Date: 2023-02-06 09:05:51
 * @LastEditTime: 2023-02-06 09:05:51
 * @LastEditors: Nic
 * @Description: 病例信息组件
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/components/CaseInformation.vue
-->
<template>
    <div class="caseinformation">  
        <div class="table_header" :class="{ 'table_header_bottom': type==2 }">
            <div class="head_name"><span>字段名称</span></div>
            <div class="head_condition"><span>筛选条件</span></div>
            <div class="head_operation" v-if="type==1"><span >操作</span></div>
        </div>    
        <!--  { table_list_bottom: index+1 !== sendIndicatorList.length } -->
        <div :class="['table_list']" v-for="(item, index) in sendIndicatorList" :key="index">
            <div :class="['sonsqueLine', { sonsqueLine0: (sendIndicatorList.length >1 && (index+1) != sendIndicatorList.length) && item.requisiteFlg==0 },{ sonsqueLine1: (sendIndicatorList.length >1 && (index+1) != sendIndicatorList.length) && item.requisiteFlg==1 }]">
                <div class="emptyCover" v-if="index == 0"></div>
                <div 
                :class="item.requisiteFlg === 0 ? 'sonsque' : 'sonsquecolor'"
                @click="sonsqueChange(item)" >
                {{ item.requisiteFlg === 0 ? '和' : '或' }}
                </div> 
            </div>
            <div :class="['table_content', { table_content_hover: (type==1&&rangeHoverChange)}, {table_content_padding: type==2}]"  @mouseenter="onmouseoverChange" @mouseleave="onmouseoverChange">
                <div class="name">
                    <div>
                        <!-- <IconSvg iconClass="copy" width="24" height="24" v-show="rangeHoverChange"></IconSvg> -->
                        {{item.name}}
                    </div>
                </div>
                <div class="condition">
                    <div class="tagTxt">                    
                        <div class="txt">值</div>                     
                        <div class="range_uint" v-if="type==1">
                            <el-select v-model="item.jmConDConDtoList[0].operatorId" placeholder="请选择" class="inputwrap">
                                <el-option
                                v-for="sont in operatorList2"
                                :key="sont.value"
                                :label="sont.label"
                                :value="sont.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="range-txt" v-else>{{ item.jmConDConDtoList[0].operatorId | filterTxt(that) }}</div>  
                    </div>                
                    <div class="tagList">
                        <!-- 带解析 -->
                        <div class="list" :class="{ 'list-padding': type==2 }" v-for="cont in item.jmConDConDtoList[0].cdcDetailDtoList" :key="cont.itemId">
                           {{ cont.name }}
                           <i class="el-icon-close" v-if="type==1" @click="delIcdChange(cont, item)"></i>
                        </div>
                        <div class="addTag" @click="addDtoChange(item, index)" v-if="type==1"><i class="el-icon-plus"></i></div>
                        <div class="clearTag" @click="clearDtoChange(item)" v-if="type==1 && item.jmConDConDtoList[0].cdcDetailDtoList.length">                         
                            <el-tooltip class="item" effect="dark" content="清空" placement="bottom">
                                <i class="el-icon-refresh-right"></i>
                            </el-tooltip>
                        </div>
                    </div>                
                </div>
                <div class="operation" v-if="type==1"><i @click="delChange(item, index)" class="el-icon-delete"></i></div>
            </div>        
        </div>         
    </div>
</template>

<script>
import { getIcdTypeForOrderBy, postOtherTypeForOrderBy } from '@/api/modules/SolutionCenter/index.js'
export default {
  props: {   
    sendIndicatorList: {
      type: Array,
      required: true
    },
    operatorList2:{
      type: Array,
      required: true
    },
    fartherIndex:{
      type: Number    
    },
    type:{
      type: Number
    }
  },
  components: {
   
  },
  created(){
    //console.log(this.operatorList2)
    //console.log(this.fartherIndex)
  },
  data() {
    return {
        rangeHoverChange:false,
        selectIds:[],
        that:this
    };
  },
  methods: {
    delIcdChange(cont, item){
        // console.log(cont)
        // console.log(item)
        let delList = item.jmConDConDtoList[0].cdcDetailDtoList.filter(item => item.itemId != cont.itemId);
        item.jmConDConDtoList[0].cdcDetailDtoList = delList;
    },
    onmouseoverChange(){
      this.rangeHoverChange = !this.rangeHoverChange;
      if(this.rangeHoverChange) this.$parent.itemWrapHover = false;
      else this.$parent.itemWrapHover = true;   
    },
    sonsqueChange(item){     
        if(this.sendIndicatorList.length >1) item.requisiteFlg === 0 ? item.requisiteFlg = 1 : item.requisiteFlg = 0;  
        else item.requisiteFlg = 0;
       
        let hiddenFlag = this.sendIndicatorList.filter(cont => cont.requisiteFlg === 0);
        if(!hiddenFlag.length) {
            this.$emit('needTotChange', {        
                notIndex: this.fartherIndex,
                notValue:1
            })
        }else{
            this.$emit('needTotChange', {        
                notIndex: this.fartherIndex,
                notValue:0
            })
        }
    },   
    clearDtoChange(item){
        item.jmConDConDtoList[0].cdcDetailDtoList = [];
    },
    //添加关键词
    addDtoChange(item, index){
        // console.log(this.sendIndicatorList)
        console.log(item, index) 

        let stageListCheck = item.jmConDConDtoList[0].cdcDetailDtoList.length ? item.jmConDConDtoList[0].cdcDetailDtoList : [];

        let params = typeof(item.jmConDConDtoList[0].param) == 'string' ? JSON.parse(item.jmConDConDtoList[0].param) : item.jmConDConDtoList[0].param; 
     
        if(params.hasOwnProperty('directoryType')){
            this.selectIds = stageListCheck.map(cot => { return cot.itemId }); 
            if(this.selectIds.length) params.selectIds = this.selectIds;
        }     

        let url = item.jmConDConDtoList[0].interfaceUrl; 
        console.log(params, url)  

        if(params && url){        
            this.getIcdTypeForOrderChange( url, params, index, stageListCheck )  
        }else{         
            //针对之前保存的病例信息
            this.$emit('dialogListData', {
                title:'添加关键词',
                tabIndex: index,
                name:'病历信息',
                keywordList: [], //关键词列表    
                url:url,
                params:params,
                stageList:stageListCheck     
            })   
        }              
    },
    //模糊查询字体高亮 
    changeColor(productname, result) {           
      result.map(item => {    
        let replaceReg = new RegExp(productname, "ig");
        let replaceString = `<i style="color: #446ABD">${productname}</i>`;
        item.label = item.label.replace(replaceReg, replaceString);      
      });     
      //return result;
    }, 
    //查询疾病分期tab列表
     async getIcdTypeForOrderChange( url, params, index, stageListCheck ){    
      try {         
        let keyList = Object.keys(params);
        console.log(keyList)  
        // console.log(params)     
        const res = keyList.includes('directoryType') ? await getIcdTypeForOrderBy( url, params ) : await postOtherTypeForOrderBy( url, params )
        if(res.code==0){
            let sameList = [];
            if(keyList.includes('directoryType')){
                let optionsDTOs = res.result.optionsDTOs;
                if(keyList.includes('value')){
                    this.changeColor(params.value, optionsDTOs)
                }
                let param = {
                    label:res.result.label,
                    isIndeterminate:false,
                    checkAll:false, 
                    checkedCities:[],
                    children:optionsDTOs
                }
                sameList.push(param)
            }else{
                let dataParam = res.result.map((item) => ({
                    isIndeterminate:false,
                    checkAll:false,
                    checkedCities:[],
                    label:item.label,
                    children:item.children
                }));               
                sameList = dataParam;
            }                  
            this.$emit('dialogListData', {
                title:'添加关键词',
                tabIndex: index,               
                name:'病历信息',             
                keywordList:sameList,
                url:url,
                params:params,
                stageList:stageListCheck           
            })                     
        }               
      } catch (error) {
        console.log(`error`, error)
      }
    },  
    delChange(item, index){    
        this.sendIndicatorList.splice(index, 1);
        if(this.sendIndicatorList.length){
            let hiddenFlag = this.sendIndicatorList.filter(cont => cont.requisiteFlg === 0);
            if(!hiddenFlag.length) {
                if(this.sendIndicatorList.length == 1){
                    this.sendIndicatorList[0].requisiteFlg = 0;
                    this.$emit('needTotChange', {        
                        notIndex: this.fartherIndex,
                        notValue:0
                    })
                }else{
                    this.$emit('needTotChange', {        
                        notIndex: this.fartherIndex,
                        notValue: this.sendIndicatorList.length
                    }) 
                }  
            }
        }
        this.$message.success('删除成功');
    },
  },
  filters:{
    filterTxt: function(val, that){  
        let data = that.operatorList2.filter(item => item.value == val)         
        return data.length?data[0].label:'';      
    }
  }  
};
</script>

<style lang="scss">
.range_uint .el-input__inner{
    height:24px;
    line-height: 24px;
    background-color: #f5f5f5 !important;
}
.range_uint .el-input__icon {  
    line-height: 24px;
}
.inputwrap .el-input__inner::placeholder {
    color: red;
}
</style>
<style lang="scss" scoped>
.caseinformation{
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
            &.head_name{
                width:18%;              
            }
            &.head_condition{
                width:76%;            
            } 
            &.head_operation{
                width:6%;                 
            }     
        }   
    }
    .table_header_bottom{
        margin-bottom: 0;  
    }
    .table_list{
        display: flex;            
        .sonsqueLine{
            position: relative;
            width: 12px;  
            margin-bottom: 4px;  
            .emptyCover{
                position: absolute;
                left:0;
                top:0;
                width: 24px;
                height: 10px;   
                background: #fff;        
            }   
            &.sonsqueLine0{               
                border-right: 3px dotted rgb(245, 108, 108); 
            }  
            &.sonsqueLine1{
                border-right: 3px dotted rgba(228, 148, 59, 1);
            }        
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
        .table_content_hover:hover{
            border-radius: 4px;
            background-color: rgba(246, 248, 252, 1);
            box-shadow: 0px 1px 4px 0px rgb(205 205 205);
            border: 1px solid rgba(211, 220, 236, 1);
            box-sizing: border-box;
        }
        .table_content{           
            width:100%;
            margin: 0 0 10px 22px;
            border: 1px solid #D3DCEC; 
            box-sizing: border-box;      
            display: flex;   
            padding:10px 0;            
            .name{
                width:20%;           
                div{
                    height: 24px;
                    line-height: 24px;
                    font-size: 14px;
                    color: rgba(78, 89, 105, 1); 
                    padding-left:12px;               
                    border-right: 1px solid rgba(211, 220, 236, 1);
                    box-sizing: border-box;
                    .svg-icon{
                        vertical-align: -8px;
                    }                  
                }                                                        
            }
            .condition{
                width:74%;
                padding-right: 12px;
                display: flex;
                position: relative;
                .tagTxt{
                    display: flex;
                    .txt{
                        height: 24px;
                        line-height: 24px;
                        font-size: 14px;
                        color: rgba(78, 89, 105, 1); 
                        padding-left:12px;               
                    }
                    .range_uint{
                        margin-left: 10px;
                        width:90px;                            
                    }
                    .range-txt{
                        margin-left: 5px;
                        width:45px;  
                    }
                }
                
                .tagList{
                    display: flex;
                    flex-wrap: wrap;
                    .list{  
                        font-size: 14px;
                        color: rgba(87, 153, 228, 1);                          
                        border-radius: 4px;
                        height: 24px;
                        line-height: 24px;
                        padding: 0 25px;                 
                        margin: 0 0 5px 10px;
                        background-color: rgba(205, 223, 245, 1);   
                        position: relative;
                        i{
                            position: absolute;
                            right: 5px;
                            top: 6px;
                            font-size: 12px;
                            color: rgb(87, 153, 228);;       
                            font-weight: bold;                   
                            cursor: pointer;
                            display: none;
                            
                        }                                                          
                    }
                    .list-padding{
                        padding: 0 10px;     
                    }
                    .list:hover{
                        i{
                            display: block;
                        }
                    }
                    .addTag{
                        width: 24px;
                        height: 24px;
                        line-height: 24px;
                        border-radius: 4px;                   
                        font-size: 14px;
                        color: rgba(87, 153, 228, 1);                
                        text-align: center;    
                        margin-left: 10px;  
                        background-color: rgba(205, 223, 245, 1); 
                        cursor: pointer;  
                    }
                    .clearTag{
                        position: absolute;
                        right: 0;
                        top: 1px;                                                                                      
                        cursor: pointer;  
                    }
                }
            }
            .operation{
                width:6%;                       
                i{
                    padding-left: 12px;
                    cursor: pointer;
                }             
            }
        }
        .table_content_padding{
            margin-bottom: 0;
            border-top: none; 
        }
    }    
}
</style>