<!--
 * @Author: Nic
 * @Date: 2022-04-28 14:29:40
 * @LastEditTime: 2023-01-16 10:09:14
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/subapp-template/src/App.vue
-->
<template>
  <div id="subapp-qcCenter">
    <transition name="zoom" mode="out-in">
      <router-view />
    </transition>
    <el-dialog :close-on-click-modal="false" :visible.sync="flag" width="40%" :before-close="handleClose">
      <template #title>
        <div class="dialog-title">新闻通报</div>
      </template>
      <div class="subapp-qcCenter-main">
        <div class="title">
          <!-- 禁用事件的a标签 -->
          <a href="javascript:void(0);" @click="handleGoPage">
            {{ newObj.newsName }}
          </a>
        </div>
        <div>{{ newObj.newsAlias }}</div>
        <div class="paging">
          <div class="btn">
            <el-button @click="previousPage" :disabled="pageNum === 1" icon="el-icon-arrow-left" circle></el-button>
          </div>
          <div class="btn">
            <el-button @click="nextPage" :disabled="pageNum === total" icon="el-icon-arrow-right" circle></el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ProDialog } from 'anx-vue'
import { onQueryBoardNews } from '@/api/modules/NewsManage'
export default {
  name: 'App',
  components: {
    ProDialog,
  },
  data() {
    return {
      pageNum: 1,
      flag: false,
      total: 0,
      newObj: {},
    }
  },
  watch: {
    $route(to, from) {
      // console.log('to=========', to)
      this.$setMenuPage(to.path)
    },
  },
  created() {
    this.onInquire()
  },
  mounted() {
    const arr = document.getElementsByClassName('v-modal')
    console.log('arr==============', arr)
    const l = arr.length
    if (l !== 0) {
      for (let i = l - 1; i >= 0; i--) {
        if (arr[i] != null) {
          arr[i].parentNode.removeChild(arr[i])
        }
      }
    }
  },
  methods: {
    // 系统登录时提醒 新闻
    async onInquire() {
      try {
        const res = await onQueryBoardNews({
          readFlg: 0,
          pageNum: this.pageNum,
          pageSize: 1,
        })
        console.log(`app.vue`, res.result.records)
        this.total = res.result.total
        if (res.result.records.length > 0) {
          // 判断isShowNews是否为 true
          const isShowNews = sessionStorage.getItem('isShowNews')
          if (isShowNews === 'true') {
            this.flag = false
          } else {
            this.flag = true
          }
          this.newObj = res.result.records[0]
        }
      } catch (error) {
        console.error('error', error)
      }
    },
    previousPage() {
      this.pageNum--
      this.onInquire()
    },
    nextPage() {
      this.pageNum++
      this.onInquire()
    },
    // handleClose
    handleClose() {
      this.flag = false
      // 向sessionStorage缓存中增加一个字段 用于判断是否需要弹出新闻通报
      sessionStorage.setItem('isShowNews', 'true')
    },
    handleGoPage() {
      this.flag = false
      this.$router.push({
        name: 'AnnouncementDetails', //EditPlan
        query: {
          id: this.newObj.nlId,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
#subapp-qcCenter {
  .dialog-title {
    color: #fff;
    font-size: 16px;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    padding: 8px 8px 8px 8px !important;
    background-color: #4468bd;
  }
  ::v-deep .el-icon-close:before {
    content: '\e6db';
    color: #fff;
  }
  .subapp-qcCenter-main {
    .title {
      a {
        font-size: 14px;
        color: #4468bd;
        border-bottom: 1px solid #4468bd;
        font-weight: 600;
      }
    }
    .briefIntroduction {
      font-size: 12px;
      color: #5b5b5b;
    }
    .paging {
      display: flex;
      justify-content: center;
      .btn {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        margin-left: 3px;
        margin-right: 3px;
        ::v-deep .el-button {
          width: 18px;
          height: 18px;
          padding: 0;
          border-color: #757575;
        }
        ::v-deep .is-disabled {
          border-color: #d5d5d5;
        }
        ::v-deep .el-icon-arrow-left:before {
          content: '\e6de';
          width: 18px;
          height: 18px;
          font-size: 12px;
          color: #757575;
        }
        ::v-deep .el-icon-arrow-right:before {
          content: '\e6e0';
          font-size: 12px;
          width: 18px;
          height: 18px;
          color: #757575;
        }
      }
    }
  }
}
.zoom-enter-active,
.zoom-leave-active {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-name: zoomIn;
}

.zoom-leave-active {
  animation-direction: reverse;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.95, 0.95, 0.95);
  }

  100% {
    opacity: 1;
  }
}
@keyframes zoomOut {
  0% {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: scale3d(0.95, 0.95, 0.95);
  }
}
</style>
