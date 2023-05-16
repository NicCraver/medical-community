<!--
 * @Author: Nic
 * @Date: 2023-02-22 15:43:36
 * @LastEditTime: 2023-03-02 11:06:50
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/components/ProgramCardItem.vue
-->
<template>
  <div class="ProgramCardItem">
    <div class="template-item-new" v-if="cardData.newFlgType === 1 || cardData.newFlgType === 2">
      <img src="@/assets/triangle-new.png" alt="" srcset="" />
    </div>
    <div class="template-item-new" v-if="cardData.newFlgType === 1">
      <img src="@/assets/NEW.png" alt="" srcset="" />
    </div>
    <div class="template-item-new" v-if="cardData.newFlgType === 2">
      <img src="@/assets/update.png" alt="" srcset="" />
    </div>
    <header class="item-header">
      <div class="item-header-left" :style="{ backgroundColor: cardData.backgroundColor }">
        {{ cardData.tagDiseaseDesc }}
      </div>
      <div class="item-header-right">
        <div class="item-header-right-header">
          <div style="display: flex">
            <div
              class="title"
              :title="cardData.name"
              :style="routeName === '院内模版' ? 'max-width: 180px;' : 'max-width: 230px;'"
            >
              {{ cardData.name }}
            </div>
            <div class="ji pl-5">集</div>
          </div>
          <div style="height: 20px" v-if="routeName === '院内模版'">
            <div class="switch" >
              <input :id="cardData.id" class="input" v-model="checked" type="checkbox" @click="onEnableDisable(cardData)" :disabled="switchDisabled" />
              <label :for="cardData.id" class="slider"></label>
            </div>
          </div>
        </div>
        <div class="pt-5 flex-c">
          <div>
            <IconSvg iconClass="stethoscope" style="height: 16px; width: 16px"></IconSvg>
            <span class="text2"> 适配病种 </span>
            <span class="pl-10 text bold">
              {{ cardData.tagDiseaseDesc }}
            </span>
          </div>
          <div class="pr-15" v-if="routeName !== '平台模版'">
            <span class="pl-10">
              <img style="width: 30px" src="@/assets/man.png" alt="" />
            </span>
            <span class="pl-10 text3"> {{ cardData.createUserName }} </span>
          </div>
        </div>
        <div v-if="routeName !== '草稿栏'" class="pt-5 flex-c">
          <div>
            <IconSvg iconClass="bushubanben" style="height: 16px; width: 16px"></IconSvg>
            <span class="text2"> 当前版本 </span>
            <span class="pl-10 text">
              {{ cardData.versionNo }}
            </span>
          </div>
        </div>
      </div>
    </header>
    <main
      class="overflow-hidden"
      :style="
        tagsHeight > tag2Height
          ? `max-height:${tagHeight}px;min-height:${tagHeight}px`
          : `max-height:${tagHeight}px;min-height:${tagHeight}px`
      "
    >
      <div class="item-main" :ref="'tagsRef' + cardIndex">
        <div
          class="item-main-block"
          :style="{
            backgroundColor: item.bg,
            color: item.color,
          }"
          :ref="'tagRef' + cardIndex"
          v-for="item in cardData.diseasePerNames"
        >
          {{ item.name }}
        </div>
      </div>
    </main>
    <footer class="item-footer">
      <div v-if="tagsHeight > tag2Height" class="more text2" @click="handleEnter()">
        {{ !isExpand ? '更多' : '收起' }}
      </div>
    </footer>
    <div class="item-btns">
      <el-button type="text" @click="editTemplate(cardData)" v-if="cardData.modifyDraftBtn">编辑草稿</el-button>
      <div class="item-line" v-if="cardData.modifyDraftBtn"></div>
      <el-button type="text" @click="quoteTemplate(cardData, 1)" :loading="loading" v-if="cardData.createDraftBtn"
        >创建草稿</el-button
      >
      <div class="item-line" v-if="cardData.createDraftBtn"></div>
      <el-button type="text" @click="quoteTemplate(cardData, 0)" v-if="cardData.quoteBtn">引用</el-button>
      <div class="item-line" v-if="cardData.quoteBtn"></div>
      <el-button type="text" @click="quoteTemplate(cardData, 0)" v-if="cardData.quoteAgainBtn">再次引用</el-button>
      <div class="item-line" v-if="cardData.quoteAgainBtn"></div>
      <el-button
        type="text"
        @click="viewTemplate(cardData)"
        v-if="routeName === '平台模版' || routeName === '院内模版'"
      >
        查看
      </el-button>
      <el-button type="text" @click="delTemplate(cardData)" v-if="routeName === '草稿栏'">删除</el-button>
    </div>
    <el-dialog
      :visible.sync="successDialogVisible"
      width="286px"
      class="success-dialog"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="dialog-body">
        <div><img src="@/assets/md-check_circle.png" alt="" srcset="" /></div>
        <div class="text1">引用成功！</div>
        <div>
          <span class="text2">已保存在</span>
          <span class="text3">院内模版-关闭中</span>
          <span>查看</span>
        </div>
        <div style="display: flex; padding-top: 30px">
          <el-statistic
            style="color: #f56c6c"
            ref="statistic"
            @finish="hilarity"
            format="ss"
            :value="deadline4"
            time-indices
          >
          </el-statistic>
          <span class="text4">秒后</span>
          <span class="text5">自动跳转</span>
          <span class="text6" @click="onCancel">取消</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { onQuoteJmPlan, onChangeJmPlanStatusById, onDelJmPlanById } from '../../../../api/modules/SolutionCenter'

const tabDatas = [
  {
    label: '院内模版',
    component: 'InnerTemplate',
  },
  {
    label: '草稿栏',
    component: 'DraftColumn',
  },
  {
    label: '平台模版',
    component: 'PlatformTemplate',
  },
]
const tagsColor = [
  {
    bg: '#FEF1F6',
    color: '#ED47A3',
  },
  {
    bg: '#F6FFEC',
    color: '#70CE46',
  },
  {
    bg: '#E6FFFB',
    color: '#1DC5C4',
  },
  {
    bg: '#E7F6FF',
    color: '#2E9AFF',
  },
  {
    bg: '#FFF2E8',
    color: '#FA561F',
  },
]

export default {
  props: {
    cardData: {
      type: Object,
    },
    cardIndex: {
      type: Number,
    },
  },
  inject: ['onInquire', 'resetInitIndex'],
  data() {
    return {
      checked: false,
      deadline4: Date.now() + 1000 * 4,
      loading: false,
      isCancel: false,
      successDialogVisible: false,
      isExpand: false,
      overflowHidden: 'overflow-hidden',
      tagsHeight: 0,
      tag2Height: 0,
      tagHeight: 64,
      switchDisabled: false,
      value: '',
      diseasePerNames: [
        '法师',
        '法师',
        '法师',
        '法师',
        '法师',
        '法师',
        '法师',
        '法师法师法师法师法师',
        '法师法师法师法师',
        '法师法师法师',
        '法师法师法师',
        '法师法师法师',
        '法师法师法师',
        '法师法师法师',
        '法师法师法师',
        '法师法师法师',
        '法师法师法师',
        '法师法师法师',
        '法师法师法师',
      ],
    }
  },
  computed: {
    routeName() {
      return tabDatas.filter((el) => el.component === this.$route.name)
        ? tabDatas.filter((el) => el.component === this.$route.name)[0].label
        : ''
    },
  },
  watch: {
    cardData: {
      immediate: true,
      handler() {
        if (typeof this.cardData.diseasePerNames[0] === 'string') {
          let index = -1
          let arr = []
          for (let i = 0; i < this.cardData.diseasePerNames.length; i++) {
            index++
            if (index > tagsColor.length - 1) {
              index = 0
            }
            arr.push({
              name: this.cardData.diseasePerNames[i],
              bg: tagsColor[index].bg,
              color: tagsColor[index].color,
            })
          }
          this.cardData.diseasePerNames = arr
        }
        this.checked = this.cardData.status === 0
        // console.log(`ProgramCardItem - cardData ====`, this.cardData)
        this.$nextTick(() => {
          // console.log(`this.$refs['tagsRef' + this.cardIndex]`, this.$refs['tagsRef' + this.cardIndex])
          // console.log(`this.$refs['tagRef' + this.cardIndex]`, this.$refs['tagRef' + this.cardIndex])
          if (this.$refs['tagsRef' + this.cardIndex] && this.$refs['tagRef' + this.cardIndex]) {
            this.tagsHeight = this.$refs['tagsRef' + this.cardIndex].offsetHeight
            this.tag2Height = (this.$refs['tagRef' + this.cardIndex][0].offsetHeight + 10) * 2
            this.tagHeight = this.tag2Height
          }
          console.log(`this.tagHeiht`, this.tagHeight)
        })
      },
    },
  },
  methods: {
    onCancel() {
      this.isCancel = true
      this.successDialogVisible = false
    },
    hilarity() {
      if (!this.isCancel) {
        this.$emit('quoteTemplateSuccess')
      }
      this.successDialogVisible = false
    },
    handleEnter() {
      this.isExpand = !this.isExpand
      if (this.isExpand) {
        // this.overflowHidden = ''
        this.tagHeight = this.tagsHeight
      } else {
        // this.overflowHidden = 'overflow-hidden'
        this.tagHeight = (this.$refs['tagRef' + this.cardIndex][0].offsetHeight + 10) * 2
      }
    },
    handleLeave() {
      this.overflowHidden = 'overflow-hidden'
      this.tagHeight = (this.$refs['tagRef' + this.cardIndex][0].offsetHeight + 10) * 2
    },
    async onEnableDisable(val) {
      console.log(`val`, JSON.parse(JSON.stringify(val)))
      this.switchDisabled = true
      try {
        await onChangeJmPlanStatusById({ id: val.id })
        this.$emit('refreshData')
        setTimeout(() => {
          this.switchDisabled = false
        }, 1000)
      } catch (error) {
        this.switchDisabled = false
        console.log(`error`, error)
      }
    },
    editTemplate(row) {
      if (this.routeName === '院内模版') {
        this.$router.push({
          name: 'EditPlan', //EditPlan
          query: {
            routeName: this.routeName,
            planId: row.draftId,
          },
        })
      } else {
        this.$router.push({
          name: 'EditPlan', //EditPlan
          query: {
            routeName: this.routeName,
            planId: row.id,
          },
        })
      }
    },
    viewTemplate(row) {},
    async delTemplate(row) {
      const api = async () => {
        try {
          const res = await onDelJmPlanById({ id: row.id })
          console.log(`res`, res)
          this.$message({
            message: '删除成功',
            type: 'success',
          })
          this.resetInitIndex()
          this.onInquire()
        } catch (error) {
          console.log(`error`, error)
        }
      }
      this.$confirm('是否确认删除草稿。删除后不支持撤回。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          api()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消引用',
          })
        })
    },
    // 引用模板
    async quoteTemplate(row, quoteType) {
      // quoteType 1创建 0引用
      const api = async () => {
        try {
          const res = await onQuoteJmPlan({
            id: row.id,
            quoteType,
          })
          this.onInquire()
          if (quoteType === 1) {
            this.$message({
              message: `<div>已保存至草稿栏</div><div style='margin-top:10px'>正在前往"草稿编辑"界面...</div>`,
              dangerouslyUseHTMLString: true,
              customClass: 'messageClass',
              iconClass: '1',
              duration: 1000,
              offset: 300,
            })
            setTimeout(() => {
              this.loading = false
              this.$emit('changePage', res.result)
            }, 800)
            return
          }
          this.isCancel = false
          this.successDialogVisible = true
          this.deadline4 = Date.now() + 1000 * 4
          console.log(`onQuoteJmPlan`, onQuoteJmPlan)
        } catch (error) {
          this.loading = false
          console.log(`error`, error)
        }
      }

      if (quoteType === 1) {
        this.loading = true
        api()
        return
      }

      this.$confirm('是否确认引用该方案。引用后不支持撤回。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          api()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消引用',
          })
        })
      // console.log(`row`, row)
      // console.log(`row.id`, row.id)
    },
  },
}
</script>

<style lang="scss" scoped>
.ProgramCardItem {
  .pl-5 {
    padding-left: 5px;
  }
  .pl-10 {
    padding-left: 10px;
  }
  .pt-5 {
    padding-top: 5px;
  }
  .pr-15 {
    padding-right: 15px;
  }
  .flex-c {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .text {
    color: rgba(44, 146, 246, 1);
    font-size: 12px;
  }
  .text2 {
    color: rgba(153, 153, 153, 1);
    font-size: 12px;
  }
  .text3 {
    color: rgba(100, 100, 100, 1);
    font-size: 12px;
  }
  .bold {
    font-weight: bold;
  }
  padding-left: 10px;
  margin: 20px 20px 0 0;
  position: relative;
  width: 390px;
  // height: 255px;
  background-color: rgba(255, 255, 255, 1);
  // color: rgba(16, 16, 16, 1);
  // font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(233, 233, 233, 1);
  border-radius: 4px;
  .template-item-new {
    position: absolute;
    left: 0;
    top: 0;
    img {
      border-top-left-radius: 3px;
    }
  }
  .item-header {
    display: flex;
    padding: 15px 0 0 20px;
    .item-header-left {
      width: 83px;
      height: 82px;
      line-height: 82px;
      text-align: center;
      border-radius: 200px;
      background-color: rgba(44, 147, 246, 1);
      color: rgba(255, 255, 255, 1);
      font-size: 18px;
      font-weight: bold;
    }
    .item-header-right {
      padding-left: 20px;
      flex: 1;
      .item-header-right-header {
        max-width: 255px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .title {
        color: rgba(16, 16, 16, 1);
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .ji {
        color: rgba(204, 204, 204, 1);
        font-size: 16px;
        padding-left: 5px;
      }
    }
  }
  .item-main {
    display: flex;
    flex-wrap: wrap;
    // margin-top: 10px;
    padding: 0 0 0 15px;
    // max-height: 64px;
    overflow: hidden;

    .item-main-block {
      margin-top: 10px;
      height: 22px;
      line-height: 22px;
      text-align: center;
      padding: 0 10px;
      border-radius: 4px;
      // background-color: rgba(255, 242, 232, 1);
      // color: rgba(250, 86, 31, 1);
      margin-right: 10px;
    }
  }
  .item-footer {
    // margin-top: 10px;
    padding-left: 15px;
    padding-bottom: 2px;
    border-bottom: 1px solid #d9d9d9;
    height: 24px;
    .more {
      display: flex;
      justify-content: flex-end;
      padding-right: 10px;
      font-size: 10px;
      cursor: pointer;
    }
  }
  .item-btns {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 3px 0;
    .item-line {
      background: #d9d9d9;
      height: 20px;
      width: 1px;
      margin: 0 70px;
    }
  }

  .overflow-hidden {
    overflow: hidden;
    transition: all 0.2s linear;
    // max-height: 64px;
  }

  .template-item:hover {
    border: 1px solid rgba(87, 153, 228, 1);
  }

  $switch-on-color: #5a7bf4 !default;
  $slider-on-color: lighten($switch-on-color, 20%) !default;

  $switch-off-color: #ffffff;
  $slider-off-color: #cccccc;

  // Sizes
  $slider-height: 8px !default;
  $slider-width: $slider-height * 4 !default; // 32px
  $switch-height: $slider-height * 3 !default; // 24px
  $switch-width: $switch-height !default; // 24px
  $switch-shift: $slider-height !default; // 8px

  // Transitions
  $transition-duration: 0.2s !default;
  $transition-function: ease !default;
  $transition: all $transition-duration $transition-function !default;

  .switch {
    // width: 100px;
    // display: block;
    // margin-top: $switch-height;
    margin-right: 10px;

    .slider {
      position: relative;
      display: inline-block;
      // height: $slider-height;
      height: 15px;
      width: $slider-width;
      border-radius: $slider-height;
      cursor: pointer;
      background: $slider-off-color;
      transition: $transition;

      &:after {
        background: $switch-off-color;
        position: absolute;
        left: -$switch-shift;
        top: -3px;
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        box-shadow: 0px 2px 2px rgba(#000, 0.2);
        content: '';
        transition: $transition;
      }
    }

    label {
      margin-right: 7px;
    }

    .input {
      display: none;

      ~ .label {
        margin-left: $slider-height;
      }

      &:checked ~ .slider {
        &:after {
          left: $slider-width - $switch-width + $switch-shift;
        }
      }
    }

    .input:checked ~ .slider {
      background: $slider-on-color;

      &:after {
        background: $switch-on-color;
      }
    }
  }
  .success-dialog {
    .dialog-body {
      height: 234px;
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 1);
      color: rgba(78, 89, 105, 1);
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column;
      .text1 {
        padding-top: 15px;
        color: rgba(16, 16, 16, 1);
        font-size: 20px;
      }
      .text2 {
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        padding-bottom: 20px;
      }
      .text3 {
        color: #2d92f6;
        font-size: 14px;
        padding: 0 5px;
      }
      .text4 {
        color: #101010;
        font-size: 14px;
        padding: 0 4px;
      }
      .text5 {
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
      }
      .text6 {
        color: #2d92f6;
        font-size: 14px;
        cursor: pointer;
        text-decoration: underline;
        padding-left: 5px;
      }
    }
    ::v-deep .el-dialog {
      display: flex;
      flex-direction: column;
      margin: 0 !important;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-height: calc(100% - 30px);
      max-width: calc(100% - 30px);
    }
    ::v-deep .el-dialog .el-dialog__body {
      flex: 1;
      overflow: auto;
    }
    ::v-deep .el-dialog__body {
      padding: 0;
      color: #606266;
      font-size: 14px;
      word-break: break-all;
    }
    ::v-deep .el-dialog__footer {
      text-align: center;
      border-top: none !important;
    }
    ::v-deep .el-dialog__header {
      display: none !important;
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
  }
}
</style>
