<template>
    <div class="rangeContainList">
       <div class="indicator_range" v-for="(item, index) in senJmConDConDtoList" :key="index">     
           <div 
           :class="+item.requisiteFlg === 0 ? 'sunsque' : 'sunsquecolor'"
           @click="+item.requisiteFlg === 0 ? item.requisiteFlg = 1 : item.requisiteFlg = 0" 
           v-if="index > 0">
               <i :class="+item.requisiteFlg === 0 ? 'icon_line' : 'icon_line icon_liney'"></i> 
               <span>{{ +item.requisiteFlg===0 ? '和' : '或' }}</span>
               <i :class="+item.requisiteFlg === 0 ? 'icon_line' : 'icon_line icon_liney'"></i>
           </div> 
           <div class="setInputRangeBorder">
               <div class="indicator">
                  {{ item.name }} 
                  <span v-if="item.operatorId=='eca626f74d1c4129878e7e7842bee57c'">
                    {{ item.value1 }} ~ {{ item.value1 }} {{ item.unitId}}
                  </span>
                  <span v-else>
                    {{ item.operatorId | filterTxt(that) }} {{ item.value1 }} {{ item.unitId}}
                  </span>
                </div>                            
           </div>
       </div>
   </div>
</template>

<script>
export default {
 props: {   
   senJmConDConDtoList: {
     type: Array,
     required: true
   },
   operatorList1:{
     type: Array,
     required: true
   }   
 },
 components: {
   
 },
 created(){
   
 },
 mounted() {
   //console.log(`舒张压 收缩压 组件`, this.senJmConDConDtoList)  
 },
 data() {
   return {
     that:this
   };
 },
 methods: {
   
 },
 filters:{
    filterTxt: function(val, that){  
        let data = that.operatorList1.filter(item => item.value == val)         
        return data.length?data[0].label:'';      
    }
 } 
};
</script>

<style lang="scss" scoped>
  .el-scrollbar__wrap{
     margin-right: 0;   
  }
 .rangeContainList{
       display: flex;
       flex-wrap: wrap;
       .indicator_range{  
           display: flex;  
           margin-bottom: 10px;        
           .sunsque,.sunsquecolor{  
               margin-top: 4px;        
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
               }
           }
           .sunsquecolor{
               span{
                   background-color: rgba(249, 235, 210, 1);  
                   color: rgba(228, 148, 59, 1); 
               }               
           }                   
       }
       .setInputRangeBorder{          
            padding: 0 5px;
            height: 32px;
            line-height: 32px;
            border-radius: 3px;                             
            background-color: rgba(255, 255, 255, 1);          
            border: 1px solid rgba(211, 220, 236, 1);
            box-sizing: border-box;
            .indicator{
                color: rgba(87, 153, 228, 1);
                font-size: 14px;
                font-family: Roboto;
                span{ 
                    padding-left: 5px;
                    font-family: SourceHanSansSC-regular;                  
                    color: rgba(78, 89, 105, 1);
                }
            }   
       }     
  }  
</style>