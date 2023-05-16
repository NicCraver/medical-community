<!--
 * @Author: Zjj
 * @Date: 2023-04-04 18:00:00
 * @LastEditTime: 2023-04-04 18:00:00
 * @LastEditors: Zjj
 * @Description: 方案预览
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/Plan/SchemePreview.vue
-->
<template>
    <div class="previewcontain">
        <div class="service">
            <div class="timetxt">
                服务开始 <span>2023-03-21</span> 后
            </div>             
        </div>  
        <div class="pointline">
            <i class="el-icon-arrow-right"></i>
        </div>       
        <div class="productconent">
            <div class="headlist">
                <div class="label">内容筛选：</div>
                <div class="content">                    
                    <div class="all" :class="tabChangeIndex==0 ? 'active' : ''" @click="dressingAllChange">全部</div>
                    <div class="line"></div>
                    <div class="itemlist">                        
                        <div                    
                        v-for="item in sOptionDtoList" 
                        :key="item.seq"
                         class="item" 
                        :class="screenList.includes(item.seq) ? 'active' : ''"                      
                        @click="dressingChange(item)">
                        {{ item.name }}
                        </div>                        
                    </div>                 
                </div>
            </div>
            <div class="headcontain">   
                内容...            
                <!--
                <div class="conditontype"> 
                    <div class="productperiod" @mouseenter="mouseenterChange" @mouseleave="mouseleaveChange">
                        <IconSvg iconClass="setprod" width="20" style="margin: 0 5px 0 0" /> 
                        <div class="line"></div>
                        <div class="itemlist">
                            <div class="item">每月</div>
                            <div class="item">每周</div>
                            <div class="item">每天</div>
                        </div>
                    </div>  
                    <div class="producttype">指标检测</div>                
                </div>
                <div class="conditontime">

                </div> 
                -->
            </div>
        </div>
    </div>
</template>

<script>
export default { 
    props: {  
        sOptionDtoList:{
            type:Array,
            required: true
        }
    },
    watch:{
     
    },
    components: {
     
    },
    data() {
        return{
            tabChangeIndex:0,
            screenList:[],  
            optionDtoMapList:[] 
        }
    },
    methods: { 
        mouseenterChange(){

        }, 
        mouseleaveChange(){

        },
        dressingAllChange(){
            this.screenList = [];
            this.tabChangeIndex = 0;
            this.optionDtoMapList = this.sOptionDtoList;
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
                this.optionDtoMapList = this.sOptionDtoList;
            }else{
                this.optionDtoMapList = this.sOptionDtoList.filter(item => this.screenList.includes(item.seq))
            } 
            // console.log('screenList', this.screenList)
            // console.log('optionDtoMapList', this.optionDtoMapList)
        } 
    }
}
</script>

<style lang="scss" scoped>
.previewcontain{
  padding: 0 15px;
  .service{  
    margin: 20px 0 0 -15px; 
    width: 195px;
    height: 32px;
    border-radius: 100px 0px 0px 100px;
    background-color: rgba(241, 245, 251, 1);      
    font-size: 14px;
    color: rgba(68, 106, 189, 1);
    text-align: center;
    //font-family: Roboto;
    border-right: 2px solid rgba(68, 104, 189, 1);
    overflow: hidden;
    .timetxt{  
        margin-top: 4px;   
        height: 24px;
        line-height: 24px;       
        span{  
            display: inline-block;
            width: 85px;  
            height: 24px;
            line-height: 24px;     
            border-radius: 2px;      
            font-size: 12px;  
            color: rgba(68, 106, 189, 1);  
            text-align: center;                           
            background-color: rgba(255, 255, 255, 1);           
            border: 1px solid rgba(211, 220, 236, 1);
            box-sizing: border-box;
        }
    }     
  }
  .pointline{
    width: 205px;
    height: 2px;
    background: rgba(68, 104, 189, 1);
    position: relative;
    i{
        position: absolute;
        right:-6px;
        top:-7px;
        &::before{
            color:#4468BD;
            font-weight: bold;
        }           
    }
  }
  .productconent{
    padding: 0 10px;
    border: 1px solid rgba(211, 220, 236, 1);
    .headlist{
        padding: 10px;
        border-bottom: 1px solid rgba(211, 220, 236, 1);
        display: flex;
        .label{           
            width: 85px; 
            height: 32px;
            line-height: 32px;            
            font-size: 14px;
            color: rgba(78, 89, 105, 1);           
            font-family: SourceHanSansSC-regular; 
        }
        .content{
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
                margin-top: 3px;
                margin: 4.5px 0 0 5px;
                background: #D3DCEC;
            }
            .itemlist{   
                margin-left: 5px;                                                   
                display: flex;                                   
                .item{
                    margin-right: 10px;
                    padding: 0 12px;
                    height: 32px;
                    line-height: 32px;
                    font-size: 14px;
                    color: rgba(78, 89, 105, 1);
                    border-radius: 4px;
                    cursor: pointer;                
                    &.active{
                        color: rgba(68, 106, 189, 1); 
                        font-weight: bold;
                        font-family: Roboto;
                        background-color: rgba(241, 245, 251, 1);
                    }
                }
            }                                      
        }
    }
    .headcontain{
        border:1px solid red;
        display: flex;
        .conditontype{
            .productperiod{              
                width: 85px;
                height: 36px;
                line-height: 36px;
                border-radius: 100px;                                    
                background-color: rgba(241, 245, 251, 1);
                overflow: hidden;
                .line{
                    width: 1px;
                    height: 25px;
                    background: #D3DCEC;
                }
                .itemlist{
                    .item{
                        font-size: 14px;
                        color: rgba(68, 106, 189, 1);
                        font-family: Roboto;
                    }
                }
            }
        }
        .conditontime{

        }
    }
  }
}
</style>