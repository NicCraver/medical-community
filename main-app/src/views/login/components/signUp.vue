<template>
  <div class="signUp">
    <div class="signUp-title">质量控制中心平台</div>
    <div class="signUp-bg">
      <main class="signUp-main">
        <a-page-header title="返回" @back="goBack" />
        <div class="signUp-main-header">
          <div class="signUp-main-title">在线申请</div>
          <div class="signUp-main-subtitle">
            <span style="color: #7495e6">*</span>
            若选择医院中未有本机构，请输入机构名称并完善机构相关信息
          </div>
        </div>
        <div class="signUp-main-descriptions">
          <a-descriptions bordered>
            <a-descriptions-item label="Product">Cloud Database</a-descriptions-item>
            <a-descriptions-item label="Billing Mode">Prepaid</a-descriptions-item>
            <a-descriptions-item label="Automatic Renewal">YES</a-descriptions-item>
            <a-descriptions-item label="Order time">2018-04-24 18:00:00</a-descriptions-item>
            <a-descriptions-item label="Usage Time" :span="2">2019-04-24 18:00:00</a-descriptions-item>
            <a-descriptions-item label="Status" :span="3">
              <a-badge status="processing" text="Running" />
            </a-descriptions-item>
            <a-descriptions-item label="Negotiated Amount">$80.00</a-descriptions-item>
            <a-descriptions-item label="Discount">$20.00</a-descriptions-item>
            <a-descriptions-item label="Official Receipts">$60.00</a-descriptions-item>
            <a-descriptions-item label="Config Info">
              Data disk type: MongoDB
              <br />
              Database version: 3.4
              <br />
              Package: dds.mongo.mid
              <br />
              Storage space: 10 GB
              <br />
              Replication factor: 3
              <br />
              Region: East China 1
              <br />
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div class="signUp-main-btn">
            <a-button type="primary" @click="onlineApplication">在线申请</a-button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['changePageStatus'])

function goBack() {
  emit('changePageStatus', 'login')
}
</script>

<style lang="scss" scoped>
.signUp {
  background-color: #f7f7f7;
  height: 100vh;
  .ant-page-header {
    box-sizing: border-box;
    margin: 10px 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    font-feature-settings: 'tnum';
    position: relative;
    padding: 6px 24px;
    background-color: #fff;
  }
  .signUp-title {
    background-color: #4468bd;
    height: 150px;
    width: 100%;
    position: relative;
    color: rgba(255, 255, 255, 1);
    font-size: 24px;
    text-align: left;
    padding: 20px;
  }
  .signUp-bg {
    background-color: #fff;
    position: absolute;
    top: 100px;
    width: calc(100% - 40px);
    // height: calc(100% - 150px);
    border-radius: 4px;
    margin: 0 20px;
    .signUp-main {
      background-color: #fff;
      .signUp-main-header {
        position: relative;
        margin-bottom: 30px;
        .signUp-main-title {
          color: rgba(51, 51, 51, 1);
          font-size: 20px;
          text-align: center;
        }
        .signUp-main-subtitle {
          color: #919191;
          font-size: 12px;
          right: 20px;
          top: 20px;
          position: absolute;
        }
      }
      .signUp-main-descriptions {
        margin:0 20px;
      }
      .signUp-main-btn{
        margin: 20px 0;
      }
    }
  }
}
</style>
