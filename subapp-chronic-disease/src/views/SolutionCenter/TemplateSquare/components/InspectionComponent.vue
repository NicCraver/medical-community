<!--
 * @Author: Nic
 * @Date: 2023-02-03 14:05:51
 * @LastEditTime: 2023-02-03 14:05:51
 * @LastEditors: Nic
 * @Description: 检验检查组件
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/components/InspectionComponent.vue
-->
<template>
    <div class="inspectioncontain">                    
        <div :class="['item_list', { item_list_bottom: index+1 !== sendIndicatorList.length }]" 
            v-for="(item, index) in sendIndicatorList" :key="index">
            <div :class="['rangeSque', { rangeQueLine0: (sendIndicatorList.length >1 && (index+1) != sendIndicatorList.length) && item.requisiteFlg==0 },{ rangeQueLine1: (sendIndicatorList.length >1 && (index+1) != sendIndicatorList.length) && item.requisiteFlg==1 }]">
                <div class="emptyCover" v-if="index == 0"></div>
                <div :class="item.requisiteFlg === 0 ? 'sonsque' : 'sonsquecolor'" @click="sonsqueChange(item)">
                    {{ item.requisiteFlg==0 ? '和' : '或' }}
                </div>                    
            </div>                
            <div :class="['rangeHover', { rangeHoverMouse: rangeHoverChange}]"  @mouseenter="onmouseoverChange" @mouseleave="onmouseoverChange"> 
                <div class="rangeContent">                               
                    <div class="name">
                        <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start" v-if="item.name && item.name.length>4">  
                          <!-- item.name.indexOf('/') != -1 ? item.name.split('/')[item.name.split('/').length-1] : item.name -->
                          <span>{{ item.name }}</span>
                        </el-tooltip>
                        <span v-else>{{ item.name }}</span>
                    </div>
                    <div class="compent_name">
                        <div class="indicator_range" v-for="(cont, val) in item.jmConDConDtoList" :key="val">
                            <div 
                            :class="cont.requisiteFlg === 0 ? 'sunsque' : 'sunsquecolor'"
                            @click="cont.requisiteFlg === 0 ? cont.requisiteFlg = 1 : cont.requisiteFlg = 0" 
                            v-if="val > 0">
                                <i :class="cont.requisiteFlg === 0 ? 'icon_line' : 'icon_line icon_liney'"></i> 
                                <span>{{ cont.requisiteFlg==0 ? '和' : '或' }}</span>
                                <i :class="cont.requisiteFlg === 0 ? 'icon_line' : 'icon_line icon_liney'"></i>
                            </div> 
                            <div class="range_list">   
                                <div class="indicator">{{ cont.name }}</div> 
                                <div class="company">
                                    {{ cont.unitId }}
                                    <!-- <span v-for="unt in cont.unitId" :key="unt.unitId"> {{ unt.unitDesc }} </span>                      -->
                                </div>                
                                <div class="inputwrap">                                                                      
                                    <el-select v-model="cont.calibrationRange" placeholder="检验值范围" @change="calibrationChange($event, cont)" class="rangewidth">
                                        <el-option
                                        v-for="sont in calibrationList"
                                        :key="sont.value"
                                        :label="sont.label"
                                        :value="sont.value">
                                        </el-option>
                                    </el-select>                                                                                                  
                                    <div class="valueRange" :class="{ 'tagmsgred': cont.disableFlag }" v-if="cont.calibrationRange && cont.calibrationRange === '1'">                                      
                                        <el-input type="number" v-model="cont.value1" @input="validateChange($event, cont, '1')" class="mo-input--number"></el-input>     
                                        <span>~</span>                                                                                                   
                                        <el-input type="number" v-model="cont.value2" @input="validateChange($event, cont, '2')" class="mo-input--number"></el-input>                                                                           
                                    </div> 
                                    <div class="valueRange" v-if="cont.calibrationRange && cont.calibrationRange === '2'">                                      
                                        <el-select v-model="cont.operatorId" placeholder="请选择" class="operwidth">
                                            <el-option
                                            v-for="sont in bewList"
                                            :key="sont.value"
                                            :label="sont.label"
                                            :value="sont.value"
                                            :disabled="sont.disabled">
                                            </el-option>
                                        </el-select>   
                                        <el-input type="number" v-model="cont.value1" @input="validateChange($event, cont, '1')" class="mo-input--number" :class="{ 'tagsinred': cont.disableFlag }"></el-input>                                                                                                                                         
                                    </div>                                                                                        
                                </div>                               
                            </div>               
                        </div>  
                    </div>
                    <div class="del" @click="delChange(item, index)">
                        <i class="el-icon-delete"></i>
                    </div>
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
    },
    operatorList1:{
      type: Array,
      required: true
    },
    fartherIndex:{
      type: Number,
      required: true
    },
  },
  components: {
   
  },
  watch(){

  },
  created(){ 
    this.bewList = this.operatorList1.filter(item => item.value !== 'eca626f74d1c4129878e7e7842bee57c'); 
  },
  data() {
    return {
        rangeHoverChange:false,
        calibrationList: [
            {
                label:'范围值',
                value:'1'
            },
            {
                label:'单值',
                value:'2'
            }
        ],
        bewList:[]
    };
  },
  methods: {
    onmouseoverChange(){
      this.rangeHoverChange = !this.rangeHoverChange;
      if(this.rangeHoverChange) this.$parent.itemWrapHover = false;
      else this.$parent.itemWrapHover = true;   
    },
    calibrationChange(val, item){
        if(val === '1') item.operatorId = 'eca626f74d1c4129878e7e7842bee57c';
        else item.operatorId = '';          
        item.value1 = null;
        item.value2 = null;
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
    validateChange(val, cont, type){
        //decimalDigits  // 小数位数：0-整数，1-一位小数，2-两位小数
        //console.log(val)     
        setTimeout(() => {                
            if(val < 0){
                if(type=='1') cont.value1 = null;
                else cont.value2 = null;
                return this.$message.warning('请输入大于或等于0的整数或小数')
            } 
            if(val >0 || val == 0){                   
                let x = String(val).indexOf(".")== -1 ? String(val).length : String(val).indexOf(".")+1; 
                let y = String(val).length - x; 
                console.log(y, cont.decimalDigits) //y:小数点位数 , cont.decimalDigits:允许支持的小数点位数
                let txt = cont.decimalDigits==0 ? '请输入整数': (cont.decimalDigits==1 ? '输入数字只允许保留一位小数' : (cont.decimalDigits==2 ? '输入数字只允许保留两位位小数' : '')) 
                if(type == '1' && y > cont.decimalDigits){
                    cont.value1 = null;
                    return this.$message.warning(`${txt}`)
                }
                if(type == '2' && y > cont.decimalDigits){
                    cont.value2 = null;
                    return this.$message.warning(`${txt}`)
                }   
                //范围值限制有效区间      
                if(cont.calibrationRange=='1'){                 
                    if(type=='1'){
                        if(cont.value2 && (+cont.value1 > +cont.value2)) cont.value1 = cont.value2;
                    }
                    if(type=='2'){
                        if(cont.value2 && (+cont.value2 < +cont.value1)) cont.value2 = cont.value1;
                    }                            
                }
            } 
        }, 1000);               
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
.rangewidth .el-input__inner{
    width:125px;      
}
.valueRange .el-input__inner{
    width:65px;     
}
.valueRange .operwidth .el-input__inner{
    width:95px;   
}
.inputwrap .el-input__inner {  
    border:none;
    height:24px;
    line-height: 24px;
    background-color: rgba(240, 240, 240, 1) !important;  
}
.inputwrap .el-input__inner::placeholder {
    color: red;
}
.inputwrap .el-input__icon {  
    line-height: 24px;
}
//冲突范围值标示红框
.tagmsgred,.tagsinred{
    border:1px solid red;
    box-sizing: border-box;
}  
</style>
<style lang="scss" scoped>
.inspectioncontain{
    .item_list{
        display: flex;               
        padding-bottom: 4px;
        .rangeSque{ 
            position: relative;                 
            width: 12px;
            padding: 12px 0 36px;               
            &.rangeQueLine0{
                border-right: 3px dotted rgb(245, 108, 108); 
            }  
            &.rangeQueLine1{
                border-right: 3px dotted rgba(228, 148, 59, 1);
            }                
            .emptyCover{
                position: absolute;
                left:0;
                top:0;
                width: 24px;
                height: 20px;
                background: #fff;
            }        
            .sonsque,.sonsquecolor{        
                width: 24px;
                height: 24px;
                line-height: 24px;    
                margin-top:8px;
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
        .rangeHoverMouse:hover{
            border-radius: 4px;
            background-color: rgba(246, 248, 252, 1);
            box-shadow: 0px 1px 4px 0px rgb(205 205 205);
            border: 1px solid rgba(211, 220, 236, 1);
            box-sizing: border-box;
        }       
        .rangeHover{  
            width:100%;                   
            padding-top:12px;
            margin-left:24px;                                 
            .rangeContent{               
                width: 100%;  
                display: flex;                              
                .name{ 
                    width: 8%;               
                    line-height: 40px;  
                    text-align: left;                                        
                    span{
                        margin: 8px 0 0 5px;
                        width: 60px;                        
                        white-space: nowrap;
                        overflow: hidden;//文本超出隐藏
                        text-overflow: ellipsis;//文本超出省略号替代 
                        display: inline-block;
                        height:24px;
                        line-height: 24px;
                        font-size: 14px;
                        color: rgba(78, 89, 105, 1);                                                         
                    }                
                }
                .compent_name{      
                    display: flex;  
                    flex-wrap: wrap; 
                    width: 87%;                
                    .indicator_range{ 
                        display: flex;                                                               
                        .sunsque,.sunsquecolor{
                            padding:0 10px;                          
                            .icon_line{
                                padding: 1.5px 8.5px;
                                border-top: 3px dotted rgb(245, 108, 108);
                                display: inline-block;     
                            }  
                            .icon_liney{
                                border-top:3px dotted rgba(228, 148, 59, 1);
                            }                                        
                            span{ 
                                display: inline-block; 
                                margin-top:8px;                
                                width: 24px;
                                height: 24px;
                                line-height: 24px;                    
                                border-radius: 4px;
                                background-color: rgba(249, 210, 210, 1);
                                color: rgba(245, 108, 108, 1);                                    
                                font-size: 14px;                
                                text-align: center;  
                                cursor: pointer;               
                            }
                        }
                        .sunsquecolor{
                            span{
                                background-color: rgba(249, 235, 210, 1);  
                                color: rgba(228, 148, 59, 1); 
                            }               
                        }
                        .range_list{  
                            display: flex;   
                            padding:8px 5px;                    
                            border-radius: 3px;                      
                            border: 1px solid rgba(211, 220, 236, 1);
                            box-sizing: border-box;    
                            line-height: 24px;   
                            margin-bottom: 10px;                                                
                            .indicator{
                                font-size: 14px;
                                color: rgba(94, 133, 219, 1);     
                                padding:0 8px;  
                                height: 24px;
                                line-height: 24px;           
                            }
                            .company{                                  
                                font-size: 14px;
                                color: rgba(136, 136, 136, 1);  
                                background-color: rgba(240, 240, 240, 1);  
                                padding:0 8px;    
                                height: 24px;
                                line-height: 24px;                              
                            }
                            .inputwrap{                
                                margin-left: 8px; 
                                display: flex;    
                                .valueRange{
                                    display: flex;
                                    margin-left: 5px;  
                                    // border: 1px solid rgba(211, 220, 236, 1);
                                    // box-sizing: border-box;
                                    background-color: rgba(240, 240, 240, 1);   
                                    span{
                                        padding: 0 5px;
                                    }
                                }                              
                            }                             
                        }
                    } 
                }
                .del{
                    width: 5%;   
                    line-height: 44px;                  
                    i{
                        padding-left: 12px;
                        cursor: pointer;
                    }                          
                }  
            }                   
        }               
    }    
}
</style>