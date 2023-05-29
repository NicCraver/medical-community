<template>
  <div class="AnnouncementDetails">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>公告详情</template>
      <template #main>
        <div class="AnnouncementDetails-main">
          <header class="header">
            <div class="left">
              <div class="title">{{ newObj.newsName }}</div>
              <div class="download">
                <img src="@/assets/antOutline-download.png" alt="" />
              </div>
            </div>
            <div class="return" @click="$router.go(-1)">返回列表</div>
          </header>
          <div class="release">
            <div>发布人：{{ newObj.publishUserName }}</div>
            <div style="margin-left: 30px">发布时间：{{ newObj.publishDate }}</div>
          </div>
          <main>
            <el-scrollbar style="height: calc(100vh - 220px)">
              <div v-html="newObj.newsContent" style="padding: 20px 10px"></div>
            </el-scrollbar>
          </main>
        </div>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import { onReadNews } from '@/api/modules/NewsManage'
export default {
  components: { ProLayout },
  data() {
    return {
      newObj: {},
    }
  },
  async created() {
    this.onReadNews()
  },
  methods: {
    async onReadNews() {
      try {
        const res = await onReadNews({
          id: this.$route.query.id,
        })
        this.newObj = res.result
      } catch (error) {}
    },
  },
}
</script>

<style lang="scss" scoped>
.AnnouncementDetails {
  height: 100%;
  .AnnouncementDetails-main {
    background: #fff;
    height: 100%;
    padding: 20px 10px 20px 30px;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        .title {
          font-size: 20px;
          font-weight: 600;
          color: rgba(51, 51, 51, 1);
        }
        .download {
          width: 26px;
          height: 26px;
          line-height: 20px;
          border-radius: 3px;
          background-color: rgba(251, 251, 251, 1);
          text-align: center;
          border: 1px solid rgba(165, 165, 165, 1);
          cursor: pointer;
          img {
            width: 22px;
            height: 22px;
          }
        }
      }
      .return {
        cursor: pointer;
        margin-right: 10px;
        width: 80px;
        height: 30px;
        line-height: 30px;
        border-radius: 37px;
        text-align: center;
        background-color: rgba(255, 255, 255, 1);
        color: rgba(116, 149, 230, 1);
        font-size: 14px;
        border: 1px solid rgba(116, 149, 230, 1);
      }
    }
    .release {
      padding-left: 10px;
      display: flex;
      color: rgba(165, 165, 165, 1);
      font-size: 14px;
    }
  }
}
</style>
