<template>
  <div class="ReviewList">
    <ProLayout mainBgColor="#F5F5F5" padding="0" model="tab">
      <template #title>审核列表</template>
      <template #tab>
        <el-tabs v-model="activeComponent" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, index) in tabList"
            :key="index"
            :label="item.label"
            :name="item.name"
          >
          </el-tab-pane>
        </el-tabs>
      </template>
      <template #main>
        <component
          :is="activeComponent"
          @openReferDetailDrawer="openReferDetailDrawer"
          ref="activeComponent"
          @closeDrawer="closeDrawer"
          :referralInfo="referralInfo"
        />
        <ReferralDetailDrawer
          :visible.sync="referralDetailDrawerVis"
          :referralId="referralId"
          @reviewPass="onPass"
          @reviewRefuse="onBack"
          showReviewAction
        ></ReferralDetailDrawer>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from "anx-vue";
import WaitReviewList from "./ReviewListDetail/WaitReviewList.vue";
import PassReviewList from "./ReviewListDetail/PassReviewList.vue";
import BackReviewList from "./ReviewListDetail/BackReviewList.vue";
import ReferralDetailDrawer from '@/components/ReferralDetailDrawer';


export default {
  name: "ReviewList",
  components: {
    ProLayout,
    WaitReviewList,
    PassReviewList,
    BackReviewList,
    ReferralDetailDrawer
  },
  data() {
    return {
      activeComponent: "WaitReviewList",
      tabList: [
        {
          name: "WaitReviewList",
          label: "待审核",
        },
        {
          name: "PassReviewList",
          label: "审核通过",
        },
        {
          name: "BackReviewList",
          label: "审核退回",
        },
      ],
      referralDetailDrawerVis: false,
      referralId: '',
      referralInfo: {}
    };
  },
  mounted() {
    this.$EVENT_BUS.$on('noticationEmit', referralInfo => {
      this.activeComponent = 'WaitReviewList';
      if(referralInfo) {
          this.$nextTick(() => {
          this.referralInfo = referralInfo;
          this.openReferDetailDrawer(referralInfo);
        })
      }
    });
  },
  beforeDestroy() {
    this.$EVENT_BUS.$off('noticationEmit');
  },
  methods: {
    openReferDetailDrawer(row) {
      this.referralDetailDrawerVis = true;
      this.referralId = row.applyId;
    },
    closeDrawer() {
      this.referralDetailDrawerVis = false;
    },
    handleClick(tab) {
      this.activeComponent = tab.name;
    },
    onPass(referralDetail) {
      this.$refs.activeComponent.onPass && this.$refs.activeComponent.onPass(referralDetail);
    },
    onBack(referralDetail) {
      this.$refs.activeComponent.onBack && this.$refs.activeComponent.onBack(referralDetail);
    },
  },
};
</script>