<!--
 * @Author: zj
 * @Date: 2023-02-28 16:41:30
 * @LastEditTime: 2023-02-28 17:05:50
 * @LastEditors: zj
 * @Description: 方案配置组件
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/components/SchemeConditions.vue
-->
<template>
    <div class="conditionscontain">     
       <div class="schemeTabContent">
         <div class="tabItem">
            <div class="tabList">
                <div                          
                v-for="(item, index) in sendConditionList"
                :key="index"              
                @click="subTypeIndex = item.itemId"> 
                    <!-- item.icon -->
                    <div class="item" :class="item.itemId === subTypeIndex ? 'tab-item-selected' : ''"  v-if="item.isDisplay == '0'">
                        <IconSvg iconClass="echometer" width="16" height="16" v-show="item.itemId == subTypeIndex" /> 
                        {{ item.name }} 
                        <i class="el-icon-error" @click.stop="delChange(item)" v-show="item.itemId !== subTypeIndex"></i>
                    </div>                  
                </div>
            </div>
            <div class="downCtain">              
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                        <i class="el-icon-s-operation el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">  
                        <el-dropdown-item :command="cont" v-for="cont in schemeConfigList" :key="cont.id" :disabled="bewList.includes(cont.classifyId) || cont.classifyName=='生活方式干预'">
                            {{ cont.classifyName }}  
                        </el-dropdown-item>                
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
         </div>
         <div class="tabContent">
            <!-- 380px -->
            <!-- 472px -->         
            <el-scrollbar :style="{height:(hiddleFlagHeight ? 'calc(100vh - 472px)' : 'calc(100vh - 380px)')}">                
                <div               
                   v-for="(item, index) in sendConditionList"
                   :key="index">
                   <div v-if="(item.itemId == subTypeIndex) && item.isDisplay=='0'">                     
                        <div class="scheme_name">{{item.name}}</div>
                        <!-- 指标检测 && (item.soConditionDtoList && item.soConditionDtoList.length)-->
                        <DiseaseAllocation 
                        :sendIndicatorList="item.soConditionDtoList" 
                        v-on="$listeners"              
                        v-if="item.soConditionDtoList.length && (item.name == '指标监测')"
                        /> 
                        <!-- 空项目 -->
                        <div class="empty" v-if="!item.soConditionDtoList.length">
                            {{ item.name == '指标监测' ? '暂无检验项目' : '暂无其它项目' }}
                        </div>                                                             
                        <!-- 添加检验检查 -->
                        <div class="addLine">
                            <div class="add" @click="addInspectionCheck(item)" v-if="item.name == '指标监测'"><i class="el-icon-plus"></i> 添加检验检查</div>
                        </div> 
                   </div>                   
                </div>
            </el-scrollbar>                    
         </div>
       </div>
    </div>
</template>
<script>
  import DiseaseAllocation from "./DiseaseAllocation.vue";
  export default {
    components: {
        DiseaseAllocation
    },
    props: {   
      sendConditionList: {
        type: Array,
        required: true
      },
      schemeConfigList:{
        type: Array,
        required: true
      },
      hiddleFlag:{
        type:Boolean
      }  
    },
    watch:{             
        sendConditionList: {
            handler (list) { 
                if(list && list.length){
                    this.bewList = [];
                    list.forEach(obj => {
                        if(obj.isDisplay == '0') this.bewList.push(obj.itemId)
                    })                   
                    if(!this.subTypeIndex) this.subTypeIndex = this.bewList[0];                      
                    // console.log(this.bewList)
                    // console.log(this.subTypeIndex)   
                }                                              
            },  
            immediate: true,          
            deep: true
        },
        hiddleFlag(val){
            console.log(val)
            this.hiddleFlagHeight = val
        }
    },
    created(){
       
    },
    mounted() {
      console.log('this.sendConditionList', this.sendConditionList)     
    },
    data() {
      return {                    
        //subTypeIndex:0,
        subTypeIndex: '', //this.sendConditionList[0].itemId||''
        activeTopTempList: this.sendConditionList,
        bewList:[],
        hiddleFlagHeight:false
      };
    },
    methods: {                   
        handleCommand(cont) {              
           this.delConditionChange('add', null, cont)
        },
        delChange(cont){                   
            this.delConditionChange( 'del', cont)
        },
        delConditionChange(type, cont, params){ 
            console.log(type, cont, params, this.$parent)
            let {schemeStageList, tabChangeIndex} = this.$parent;

            if(type=='add'){
                //let lengthFlag = schemeStageList[tabChangeIndex].sOptionDtoList.length;     
                //let seq = !lengthFlag ? 0 : schemeStageList[tabChangeIndex].sOptionDtoList[lengthFlag-1].seq+1;
                //console.log(seq)

                //区分恢复和新添加项目
                let findParam = schemeStageList[tabChangeIndex].sOptionDtoList.filter(item => item.itemId == params.classifyId);
                console.log(findParam)
                if(findParam.length){
                   let activityId = findParam[0].itemId;
                   schemeStageList[tabChangeIndex].sOptionDtoList.forEach(item => {
                     if(item.itemId == activityId) item.isDisplay = '0';
                   })
                }else{
                   let dataParam = {
                        name:params.classifyName,
                        itemId:params.classifyId,
                        isDisplay:'0',
                        //seq: seq,
                        soConditionDtoList:[]  
                    }; 
                    schemeStageList[tabChangeIndex].sOptionDtoList.push(dataParam);
                    //console.log(schemeStageList[tabChangeIndex].sOptionDtoList)                             
                    let sorDatatList = this.sortChange(schemeStageList[tabChangeIndex].sOptionDtoList);
                    //console.log(sorDatatList)
                    schemeStageList[tabChangeIndex].sOptionDtoList = sorDatatList;
                    //console.log('--------添加之后--------') 
                    //this.subTypeIndex = 0;
                    //this.subTypeIndex = seq; 
                }                         
            }else{            
                var htmlText =
                '是否确认关闭<span style="font-size:14px;font-weight:bold;color:#446ABD">' +
                    cont.name +
                '</span> 配置项? 关闭后可在右侧菜单栏内点选恢复。';           
                this.$confirm(htmlText, '', { //确认删除
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true,
                type: 'warning',
                customClass:'closeDioag'
                })
                .then(() => { 
                    //创建过的项目，在次添加可恢复，无论是否已经保存             
                    cont.isDisplay = '1';  
                    console.log(cont)                  

                    // let delResultList = schemeStageList[tabChangeIndex].sOptionDtoList.filter(item => item.itemId !== cont.itemId);                 
                    // delResultList.forEach((hat,index) => hat.seq = index);    
                    // schemeStageList[tabChangeIndex].sOptionDtoList = delResultList;  
                                                                   
                    // this.subTypeIndex = 0;
                    // let sOptionDtoList = schemeStageList[tabChangeIndex].sOptionDtoList;
                    // if(sOptionDtoList.length) this.subTypeIndex = sOptionDtoList[sOptionDtoList.length-1].seq;
                    // else this.subTypeIndex = 0;
                })
                .catch(() => {})       
            }          
            console.log('schemeStageList', schemeStageList)           
        },
        //内容配置项排序
        sortChange(dataParam){           
            let sortList = this.schemeConfigList.map(ob => { return ob.classifyId });
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
        addInspectionCheck(item){
            //console.log(item)
            this.$emit('openSubPlanDialog', 'inspectionCheck', item)         
        }
    },
    filters:{
      
    }
  };
</script>

<style lang="scss">
.closeDioag{
    .el-message-box__header{
        .el-message-box__headerbtn{ top: 5px !important; }
    }  
}
</style>
<style lang="scss" scoped>
  .conditionscontain{   
    .schemeTabContent{
        margin-top: 20px;
        .tabItem{
            display: flex; 
            justify-content: space-between;          
            .tabList{
                display: flex;               
                .item{  
                    margin-right: 10px;                                  
                    padding: 5px 25px;
                    font-size: 14px;
                    color: rgba(78, 89, 105, 1);  
                    border-radius: 100px;                    
                    cursor: pointer;                  
                    .el-icon-error{  
                        display: none;                      
                        padding:0 5px;
                        color:#D3DCEC;
                    }
                    &:hover{                  
                        background-color: rgba(247, 247, 247, 1);                                
                        border: 1px solid rgba(211, 220, 236, 1);  
                        .el-icon-error{ display: inline-block; }                    
                    }
                    &.tab-item-selected{                                                           
                        color: rgba(255, 255, 255, 1);
                        background-color: rgba(29, 197, 196, 1); 
                        box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 12);
                        border: 1px solid rgba(29, 197, 196, 1);                       
                    }                 
                }
            }
            .downCtain{
                .el-dropdown-menu{
                    width:126px;
                    border-radius: 4px;
                    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
                    .el-dropdown-menu__item{
                        font-size: 14px;
                        color: rgba(90, 94, 102, 1);
                        text-align: left;
                    }
                    .is-disabled{
                        color: #B8B9BC; 
                    }
                }
                .el-dropdown-link{   
                    display: block;          
                    width: 50px;
                    height: 35px;   
                    line-height: 35px;
                    text-align: center;               
                    border-radius: 4px 0 0 4px;
                    background-color: rgba(255, 255, 255, 1);                
                    box-shadow: -1px 0px 4px 0px #b2b4b5;
                    cursor: pointer;
                }
            }
        }
        .tabContent{     
            margin-top: 20px;
            .scheme_name{                   
                padding-left: 12px; 
                font-size: 16px;        
                color: rgba(78, 89, 105, 1);     
                border-left: 3px solid #134796;                     
            }  
            .addLine{
                margin-top: 12px;
                border-top: 1px dotted #B1CBF9;              
                height: 30px;
                .add{    
                    float: right;            
                    line-height: 30px;  
                    padding: 0 12px;    
                    font-size: 14px;
                    color: rgba(94, 133, 219, 1);                               
                    border-radius: 0px 0px 4px 4px;
                    background-color: rgba(211, 227, 255, 1);   
                    cursor: pointer;                                             
                }
            } 
            .empty{  
                margin-top: 15px;  
                padding: 15px 0;                       
                font-size: 14px;
                color: rgba(141, 148, 159, 1);
                text-align: center;   
                background-color: rgba(246, 248, 252, 1);                         
            }                  
        }   
    }
  }
</style>