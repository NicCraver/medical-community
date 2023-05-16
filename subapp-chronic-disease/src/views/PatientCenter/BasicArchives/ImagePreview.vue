<!--
 * @Author: Nic
 * @Date: 2023-04-12 14:01:50
 * @LastEditTime: 2023-04-13 14:14:24
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/PatientCenter/BasicArchives/ImagePreview.vue
-->
<template>
  <div class="image-preview">
    <header class="image-container">
      <div class="image-left">
        <el-scrollbar style="height: 100%">
          <div class="image-card" :class="{ active: active === index }" v-for="(v, index) in images">
            <img :src="v" alt="" />
          </div>
        </el-scrollbar>
      </div>
      <div class="image-right">
        <img :src="images[0]" alt="image" style="height: 100%; width: 100%" />
      </div>
      <div class="image-bottom">
        <div class="btns">
          <div class="btn-bg">
            <i class="el-icon-zoom-in"></i>
          </div>
          <div class="btn-bg">
            <i class="el-icon-zoom-out"></i>
          </div>
        </div>
        <div class="btn-page">
          <i class="el-icon-arrow-left"></i>
          <div>1/3</div>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="btns">
          <div class="btn-bg">
            <img src="@/assets/xiconPark-rotate.png" alt="" />
          </div>
          <div class="btn-bg btn-bg2" @click="identifyImages()">
            <img src="@/assets/xiconPark-scanning.png" alt="" />
          </div>
        </div>
      </div>
    </header>
    <main class="image-text">
      <el-scrollbar style="height: calc(100% - 70px)">
        <div class="all-text">
          <dir v-for="v in identificationResults">
            <span>{{ v }}</span>
          </dir>
        </div>
      </el-scrollbar>
      <div style="height:height: 40px;">
        <template v-for="v in btns">
          <el-button
            class="mini-btn"
            type="primary"
            size="mini"
            v-if="selectedBtn === v.text"
            :disabled="v.disabled"
            @click="scrollToElement(v.text)"
          >
            {{ v.text }}
          </el-button>
          <el-button
            class="mini-btn"
            type="primary"
            size="mini"
            v-if="selectedBtn !== v.text"
            :disabled="v.disabled"
            plain
            @click="scrollToElement(v.text)"
          >
            {{ v.text }}
          </el-button>
        </template>
      </div>
    </main>

    <!-- filePathId -->
  </div>
</template>

<script>
import { getFileOcrResult } from '@/api/modules/BasicArchives/index.js'
export default {
  components: {},
  props: {
    seekDialogData: {
      type: Object,
    },
  },
  data() {
    return {
      identificationResults: [],
      selectedBtn: '',
      btns: [
        { text: '现病史', disabled: true },
        { text: '既往史', disabled: true },
        { text: '诊断', disabled: true },
        { text: '过敏史', disabled: true },
        { text: '家族史', disabled: true },
      ],
      active: 0, // 当前选中的图片
      currentImage: 'https://picsum.photos/id/1000/800/600',
      images: ['https://picsum.photos/id/1000/800/600', 'https://picsum.photos/id/1001/800/600'], // 存放所有图片
    }
  },
  mounted() {},
  methods: {
    // 定位元素
    scrollToElement(text) {
      this.selectedBtn = text
      const targetElement = document.querySelector('.all-text')
      let temp = null
      targetElement.childNodes.forEach((el) => {
        if (el.innerText.includes(text)) {
          temp = el
        }
      })
      // 将页面滚动到该元素的顶部
      temp.scrollIntoView({ behavior: 'smooth' })
    },
    // 识别图片
    async identifyImages() {
      try {
        const res = await getFileOcrResult({
          filePathId: this.seekDialogData.files[0].filePathId,
        })
        this.identificationResults = res.result.ocrResult
        this.$nextTick(() => {
          const targetElement = document.querySelector('.all-text')
          targetElement.childNodes.forEach((el) => {
            this.btns.forEach((item) => {
              if (el.innerText.includes(item.text)) {
                item.disabled = false
              }
            })
          })
        })
      } catch (error) {
        console.log(`error`, error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.image-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
  // ::v-deep .el-button--primary:focus,
  // .el-button--primary:hover {
  //   background: #446bbd;
  // }
  // ::v-deep .el-button--primary.is-plain {
  //   color: #446bbd !important;
  // }
  // ::v-deep .el-button--primary.is-disabled {
  //   color: #446abd7b !important;
  // }
  // ::v-deep .mini-btn.el-button--primary {
  //   border-color: #446abd;
  //   background-color: #446abd;
  //   padding: 0;
  // }
  ::v-deep .mini-btn.el-button--default .is-plain {
    // border-color: #446abd;
    // color: #446abd !important;
    // background-color: #fff;
    // padding: 0;
  }
  ::v-deep .mini-btn.el-button--default.is-plain.is-disabled {
    // border-color: rgba(145, 145, 145, 1);
    // background-color: #fff;
  }
  .image-container {
    position: relative;
    flex: 1;
    max-height: 50%;
    display: flex;
    background-color: #f6f7fb;
    border: 1px solid rgba(187, 187, 187, 1);
    border-radius: 2px;
    .image-left {
      padding: 10px 5px 40px 10px;
      .image-card {
        margin-bottom: 10px;
        margin-right: 15px;
        width: 100px;
        height: 120px;
        border-radius: 2px;
        background-color: rgba(255, 255, 255, 1);
        border: 1px solid rgba(187, 187, 187, 1);
        cursor: pointer;
        // 选中边框蓝色
        &.active {
          border: 3px solid #5381e3;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .image-right {
      padding: 10px;
    }
    .image-bottom {
      width: 100%;
      position: absolute;
      bottom: 0;
      height: 40px;
      line-height: 40px;
      background-color: rgba(51, 51, 51, 0.3);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      .btns {
        display: flex;
      }
      .btn-page {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: rgba(255, 255, 255, 1);
        font-size: 14px;
        background-color: #5b5b5b;
        height: 24px;
        border-radius: 4px;
        i {
          color: #fff;
        }
      }
      .btn-bg {
        width: 24px;
        height: 24px;
        background-color: #5b5b5b;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        border-radius: 4px;
        cursor: pointer;
        i {
          color: #fff;
        }
        img {
          width: 18px;
          height: 18px;
        }
      }
      .btn-bg2 {
        background-color: #4468bd;
      }
    }
  }
  .image-text {
    max-height: 50%;
    flex: 1;
  }
}
</style>
