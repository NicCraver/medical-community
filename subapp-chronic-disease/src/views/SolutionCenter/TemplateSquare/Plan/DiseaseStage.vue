<!--
 * @Author: Nic
 * @Date: 2023-02-01 10:41:37
 * @LastEditTime: 2023-02-09 14:17:03
 * @LastEditors: Nic
 * @Description: 疾病分期
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/Plan/DiseaseStage.vue
-->
<template>
  <div class="DiseaseStage">
    <PlanHeader title="疾病分期" introduce="创建疾病在不同分期下诊断条件">
      <el-button @click="openPlanDialog('addInstallment')">新建分期</el-button>
    </PlanHeader>

    <main class="main-tab">
      <!-- :style="{ width: widthcutsize + 'px'}" -->
      <div class="tab-items">
        <!-- <div class="tab_content"></div> -->
        <div
          v-for="(item, index) in diseaseStageList"
          :key="index"
          class="tab-item"
          :class="item.seq === tabChangeIndex ? 'tab-item-selected' : ''"
          @click="tabChangeIndex = item.seq"
        >
          <div class="tab_txt">
            <div :class="['tab_name', { errTxtcolot: item.error }]">{{ item.name }}</div>
            <div class="tab_operation">
              <span class="icon_more"><i class="el-icon-more"></i></span>
              <div class="downbox">
                <span @click="openPlanDialog('copyInstallment', null, null, item)">复制</span>
                <span @click="delChange($event, item)">删除</span>
              </div>
            </div>
          </div>
        </div>         
      </div>
      <div class="tab-body tab-body-size">
        <header class="tab-body-header" v-if="diseaseStageList.length">
          <div>
            <span class="title">诊断条件</span>
            <span class="introduce">若患者满足以下条件则判定为该分期</span>
          </div>
          <div class="add_condition">
            <el-dropdown trigger="click" placement="bottom-start">
              <el-button type="primary">
                <i class="el-icon-plus el-icon--left"></i>
                添加诊断条件
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="v in diagnosticConditions"
                  @click.native="handleCommand(v)"
                  :key="v.value"
                >
                  {{ v.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </header>
        <main class="tab-body-main">
          <el-scrollbar style="height: calc(100vh - 300px)">
            <div v-for="(item, index) in diseaseStageList" :key="index">
              <DiagnosticConditions
                :sendConditionList="item.conditionsList" 
                :operatorOptionsList="operatorOptions"            
                v-if="(item.seq === tabChangeIndex) && Object.keys(operatorOptions).length !== 0"
              />    
            </div>
          </el-scrollbar>
        </main>

        <!-- <footer class="tab-body-footer">
          底部--------------------------------
        </footer> -->
      </div>
    </main>

    <!-- 弹窗 -->
    <PlanDialog
      ref="planDialogFormRef"
      v-if="planDialogVisible"
      v-model="planDialogVisible"
      :title="planDialogTitle"
      :state="planDialogState"
      :operatorOptions="operatorOptions"
      :diagnosticConditions="checkboxList"
      :labelType="labelType" 
      :distinguishType="distinguishType"  
      :tagDiseaseDeptId="planData.tagDiseaseDeptId" 
      @getPlanDialogData="getPlanDialogData"
    />
    
  </div>
</template>

<script>
// import { ProDialog } from 'anx-vue'
import PlanDialog from '../components/PlanDialog.vue'
import PlanHeader from '../components/PlanHeader.vue'
import DiagnosticConditions from '../components/DiagnosticConditions.vue'
import { getPageConfig, getOperators, newlyBuiltStaging, copyDiseasePer, getDiseasePerByPlanId, deleteDiseasePer, saveDiseasePer, perNameNotRepeat } from '@/api/modules/SolutionCenter/index.js'
export default {
  props: {  
    planData: {
      type: Object,
    },
    widthcutsize:{
      type: Number
    }
  },
  components: {
    PlanHeader,
    DiagnosticConditions,
    // ProDialog,
    PlanDialog,
  },
  watch:{
   
  },
  data() {
    return {
      //方案id
      planId:'', 
      labelType:'',
      planDialogTitle: '新建分期',
      planDialogState: 'addInstallment',
      distinguishType:'',
      // 分期弹窗
      planDialogVisible: false,
      // 诊断条件
      diagnosticConditions: [],
      // 运算符
      operatorOptions: {},
      // 弹窗内部 checkbox 数据
      checkboxList: [],
      tabChangeIndex: 0,  
      copyParamsData:[],                            
      diseaseStageList: [      
        {
          conditionsList: [
            //诊断条件
            {
              conDetailList: [
                {
                  requisiteFlg: 0, // 0:和  1:或
                  name: '',
                  jmConDConDtoList: [
                    //检验检查
                    {
                      name: '',
                      unitId: '', //单位
                      value1: '',
                      operatorId: '', //运算符
                      value2: '',
                      calibrationRange:'',                  
                    } 
                  ],                            
                },
              ],                  
              requisiteFlg: 0, // 0:和  1:或
              name: '', //条件名称
              needTot: 0, //全部或时：默认值1，否则0
              //seq: 0
            },
            {
              conDetailList: [
                {
                  requisiteFlg: 0, // 0:和  1:或
                  name: '',
                  operatorId: '', //运算符     
                  jmConDConDtoList: [
                    //检验检查
                    {                                               
                      cdcDetailDtoList: [ //病例信息 疾病标签
                                                        
                      ] 
                    } 
                  ],                            
                },
              ],                  
              requisiteFlg: 0, // 0:和  1:或
              name: '', //条件名称
              needTot: 0, //全部或时：默认值1，否则0
              //seq: 0
            },
          ],
          // "createDate": "2019-08-24T14:15:22Z",
          // "createUserId": "string",
          // "id": "string",
          // "modDate": "2019-08-24T14:15:22Z",
          // "modUserId": "string",
          name: '', // 分期名称
          // "orgId": "string",
          // "planId": "string",
          // "seq": 0
        },
      ],
      oneMinutes: 0,
      clock:null,
      positionTabList:{},
      widthCutSize:null,
      timer:null,
      downFlag:false,	  
    }
  },
  created() { 
    const { planId } = this.$route.query;   
    this.planId = planId; 
    console.log(this.$route.query)
    // 获取运算符
    this.getOperators()
    // 获取诊断条件
    this.getPageConfig()
    //获取疾病分期tab 列表
    this.getDiseasePerByPlanId()    
  },
  mounted() {    
  },
  methods: {   
    // 校验是否有数据为空 切换左侧tab时调用
    onValidate(draftFlg, stry, validateFlag) {
      console.log(`onValidate----------`)
      //校验疾病分期
      let flag = false;
      flag = this.diseaseTabValidate()
      console.log(`flag`, flag)
      // 保存草稿
      if(!validateFlag) this.onSaveDraft(draftFlg, stry) 
      return flag;
    },
    // 保存草稿
    async onSaveDraft(draftFlg, stry ) {  
      //开启加载中状态      
      this.$parent.$parent.loading = true;  
      let diseaseDataForm = {};   
      if (draftFlg) {
        console.log(`存草稿`)
        diseaseDataForm.draftFlag = '1'
      } else {
        console.log(`方案发布`)
        diseaseDataForm.draftFlag = '0' //'2'
      }
      diseaseDataForm.planId = this.planId;
      diseaseDataForm.diseasePerList = this.diseaseStageList;         
      console.log(`diseaseDataForm`, diseaseDataForm)
      try {
        const res = await saveDiseasePer(diseaseDataForm)
        console.log(`res`, res)
        if(res.code==0){
          //console.log(`stry`, stry)
          let timeCut = stry ? 3000 : 500;
          setTimeout(() => {
            this.$parent.$parent.loading = false;   
          }, timeCut);
        } 
        if(stry){
          this.$message({
            message: '已保存草稿',                
            customClass: "myClass"
          });
          setTimeout(() => {
            this.$router.push({
              name: "DraftColumn"           
            });  
          }, 3000);
        }else{
          if(draftFlg){
            this.$message.success('保存成功!')
            this.getDiseasePerByPlanId()    
          } else{
            this.sendCode()         
            const h = this.$createElement;
            this.$msgbox({                
              message: h('div', null, [
                h('p', {class: 'title'}, '发布成功'),
                h('p', {class: 'txt'}, [
                  h('span', null, '以保存在'),
                  h('span', { style: 'color:#446ABD; cursor: pointer;', on:{
                      click:() => {
                        this.goToRenew()
                      }
                  }}, ' 院内模板-开启中 '),
                  h('span', null, '查看'),
                ]),
                h('p', {class: 'txt'}, [
                  h('span', { class: 'timeDesc' }, '3'),
                  h('span', null, ' 秒 后自动跳转 '),
                  h('span', { style: 'color:#446ABD; cursor: pointer;', on:{
                      click:() => {
                        this.cancelChange()                  
                      }
                  }}, '取消'),
                ]),           
              ]),
              dangerouslyUseHTMLString: true,
              type: 'success',
              customClass: 'releaseDefault',
              closeOnClickModal: false        
            })
          }    
        }       
      } catch (error) {    
        console.log(`error`, error)          
      }
    },  
    sendCode() {    
      this.oneMinutes = 3; 
      this.clock = setInterval(() => {     
        this.oneMinutes--;    
        let tex = document.querySelector(".timeDesc")
        tex.innerHTML = this.oneMinutes;
        if (this.oneMinutes === 0) {      
          clearInterval(this.clock);
          tex.innerHTML = 3;
          this.goToRenew() 
        }
      }, 1000)
    },
    cancelChange(){
      clearInterval(this.clock);
      this.$msgbox.close(); 
      this.getDiseasePerByPlanId()  
    },
    goToRenew(){
      this.$msgbox.close();      
      this.$router.push({
          name: "InnerTemplate"        
      });  
    },      
    // 在此统一校验疾病分期
    diseaseTabValidate(){
      let tagFlag = false;   
      //1.疾病分期为空 1.诊断条件为空 1.诊断项目为空   三种情况不支持发布，
      let inspectionList = [];
      let caseInfoList = []; 
      let emptyList = [];  
      if(!this.diseaseStageList.length) tagFlag = false;
      if(this.diseaseStageList.length){                   
        this.diseaseStageList.forEach((item,index) => {
          let errorList = [];  
          if(!item.conditionsList.length){
            emptyList.push(index) 
            this.setProperty(item, emptyList, index)
            return; 
          }    
          item.conditionsList.forEach((cont, contIdx) => { 
            if(!cont.conDetailList.length){
              emptyList.push(contIdx) 
              this.setProperty(item, emptyList, index)
              return; 
            }          
            cont.conDetailList.forEach((wrap, wrapIdx) => {
              wrap.jmConDConDtoList.forEach((valc, valIdx) => {
                if(cont.itemId == 'a6cb8247566b4de8acdecf01e051bb35'){ //病例信息
                  if(!valc.operatorId || (valc.cdcDetailDtoList && !valc.cdcDetailDtoList.length)){
                    caseInfoList.push(valIdx)
                    errorList.push(wrapIdx)
                  } 
                } 
                if(cont.itemId == '23de5f11bb0042b185243d9de97aff45'){ //院内检验检查
                  if(!valc.calibrationRange || (valc.calibrationRange=='1' && (!valc.value1 || !valc.operatorId || !valc.value2)) || (valc.calibrationRange=='2' && (!valc.operatorId || !valc.value1))){
                    inspectionList.push(valIdx)
                    errorList.push(wrapIdx)
                  } 
                } 
              })             
            }) 
            this.setProperty(item, errorList, index)                  
          })                      
        })
        // console.log(this.diseaseStageList)
        // console.log(`inspectionList`, inspectionList)
        // console.log(`caseInfoList`, caseInfoList)
        // console.log(`emptyList`, caseInfoList)
        if(inspectionList.length || caseInfoList.length || emptyList.length) tagFlag = false;
        else tagFlag = true;
      }     
      return tagFlag;
    }, 
    //校验 院内检验检查数值范围是否存在冲突
    validateRangeFlag(){       
      let validateList = []; 
      this.positionTabList = {}; //统计记录冲突值的位置 
      this.diseaseStageList.forEach((param, keyindex) => {
        param.conditionsList.forEach((curt,index) => {
          if(curt.itemId == '23de5f11bb0042b185243d9de97aff45'){
            let stone = this.oneFlagChange(curt.conDetailList)
            console.log(`stone`, stone)
            if(!stone.flagDisable){            
              validateList.push(index) 
              if(stone.positionList && stone.positionList.length){
                this.positionTabList[keyindex] = stone.positionList;
              }            
            }     
          }         
        })
      })   
      console.log(`positionTabList`, this.positionTabList) 
      return { validateFlag : (validateList.length ? false : true) }
    },
    oneFlagChange(list){  
      console.log(`list`, list)  
      let positionList = []; //统计记录冲突值的位置  
      let flagList = [];    
      let mapList = [];
      list.forEach((item,x) => {
        if(item.requisiteFlg==0){
          let data = item.jmConDConDtoList.map((cont,y) => {
            cont.position = [x, y]
            return cont          
          })        
          mapList.push(...data)
        }     
      })  
      console.log(`mapList`, mapList)   

      let itemIdList = mapList.map(item => { return item.itemId })
      console.log(`itemIdList`, itemIdList)
      
      let setItemIdList = Array.from(new Set(itemIdList));
      console.log(`setItemIdList`, setItemIdList)
      
      let mapData = [];
      setItemIdList.forEach((item, index) => {
        mapData[index] = []; //'typeList'+index
        mapList.forEach(cont => {
          if(item === cont.itemId){ 
            let newparam = {
              name:cont.name,
              position:cont.position,
              calibrationRange:cont.calibrationRange,
              operatorId:cont.operatorId,
              value1:cont.value1,
              value2: cont.calibrationRange=='1'?cont.value2:null          
            } 
            mapData[index].push(newparam) //'typeList'+index
          } 
        })
      })
      console.log(`mapData`, mapData) 

      //校验相同疾病指标数值范围是否冲突    
      if(mapData.length){       
        mapData.forEach(item => {
          //单个诊断指标不做校验
          if(item.length >1){
            console.log(`item`, item)           
            let min = 0;
            let equalTo = [];
            let max = null;

            let minRange = 0;
            let maxRange = null;
            let equalToValue = null;
            //取最大值 最小值
            //判断最大最小值是否在min max区间

            //1.多个项目是 和的 相同的诊断指标进行比对，如果有满足条件的范围值就不冲突不然视为冲突
            //1.多个项目是 和 的相同的诊断指标，且诊断指标list大于2，进行判断冲突，不然不判断
            //<:38102df71b944bb0a46a597814853e9f, =:5aed7df2a56c43ecb4b25fa308a07fff, ≥:877f398895a544198dd02e0b706e4b0a, ≤:90d06de82b104ed6b862a73df2c6a3ba, >:b9b9cbe248bd4b8f8f388edfc6ab7da8    
            item.forEach((cent) => {                   
              if(cent.calibrationRange=='1'){ //范围值                
                if(min==0 && max==null){
                  min = +cent.value1;
                  max = +cent.value2;                                  
                }else{                                                               
                  if(+cent.value1 >=min) min = +cent.value1;
                  if(max == null) max = +cent.value2;
                  else if(+cent.value2 <=max) max = +cent.value2;     
                } 
                // 定位冲突位置   
                if(minRange==0 && maxRange==null){
                  minRange = +cent.value1;
                  maxRange = +cent.value2;    
                }else{
                  if(+cent.value1 >=minRange && +cent.value2 <=maxRange){
                    minRange = +cent.value1;
                    maxRange = +cent.value2;  
                  }                                           
                  if(+cent.value2 <minRange || +cent.value1 > maxRange) positionList.push(cent.position) 
                }                        
              }
              if(cent.calibrationRange=='2'){ //单值                              
                if(cent.operatorId=='38102df71b944bb0a46a597814853e9f'){                 
                  let bwetvalue = this.decimalDigits(cent.value1)==0 ? +cent.value1-1 : (this.decimalDigits(cent.value1)==1?this.formatDecimal(+cent.value1-0.1,1):this.formatDecimal(+cent.value1-0.01, 2));                
                  if(max==null) max = bwetvalue;
                  else if(bwetvalue <=max) max = bwetvalue; 
                                
                  //定位冲突位置
                  if(maxRange==null) maxRange = bwetvalue;
                  else if(bwetvalue <=maxRange && bwetvalue>=minRange) maxRange = bwetvalue;  
                  else positionList.push(cent.position)    
                }
                if(cent.operatorId=='90d06de82b104ed6b862a73df2c6a3ba'){
                  if(max==null) max = +cent.value1;
                  else if (+cent.value1 <=max) max = +cent.value1;   
                                  
                  //定位冲突位置
                  if(maxRange==null) maxRange = +cent.value1;
                  else if(+cent.value1 <=maxRange && +cent.value1>=minRange) maxRange = +cent.value1;  
                  else positionList.push(cent.position)   
                }
                if(cent.operatorId=='b9b9cbe248bd4b8f8f388edfc6ab7da8'){                 
                  let bwetvalue = this.decimalDigits(cent.value1)==0 ? +cent.value1+1 : (this.decimalDigits(cent.value1)==1?this.formatDecimal(+cent.value1+0.1,1):this.formatDecimal(+cent.value1+0.01,2));               
                  // if(min==0) min = bwetvalue;
                  // else if(bwetvalue >=min) min = bwetvalue;   
                  if(bwetvalue >=min) min = bwetvalue;  
                 
                  //定位冲突位置
                  if(bwetvalue >=minRange) minRange = bwetvalue;
                  else if(bwetvalue >=minRange && bwetvalue<=maxRange) minRange = bwetvalue;  
                  else positionList.push(cent.position)                               
                }
                if(cent.operatorId=='877f398895a544198dd02e0b706e4b0a'){
                  // if(min==0) min = +cent.value1;   
                  // else if(+cent.value1 >=min) min = +cent.value1;               
                  if(+cent.value1 >=min) min = +cent.value1;  
                                  
                  //定位冲突位置
                  if(+cent.value1 >=minRange) minRange = +cent.value1;
                  else if(+cent.value1 >=minRange && +cent.value1<=maxRange) minRange = +cent.value1;  
                  else positionList.push(cent.position) 
                }  
                if(cent.operatorId=='5aed7df2a56c43ecb4b25fa308a07fff'){
                  equalTo.push(+cent.value1)
                  
                  //定位冲突位置
                  if(equalToValue ==null){
                    equalToValue = +cent.value1;
                    if(maxRange && !(+cent.value1 >=minRange && +cent.value1 <=maxRange)) positionList.push(cent.position);
                  }else{
                    if((equalToValue !== +cent.value1) || (maxRange && !(+cent.value1 >=minRange && +cent.value1 <=maxRange))) positionList.push(cent.position); 
                  } 
                }                                                       
              }                       
            })  
            if(equalTo.length){
              let first = equalTo[0];
              let curt = equalTo.every(val => { return val == first })
              if(!curt) flagList.push(Math.floor(Math.random()*3))
              else{                    
                equalTo.forEach((val, key) => {
                  if(val <min || (max && val >max)) flagList.push(key)
                })               
              }              
              if((min > max) && max){
                flagList.push(Math.floor(Math.random()*3)) 
              }                        
            }else{             
              if((min > max) && max) flagList.push(Math.floor(Math.random()*3))           
            }                     
            console.log(`min, max`, min, max) 
            console.log(`flagList`, flagList)         
            console.log('-------------------')                                                          
          }         
        })        
      }    
      console.log(`positionList`, positionList)              
      if(flagList.length) return {flagDisable: false, positionList: positionList};
      else return {flagDisable: true};
      //多个项目条件全部为或，不做冲突校验...
      //else{}     
    },
    formatDecimal(num, decimal) {
      num = num.toString()
      let index = num.indexOf('.')
      if (index !== -1) {
        num = num.substring(0, decimal + index + 1)
      } else {
        num = num.substring(0)
      }
      return parseFloat(num).toFixed(decimal)
    },
    changeBorderRed(){       
      if(!Object.keys(this.positionTabList).length) return;
      for (let key in this.positionTabList) {
        // console.log(key)
        // console.log(this.positionTabList[key])
        this.diseaseStageList.forEach((item, index) => {
          if(key == index){           
            this.$delete(item, 'error');
            this.$set(item, 'error', true); 
            item.conditionsList.forEach(curt => {
              if(curt.itemId == '23de5f11bb0042b185243d9de97aff45'){
                curt.conDetailList.forEach((cent,x) => {
                  if(cent.requisiteFlg==0){
                    cent.jmConDConDtoList.forEach((cont,y) => {  
                      let flag = this.positionTabList[key].some(arr => {                                           
                        return (arr[0]==x && arr[1]==y) 
                      })    
                      // console.log(flag) 
                      // console.log('---------------')                   
                      if(flag) this.$set(cont, 'disableFlag', true);
                      else this.$set(cont, 'disableFlag', false);
                    })
                  }
                })     
              }         
            })
          }         
        })
      }                 
    },
    //判断小数位
    decimalDigits(val){              
      let x = String(val).indexOf(".")== -1 ? String(val).length : String(val).indexOf(".")+1; 
      let y = String(val).length - x;
      // console.log(val, y)    
      return y;
    },    
    setProperty(item, list, index){
      //console.log(item, list, index)
      let obj = list.length ? {error: true} : {error: false};
      let art = Object.assign(item, obj) ;
      //console.log(art)
      this.$set(this.diseaseStageList, index, art);  
      //console.log(this.diseaseStageList)
    },
    // 打开弹窗
    openPlanDialog(type, id, stry, nextData) {
      console.log(type, id, stry, nextData)

      if(this.diseaseStageList.length >=20) return this.$message.error('最多可以创建20个疾病分期'); 

      const map = {
        addInstallment: () => {
          this.planDialogTitle = '新建分期'
          this.planDialogState = 'addInstallment'
          this.checkboxList = this.diagnosticConditions
        },
        copyInstallment:() => {
          this.planDialogTitle = '复制分期'
          this.planDialogState = 'copyInstallment'
          this.checkboxList = this.diagnosticConditions
          this.copyParamsData = nextData;         
        },
        病历信息: async () => {
          this.planDialogTitle = '添加病历信息'
          this.planDialogState = 'addMedicalRecord'
          this.distinguishType = stry       
          this.checkboxList = await this.getDiagnosticList(id, 'addMedicalRecord')               
        },
        院内检验检查: async () => {
          this.planDialogTitle = '添加院内检验检查'
          this.planDialogState = 'inspectionCheck' 
          this.distinguishType = stry                
          let temp = await this.getDiagnosticList(id, 'inspectionCheck')
          console.log(temp)
          this.checkboxList = removeEmptyChildren(temp)
          console.log(this.checkboxList)
          function removeEmptyChildren(node) {
            node.forEach((item) => {
              if ('children' in item && item.children.length === 0) {
                delete item.children
              } else if ('children' in item && item.children.length) {
                removeEmptyChildren(item.children)
              }
            })
            return node
          }
        }
      }
      if(id) this.labelType = id;  
      map[type]()
      this.planDialogVisible = true;

      // 复制分期  +  添加项目 默认展示数据
      if(type === 'copyInstallment'){     
        this.$nextTick(() => { 
          //复制分期         
          let list = [];
          nextData.conditionsList.forEach(item => { list.push(item.name) });
          this.$refs['planDialogFormRef'].installmentForm = {
            installmentName: nextData.name,
            diagnostiCondition: list
          }      
                  
          // if(type === '院内检验检查' && this.distinguishType === '2'){                                            
          //   this.$refs['planDialogFormRef'].inspectionCheckForm = {          
          //     diagnosticIndex:[],
          //     projectName:['3c19a0d4556846b2abd4b8d0c95b1de7']                       
          //   }
          //   setTimeout(() => {
          //     this.$refs['planDialogFormRef'].handleInspectionCheckChange() 
          //   }, 500);        
          // }
        })
      }
    },
    // 获取弹窗返回的数据
    getPlanDialogData(row) {
      console.log(`getPlanDialogData`, row)
      // 新建分期
      if (row.type === 'addInstallment' || row.type === 'copyInstallment') {
        this.addInstallment(row)
      }
      // 病历信息
      if (row.type === 'addMedicalRecord') {     
        this.addMedicalRecord(row)
      }
      // 检验检查
      if (row.type === 'inspectionCheck') {
        this.inspectionCheck(row)
      }
    },
    //校验方案分期名称是否重复
    subSchemeNameNotMethod(row, callback) {
      let data ={
        name:row.installmentName,
        planId:this.planId
      }
      perNameNotRepeat(data).then((res)=>{
        if(res.code == 0) {       
          callback(res.result);
        }
      })
    },
    addInstallmentChange(row){
      let dataParam = row.indicatorList.map((item,index) => ({
        name:item.label,
        itemId:item.value,
        needTot:null,
        conDetailList:[], //检验检查 病例信息
        requisiteFlg:0,
        seq:index
      })); 
      //console.log(dataParam)

      let index = !this.diseaseStageList.length ? 0 : this.diseaseStageList[this.diseaseStageList.length-1].seq+1;
      let diseasePageData = {
        name: row.installmentName,
        planId: this.planId,
        seq: index,     
        conditionsList:dataParam
      }
      //console.log(diseasePageData)
      //新建分期 + 复制分期
      if(row.type === 'addInstallment'){     
        this.diseaseStageList.push(diseasePageData) 
        this.tabChangeIndex = this.diseaseStageList[this.diseaseStageList.length-1].seq;    
      }else{      
        let newDataList = [];
        //复制子方案
        let subIdList = diseasePageData.conditionsList.map((item) => {
          return item.itemId;
        })
        let copyIdList = this.copyParamsData.conditionsList.map((item) => {
          return item.itemId;
        })
        // console.log(subIdList)   
        // console.log(copyIdList)

        let cutList = this.copyParamsData.conditionsList.filter(item => subIdList.includes(item.itemId))   
        let sutList = diseasePageData.conditionsList.filter(item => !copyIdList.includes(item.itemId))
        // console.log(cutList) 
        // console.log(sutList) 

        newDataList = cutList.concat(sutList) 
        
        let copyNewDataList = JSON.parse(JSON.stringify(newDataList))
        // console.log(newDataList)      
        // console.log('--------复制--------')     
        diseasePageData.conditionsList = copyNewDataList;      
        this.diseaseStageList.push(diseasePageData);              
        this.tabChangeIndex = this.diseaseStageList[this.diseaseStageList.length-1].seq; 
      }
      this.planDialogVisible = false;    
      console.log('this.diseaseStageList', this.diseaseStageList)     
    },
    // 新增分期
    async addInstallment(row) {
      console.log(`新建、复制分期`, row) 
      let sameFlag = false;
      this.subSchemeNameNotMethod(row, (result) => {       
        if(result) sameFlag = true; 
        if(sameFlag) return this.$message.error('疾病分期名称不允许重复')  
        else this.addInstallmentChange(row)      
      });               
    },
    //查询疾病分期tab列表
    async getDiseasePerByPlanId(){ //type
      try {
        const res = await getDiseasePerByPlanId({ planId: this.planId }) 
        if(res.code==0){
          this.diseaseStageList = res.result;
          if(this.diseaseStageList.length){          
            let tabIndexObject = this.diseaseStageList.filter(item => item.conditionsList.length == 0);
            if(tabIndexObject.length) this.tabChangeIndex = tabIndexObject[0].seq; 
                     
            if(this.$parent.$parent.tabPlanActive){
              this.tabChangeIndex = +this.$parent.$parent.tabPlanActive;         
              this.$parent.$parent.tabPlanActive = null;             
            }     
          }else{
            this.tabChangeIndex = 0; 
          }          
          //校验必填
          if(this.diseaseStageList.length) this.diseaseTabValidate();               
          console.log(`diseaseStageList`, this.diseaseStageList) 

          return this.diseaseStageList;      
        }               
      } catch (error) {
        console.log(`error`, error)
      }
    },
    // 添加检验检查
    inspectionCheck(row) {
      // controlType  // 控件类型:0-血压，血糖，1-现病史等
      // operatorId    //运算符 ( < = > 包含不包含)
      // decimalDigits  // 小数位数：0-整数，1-一位小数，2-两位小数
      // this.operatorOptions[row.operatorId] operatorId 用法
      console.log(`添加检验检查=========`, row)
      this.planDialogVisible = false;
      
      //conDetailList 公共数据
      row.jmConDConDtoList.forEach(item => {
        item.unitId = item.unitId[0].unitDesc;
        item.itemId = item.itemId;
        item.value1 = null;
        item.operatorId = '';
        item.value2 = null;
      })        
      let jmConDConDtoListMap = {};
      jmConDConDtoListMap.name = row.name.indexOf('/') != -1 ? row.name.split('/')[row.name.split('/').length-1] : row.name;
      jmConDConDtoListMap.requisiteFlg = 0; //row.requisiteFlg; 默认添加条件为 和
      jmConDConDtoListMap.jmConDConDtoList = row.jmConDConDtoList;
      // console.log(jmConDConDtoListMap)  
      // console.log(this.tabChangeIndex)  

      //区分添加诊断条件和添加项目 - 检验检查
      if(row.distinguishType == '1'){
        //区分有无大类
        let flagList = this.diseaseStageList[this.tabChangeIndex].conditionsList.filter(item => item.itemId === row.labelType);      
        if(flagList.length){  
          this.diseaseStageList[this.tabChangeIndex].conditionsList.forEach((item, index) => {    
            console.log(item.itemId, row.labelType)       
            if(item.itemId === row.labelType) item.conDetailList.push(jmConDConDtoListMap)
          }) 
          // let newConditionsList = JSON.parse(JSON.stringify(this.diseaseStageList[this.tabChangeIndex].conditionsList));                  
          // newConditionsList.forEach((item) => {    
          //   //console.log(item.itemId, row.labelType)
          //   if(item.itemId === row.labelType) item.conDetailList.push(jmConDConDtoListMap)
          // })   
          // this.diseaseStageList[this.tabChangeIndex].conditionsList = newConditionsList; 
        }else{                  
          let cutGone = this.diagnosticConditions.filter(item => item.value === row.labelType)[0];  
          console.log(cutGone)            
          let paramsDataList = {
            seq: this.diseaseStageList[this.tabChangeIndex].conditionsList.length+1,
            requisiteFlg:0,
            needTot:null,
            name: cutGone.label,
            itemId:cutGone.value,
            conDetailList:[]
          } 
          paramsDataList.conDetailList.push(jmConDConDtoListMap)
          // console.log(paramsDataList)                
          this.diseaseStageList[this.tabChangeIndex].conditionsList.push(paramsDataList)                     
        }
      }else{  
        this.diseaseStageList[this.tabChangeIndex].conditionsList.forEach((item, index) => {    
          console.log(item.itemId, row.labelType)
          if(item.itemId === row.labelType) item.conDetailList.push(jmConDConDtoListMap)
        }) 
        // let newConditionsList = JSON.parse(JSON.stringify(this.diseaseStageList[this.tabChangeIndex].conditionsList));                  
        // newConditionsList.forEach((item) => {    
        //   //console.log(item.itemId, row.labelType)
        //   if(item.itemId === row.labelType) item.conDetailList.push(jmConDConDtoListMap)
        // })   
        // this.diseaseStageList[this.tabChangeIndex].conditionsList = newConditionsList;        
      } 
      console.log(this.diseaseStageList)            
    },
    // 添加病例信息
    addMedicalRecord(row) { 
      console.log(`添加病历信息=========`, row)
      this.planDialogVisible = false; 

      //conDetailList 公共数据
      let indicatorItemListMap = row.indicatorItemList.map(item=>({    
        requisiteFlg: 0, //item.requisiteFlg, // 0:和  1:或  
        name: item.name,   
        jmConDConDtoList:[
          {
            param:item.param,
            interfaceUrl:item.url,        
            cdcDetailDtoList: [], // item.connectiveParam==="" ? [] : item.connectiveParam.split(',')
            operatorId: ''
          }
        ]
      }))    
      console.log(indicatorItemListMap) 
      //区分添加诊断条件和添加项目 病例信息
      if(row.distinguishType == '1'){
        //区分有无大类
        let flagList = this.diseaseStageList[this.tabChangeIndex].conditionsList.filter(item => item.itemId === row.labelType);
        if(flagList.length){
          this.diseaseStageList[this.tabChangeIndex].conditionsList.forEach((item, index) => {    
            //console.log(item.itemId, row.labelType)
            if(item.itemId === row.labelType){
              if(indicatorItemListMap.length){
                indicatorItemListMap.forEach(cont => {
                  item.conDetailList.push(cont)
                })           
              }         
            } 
          })   
          // let newConditionsList = JSON.parse(JSON.stringify(this.diseaseStageList[this.tabChangeIndex].conditionsList));
          // newConditionsList.forEach(item => {
          //   if(item.itemId === row.labelType){          
          //     if(indicatorItemListMap.length){
          //       indicatorItemListMap.forEach(cont => {                   
          //         item.conDetailList.push(cont)
          //       })           
          //     }         
          //   } 
          // })
          // //console.log(newConditionsList)      
          // this.diseaseStageList[this.tabChangeIndex].conditionsList = newConditionsList;                  
        } else {
          let cutGone = this.diagnosticConditions.filter(item => item.value === row.labelType)[0];  
          console.log(cutGone)
          
          let paramsDataList = {
            seq: this.diseaseStageList[this.tabChangeIndex].conditionsList.length+1,
            requisiteFlg:0,
            needTot:null,
            name: cutGone.label,
            itemId:cutGone.value,
            conDetailList:[]
          }
          indicatorItemListMap.forEach(item => {
            paramsDataList.conDetailList.push(item)
          })
          // console.log(indicatorItemListMap)    
          // console.log(paramsDataList.conDetailList)     
          // paramsDataList.conDetailList.concat(indicatorItemListMap)
          console.log(paramsDataList)                
          this.diseaseStageList[this.tabChangeIndex].conditionsList.push(paramsDataList) 
        }
      }else{  
        this.diseaseStageList[this.tabChangeIndex].conditionsList.forEach((item, index) => {    
          //console.log(item.itemId, row.labelType)
          if(item.itemId === row.labelType){
            if(indicatorItemListMap.length){
              indicatorItemListMap.forEach(cont => {
                item.conDetailList.push(cont)
              })           
            }         
          } 
        })   
        // let newConditionsList = JSON.parse(JSON.stringify(this.diseaseStageList[this.tabChangeIndex].conditionsList));
        // newConditionsList.forEach(item => {
        //   if(item.itemId === row.labelType){          
        //     if(indicatorItemListMap.length){
        //       indicatorItemListMap.forEach(cont => {                   
        //         item.conDetailList.push(cont)
        //       })           
        //     }         
        //   } 
        // })
        // //console.log(newConditionsList)      
        // this.diseaseStageList[this.tabChangeIndex].conditionsList = newConditionsList;                   
      }           
      console.log(this.diseaseStageList)      
    },  
    // 获取诊断条件
    async getPageConfig() {
      try {
        const res = await getPageConfig({ parentId: '1' })
        console.log(`获取诊断条件`, JSON.parse(JSON.stringify(res)))
        this.diagnosticConditions = res.result
      } catch (error) {
        console.log(`error`, error)
      }
    },
    // 根据id 获取诊断条件 检验检查等弹窗数据
    async getDiagnosticList(id, flagt) {
      return new Promise((resolve) => {
        let params = {
          parentId: id       
        }
        if(flagt) params.diseaseId = this.planData.tagDiseaseDeptId;
        getPageConfig( params )
          .then((res) => {
            resolve(res.result)
          })
          .catch((error) => {
            console.error(error)
          })
      })
    },
    // 查询运算符
    async getOperators() {
      try {
        const res = await getOperators()
        console.log(`查询运算符`, JSON.parse(JSON.stringify(res)))
        this.operatorOptions = res.result;
      } catch (error) {
        console.log(`error`, error)
      }
    },
    // 添加诊断条件
    handleCommand(row) {
      // console.log(`=======`, row.label)
      // console.log(`=======`, row.value)
      console.log(`row`, row)     
      this.openPlanDialog(row.label, row.value, '1')
    },   
    // 删除分期
    delChange(e, cont) {
      if (e && e.stopPropagation) e.stopPropagation()
      else window.event.cancelBubble = true;
      var htmlText =
        '是否确认删除疾病分期<span style="font-size:14px;font-weight:bold;color:#446ABD">' +
          cont.name +
        '</span>? 删除后不支持恢复。';
      this.$confirm(htmlText, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      })
      .then(() => {      
        //this.deleteDiseasePer(cont.id)
        console.log(cont)             
        if(cont.id){
          let params = {
            planId:this.planId,
            diseasePerId:cont.id
          }
          this.deleteDiseasePer(params, cont)
        }else{
          this.diseaseStageList = this.diseaseStageList.filter(item => item.seq !== cont.seq);
          this.tabChangeIndex = 0;
          this.$message.success('删除成功')  
        }   
      })
      .catch(() => {})      
    },  
    //删除疾病分期tab页
    async deleteDiseasePer(params, cont){
      try {       
        const res = await deleteDiseasePer(params) 
        //console.log(res)   
        if(res.result){
          return this.$message.warning(res.result)    
        } else{
          this.diseaseStageList = this.diseaseStageList.filter(item => item.seq !== cont.seq);
          this.tabChangeIndex = 0;
          this.$message.success('删除成功')  
        } 
      } catch (error) {
        console.log(`error`, error)
      }
    },
  },
}
</script>

<style lang="scss">
.el-dropdown-menu {
  width: 150px;
}
// 发布成功弹窗样式
.releaseDefault{
  text-align: center;
  .el-message-box__status{
    margin-bottom: 20px;
    font-size: 60px!important;
    color:#5BD171 !important;
    position: static;
    transform: translateY(0) !important;
  }
  .el-message-box__message{
    padding:0;
    .title{      
      font-size: 20px;
      color: rgba(16, 16, 16, 1);     
    }
    .txt{
      margin-top: 10px;
      &.txttop{
        margin-top: 20px;
      }
      font-size: 14px;
      color: rgba(16, 16, 16, 1);          
      .timeDesc{
        color:red;
      }
    }
  }
  .el-message-box__header{ display: none; }
  .el-message-box__btns{ display: none; }
}
</style>
<style lang="scss" scoped>
.DiseaseStage {
  height: 100%;
  padding-bottom: 10px;

  .main-tab {
    margin-top: 20px;
    height: 100%;
    .tab-items {
      position: relative;
      display: flex;     
    }
    .tab-item {   
      padding: 0 10px;
      margin-right: 5px;
      height: 40px;
      line-height: 40px;
      color: rgba(100, 100, 100, 1);
      font-size: 16px;
      background-color: #fafafa;
      border: 1px solid rgba(211, 220, 236, 1);
      border-radius: 3px 3px 0px 0px;
      z-index: 10;
      cursor: pointer;
      .tab_txt {
        display: flex;
        justify-content: space-between;
        .errTxtcolot{
          color:red;
        }
        .tab_operation {
          position: relative;
          .icon_more {
            padding: 0 8px;
            color: #bbbbbb !important;
          }
          .downbox {
            display: none;
            position: absolute;
            right: -10px;
            top: 40px;
            width: 86px;
            height: 64px;
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
            background: #fff;
            box-shadow: 2px 2px 12px 4px rgb(210, 210, 210);
            z-index:10;
            span {
              display: block;
              line-height: 32px;
              font-size: 14px;
              color: #4e5969;
              padding-left: 12px;
              cursor: pointer;
              &:hover {
                background-color: #fafafa;
              }
            }
          }
        }
        .tab_operation:hover .downbox {
          display: block;
        }
      }
    }
    .tab-item-selected {
      color: rgba(68, 106, 189, 1);
      font-weight: bold;
      border-bottom: none;
      background-color: #fff;
    }

    .tab-body {
      z-index: 5;
      margin-top: -1px; //64
      border: 1px solid rgba(211, 220, 236, 1);
      background-color: #fff;
      height: calc(100% - 140px);
      padding: 20px;
      border-radius: 0px 0px 3px 3px;
      position: relative;
      .tab-body-header {
        display: flex;
        justify-content: space-between;
        .title {
          color: rgba(78, 89, 105, 1);
          font-size: 18px;
        }
        .introduce {
          padding-left: 4px;
          color: rgba(153, 153, 153, 1);
          font-size: 14px;
        }
        .add_condition {
          width: 150px;
          height: 32px;
          border-radius: 2px;
          background-color: #446abd;
          .el-dropdown {
            width: 100%;
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            color: #ffffff;
            text-align: center;
            .el-dropdown-link {
              display: block;
            }
          }
        }
      }
      .tab-body-main {
        margin: 15px 0;
      }
      .tab-body-footer {
        position: absolute;
        left: 0px;
        bottom: 0px;
        width: calc(100% - 40px);
        margin: 20px;
        height: 40px;
        border-radius: 4px;
        background-color: rgba(246, 248, 252, 1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      }
    }
  }

  .dialogTitle {
    ::v-deep.ProDialog .title {
      padding-left: 24px !important;
    }
    ::v-deep.ProDialog .title:before {
      left: 10px !important;
    }
    ::v-deep.ProDialog .el-dialog__headerbtn {
      top: 10px !important;
    }  
  }
}
</style>
