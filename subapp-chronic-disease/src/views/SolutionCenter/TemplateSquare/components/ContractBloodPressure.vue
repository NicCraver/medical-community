<template>
     <div class="rangeContainList padContent">
        <div class="indicator_range" v-for="(item, index) in senJmConDConDtoList" :key="index">     
            <div 
            :class="+item.requisiteFlg === 0 ? 'sunsque' : 'sunsquecolor'"
            @click="+item.requisiteFlg === 0 ? item.requisiteFlg = 1 : item.requisiteFlg = 0" 
            v-if="index > 0">
                <i :class="+item.requisiteFlg === 0 ? 'icon_line' : 'icon_line icon_liney'"></i> 
                <span>{{ +item.requisiteFlg===0 ? '和' : '或' }}</span>
                <i :class="+item.requisiteFlg === 0 ? 'icon_line' : 'icon_line icon_liney'"></i>
            </div> 
            <div :class="typeDefault=='1'?'setInputRange':'setInputRangeType'">
                <div class="indicator">{{ item.name }}</div>
                <div class="company">
                    {{ item.unitId }}                         
                </div>                
                <div class="inputcontain">                                                                      
                    <el-select v-model="item.calibrationRange" placeholder="检验值范围" @change="calibrationChange($event, item)" class="rangewidth inputwidth">
                        <el-option
                        v-for="cont in calibrationList"
                        :key="cont.value"
                        :label="cont.label"
                        :value="cont.value">
                        </el-option>
                    </el-select>                                                                                                    
                    <div class="valueRange" v-if="item.calibrationRange && item.calibrationRange === '1'">
                        <el-input type="number" v-model="item.value1" @input="validateChange($event, item, '1')" class="mo-input--number rangewidth inputwidth"></el-input>     
                        <span>~</span>                                                                                                   
                        <el-input type="number" v-model="item.value2" @input="validateChange($event, item, '2')" class="mo-input--number rangewidth inputwidth"></el-input> 
                    </div> 
                    <div class="valueRange" v-if="item.calibrationRange && item.calibrationRange === '2'">   
                        <el-select v-model="item.operatorId" placeholder="" class="rangewidth inputwidth">
                            <el-option
                            v-for="cont in bewList"
                            :key="cont.value"
                            :label="cont.label"
                            :value="cont.value"
                            :disabled="cont.disabled">
                            </el-option>
                        </el-select>   
                        <el-input type="number" v-model="item.value1" @input="validateChange($event, item, '1')" class="mo-input--number rangewidth inputwidth"></el-input>                                                                                                                                         
                    </div>                                                                                        
                </div>  
            </div>
        </div>
    </div>
</template>

<script>
export default {
  //inject: ['sendOperatorOptions'],
  props: {   
    senJmConDConDtoList: {
      type: Array,
      required: true
    },
    typeDefault:{
      type: String 
    }  
  },
  components: {
    
  },
  created(){
    
  },
  mounted() {
    console.log(`舒张压 收缩压 组件`, this.senJmConDConDtoList)
    //console.log(`重重孙子组件拿到的运算符`, this.sendOperatorOptions())

    // let operatorList1 = this.sendOperatorOptions(); 
    // if(operatorList1 && operatorList1.length){
    //     this.bewList = operatorList1['c01984dc21a34ab7b894b4abac46c517'].filter(item => item.value !== 'eca626f74d1c4129878e7e7842bee57c'); 
    // } 
    let comonList = JSON.parse(window.localStorage.getItem('comonList')) 
    this.bewList = comonList['c01984dc21a34ab7b894b4abac46c517'].filter(item => item.value !== 'eca626f74d1c4129878e7e7842bee57c'); 
  },
  data() {
    return {
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
    calibrationChange(val, item){
        if(val === '1') item.operatorId = 'eca626f74d1c4129878e7e7842bee57c';
        else item.operatorId = '';          
        item.value1 = null;
        item.value2 = null;
    },
    validateChange(val, cont, type){
        console.log(val, cont, type)
        let standardRang = JSON.parse(cont.standardRang);
        console.log(standardRang)
        //decimalDigits  // 小数位数：0-整数，1-一位小数，2-两位小数
        //console.log(val)
        if(val < 0){
            if(type=='1') cont.value1 = null;
            else cont.value2 = null;
            return this.$message.warning('请输入大于或等于0的整数或小数')
        } 
        if(val >0 || val == 0){           
            let x = String(val).indexOf(".")== -1 ? String(val).length : String(val).indexOf(".")+1; 
            let y = String(val).length - x; 
            console.log(y, standardRang.decimalDigits) //小数点位数
            let txt =  standardRang.decimalDigits==0 ? '请输入整数': (standardRang.decimalDigits==1 ? '输入数字只允许保留一位小数' : (standardRang.decimalDigits==2 ? '输入数字只允许保留两位位小数' : '')) 
            if(type == '1' && y > standardRang.decimalDigits){
                cont.value1 = null;
                return this.$message.warning(`${txt}`)
            }
            if(type == '2' && y > standardRang.decimalDigits){
                cont.value2 = null;
                return this.$message.warning(`${txt}`)
            }                        
        }                
    },
  }
};
</script>

<style lang="scss" scoped>
  .padContent{
    padding: 0 10px;         
  }
  .rangeContainList{
        display: flex;
        flex-wrap: wrap;
        .indicator_range{  
            display: flex;          
            .sunsque,.sunsquecolor{
                margin-top: 8px;
                padding:0 10px;                          
                .icon_line{
                    padding: 2px 10px;
                    border-top: 3px dotted rgb(245, 108, 108);
                    display: inline-block;     
                }  
                .icon_liney{
                    border-top:3px dotted rgba(228, 148, 59, 1);
                }                                        
                span{ 
                    display: inline-block;                              
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
            .setInputRangeType{
                display: flex;                              
                padding: 10px 15px 10px 7px;
                margin-bottom: 10px;    
                border-radius: 4px;        
                border: 1px solid rgb(187, 187, 187);
                box-sizing: border-box;                                              
                background-color: rgb(251, 251, 251); 
            }
            .setInputRange{
                display: flex;                 
                //padding: 10px 15px;
                padding: 10px 15px 10px 7px;
                margin-bottom: 10px;                                                      
                border-radius: 4px;
                background-color: rgba(246, 248, 252, 1);        
            }
            .indicator{
                font-size: 14px;
                color: rgba(94, 133, 219, 1);     
                padding:0 8px;                   
                line-height: 25px;             
            }
            .company{                                  
                font-size: 14px;
                color: rgba(136, 136, 136, 1);  
                background-color: rgba(240, 240, 240, 1);  
                padding:0 8px;                   
                line-height: 25px;                              
            }
            .inputcontain{                                 
                margin-left: 8px; 
                display: flex;    
                .valueRange{
                    display: flex;
                    margin-left: 5px;                       
                    background-color: rgba(240, 240, 240, 1);   
                    span{
                        padding: 0 5px;
                    }
                }                              
            }  
        }     
   }  
</style>