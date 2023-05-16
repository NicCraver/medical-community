<!--
 * @Author: Nic
 * @Date: 2023-02-01 10:41:17
 * @LastEditTime: 2023-02-28 16:36:05
 * @LastEditors: Nic
 * @Description: 基本信息
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/Plan/BasicInformation.vue
-->
<template>
  <div class="PlanBasicInformation">
    <div class="title">基本信息</div>
    <div style="padding-left: 100px">
      <el-form :model="basicInforForm" :rules="basicInforRules" ref="basicInforFormRef" label-width="100px">
        <el-form-item label="方案集名称" prop="name">
          <el-input style="width: 300px" v-model="basicInforForm.name" placeholder="请控制在20字以内"></el-input>
        </el-form-item>
        <el-form-item label="适配病种" prop="tagDiseaseDeptId">
          <el-select
            style="width: 300px"
            disabled
            v-model="basicInforForm.tagDiseaseDeptId"
            clearable
            placeholder="适配病种"
          >
            <el-option v-for="item in diseasesOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="方案周期" prop="cycleNum">
          <div class="basicInfor-form" style="width: 300px">
            <el-select v-model="basicInforForm.cycleNum" style="width: 240px" @change="cycleChange">
              <el-option v-for="item in cycleNumOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <div class="line"></div>
            <el-select v-model="basicInforForm.cycleUnitId" style="max-width: 60px" @change="cycleUnitIdTypeChange">
              <el-option v-for="item in cycleUnitOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="发布状态" prop="status">
          <el-radio v-model="basicInforForm.status" :label="0">开启</el-radio>
          <el-radio v-model="basicInforForm.status" :label="1">关闭</el-radio>
        </el-form-item>
        <el-form-item label="方案简述">
          <el-input
            type="textarea"
            style="width: 80%"
            placeholder="请输入内容"
            v-model="basicInforForm.description"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 6 }"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventbus.js'
import { onSaveJmPlan, getTagDiseases } from '@/api/modules/SolutionCenter'
export default {
  props: {
    planId: {
      type: String,
      default: '14ab1d000b5440b9bc7bc1a8b6d43138',
    },
    planData: {
      type: Object,
    },
  },
  data() {
    return {
      // 分期表单
      basicInforForm: {
        name: '',
        tagDiseaseDeptId: '',
        // 周期
        cycleNum: '',
        // 周期单位
        cycleUnitId: '582eda772fbc4956ac3d2e12f2271290',
        // 状态：0-开启，1-关闭
        status: 1,
        // 方案简述
        description: '',
        // 是否为草稿：0-否，1-是
        // draftFlg
      },
      cycleUnitOptions: [
        {
          label: '天',
          value: '582eda772fbc4956ac3d2e12f2271290', 
        },
        {
          label: '月',
          value: 'd9dcd2dacd5e47c2868183794a0fbffb',
        },
      ],
      cycleNumOptions: [],
      diseasesOptions: [],
      // 分期校验
      basicInforRules: {
        name: [
          { required: true, message: '请输入分期名称', trigger: 'blur' },
          { min: 1, max: 20, message: '请控制在20字符以内', trigger: 'blur' },
        ],
        tagDiseaseDeptId: [{ required: true, message: '请输入分期名称', trigger: 'blur' }],
        cycleNum: [{ required: true, message: '请输入分期名称', trigger: 'blur' }],
        status: [{ required: true, message: '请输入分期名称', trigger: 'blur' }],
      },
    }
  },
  watch: {
    planData(newValue, oldValue) {
      console.log(`this.planData`, this.planData)
      // tagDiseaseDeptId: newValue.tagDiseaseDeptId,
      // cycleUnitId: '582eda772fbc4956ac3d2e12f2271290',
      // status: 1,
      // description: '简介',
      this.basicInforForm = newValue
      // this.basicInforForm.name = newValue.name
      this.getCycleNumOptions()
    },
  },
  created() {
    this.getTagDiseases()
  },
  mounted() {
   
  },
  methods: {
    onValidate(draftFlg, stry, validateFlag) {
      console.log(`onValidate----------`)
      //校验基本信息
      let flag = false
      flag = this.basicTabValidate()
      console.log(`flag`, flag)
      // 保存草稿
      // 判断基本信息发布状态
      if(!validateFlag){    
        if (stry) {
          let newstatus = this.basicInforForm.status
          if (newstatus === 0) {
            this.$confirm('您正在将方案保存至草稿栏，如需继续应将状态修改为关闭', '提示', {
              confirmButtonText: '修改并保存',
              cancelButtonText: '返回',
              type: 'warning',
            })
              .then(() => {
                this.basicInforForm.status = 1
                this.onSaveDraft(draftFlg, stry)
              })
              .catch(() => {
                // --> 取消
              })
          } else {
            this.onSaveDraft(draftFlg, stry)
          }
        } else {
          this.onSaveDraft(draftFlg, stry)
        }
      }
      return {
        flag,
        name: this.basicInforForm.name,
      }
    },
    // 保存草稿
    async onSaveDraft(draftFlg, stry) {
      //开启加载中状态      
      this.$parent.$parent.loading = true;  
      if (draftFlg) {
        console.log(`存草稿`)
        this.basicInforForm.draftFlg = '1'
      } else {
        console.log(`方案发布`)
        this.basicInforForm.draftFlg = '0' //'2'
      }
      console.log(`this.basicInforForm`, this.basicInforForm)
      try {
        const res = await onSaveJmPlan(Object.assign(this.planData, this.basicInforForm))
        console.log(`res`, res)
        if(res.code==0){
          //console.log(`stry`, stry)
          let timeCut = stry ? 3000 : 500;
          setTimeout(() => {
            this.$parent.$parent.loading = false;   
          }, timeCut);
        } 
        // 区分 tab-view 和 保存并返回
        if (stry) {
          this.$message({
            message: `已保存至草稿栏`,
            customClass: 'messageClass',
            iconClass: '1',
            center: true,
            duration: 1000,
            offset: 300,
          })
          // this.$message({
          //   message: '已保存草稿',
          //   customClass: 'myClass',
          // })
          console.log(`跳转到DraftColumn`)
          setTimeout(() => {
            this.$router.push({
              name: 'DraftColumn',
              // query: {
              //   typeDesc: 'DraftColumn'
              // }
            })
          }, 1000)
        } else {
          if (draftFlg) this.$message.success('保存成功!')
          else {
            this.sendCode()
            const h = this.$createElement
            this.$msgbox({
              message: h('div', null, [
                h('p', { class: 'title' }, '发布成功'),
                h('p', { class: 'txt' }, [
                  h('span', null, '以保存在'),
                  h(
                    'span',
                    {
                      style: 'color:#446ABD; cursor: pointer;',
                      on: {
                        click: () => {
                          this.goToRenew()
                        },
                      },
                    },
                    ' 院内模板-开启中 ',
                  ),
                  h('span', null, '查看'),
                ]),
                h('p', { class: 'txt' }, [
                  h('span', { class: 'timeDesc' }, '3'),
                  h('span', null, ' 秒 后自动跳转 '),
                  h(
                    'span',
                    {
                      style: 'color:#446ABD; cursor: pointer;',
                      on: {
                        click: () => {
                          this.cancelChange()
                        },
                      },
                    },
                    '取消',
                  ),
                ]),
              ]),
              dangerouslyUseHTMLString: true,
              type: 'success',
              customClass: 'releaseDefault',
              closeOnClickModal: false,
            })
          }
        }
      } catch (error) {
        console.log(`error`, error)
      }
    },
    sendCode() {
      this.oneMinutes = 3
      this.clock = setInterval(() => {
        this.oneMinutes--
        let tex = document.querySelector('.timeDesc')
        tex.innerHTML = this.oneMinutes
        if (this.oneMinutes === 0) {
          clearInterval(this.clock)
          tex.innerHTML = 3
          this.goToRenew()
        }
      }, 1000)
    },
    cancelChange() {
      clearInterval(this.clock)
      this.$msgbox.close()
    },
    goToRenew() {
      this.$msgbox.close()
      this.$router.push({
        name: 'InnerTemplate',
        // query: {
        //   typeDesc: 'InnerTemplate'
        // }
      })
    },
    basicTabValidate() {
      let tagFlag = false
      this.$refs.basicInforFormRef.validate((valid) => {
        if (valid) {
          console.log(`valid`, valid)
          tagFlag = true
        } else {
          console.log('error submit!!')
          tagFlag = false
        }
      })
      return tagFlag
    },
    async getTagDiseases() {
      try {
        const res = await getTagDiseases()
        console.log(`res`, res.result)
        this.diseasesOptions = res.result
        setTimeout(() => {}, 1000)
      } catch (error) {
        console.error(`error`, error)
      }
    },
    getCycleNumOptions() {
      let temp = this.cycleUnitOptions.filter((el) => el.value === this.basicInforForm.cycleUnitId)[0]
      if (temp.label === '天') {
        this.cycleNumOptions = [
          {
            label: 180,
            value: 180,
          },
          {
            label: 360,
            value: 360,
          },
        ]
      } else {
        this.cycleNumOptions = [
          {
            label: 6,
            value: 6,
          },
          {
            label: 12,
            value: 12,
          },
        ]
      }
    },
    cycleUnitIdTypeChange() {
      console.log(` this.basicInforForm.cycleUnitId `, this.basicInforForm.cycleUnitId)
      this.getCycleNumOptions()
      this.basicInforForm.cycleNum = this.cycleNumOptions[0].value;     
      this.cycleChange()   
    },
    cycleChange(){
      //val console.log(val)
      //监听
      let { cycleNum, cycleUnitId } = this.basicInforForm;
      if(cycleUnitId == '582eda772fbc4956ac3d2e12f2271290'){
        eventBus.$emit('watchChange', cycleNum) 
      } else {
        eventBus.$emit('watchChange', null) 
      }    
    }
  }  
}
</script>

<style lang="scss">
.myClass {
  border-radius: 5px;
  background-color: #000000 !important;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
}
.myClass .el-message__icon {
  display: none;
}
.myClass .el-message__content {
  font-size: 14px;
  color: rgba(255, 255, 255, 1);
}
</style>
<style lang="scss" scoped>
.PlanBasicInformation {
  height: 100%;
  background-color: #fff;
  .title {
    color: rgba(78, 89, 105, 1);
    font-size: 20px;
    position: relative;
    padding: 40px;
    &::before {
      content: '';
      position: absolute;
      left: 25px;
      width: 3px;
      height: 22px;
      margin-top: 6px;
      background-color: #134796;
    }
  }
  .basicInfor-form {
    margin-top: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
    display: flex;
    align-items: center;
    border-radius: 3px;
    height: 35px;
    ::v-deep .el-input__inner {
      border: 0 !important;
      height: 30px;
    }
    .line {
      background: #d9d9d9;
      height: 20px;
      width: 1px;
    }
  }
}
</style>
