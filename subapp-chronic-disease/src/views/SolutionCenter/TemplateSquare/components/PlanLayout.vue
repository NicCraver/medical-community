<!--
 * @Author: Nic
 * @Date: 2023-02-01 10:48:58
 * @LastEditTime: 2023-02-09 15:11:53
 * @LastEditors: Nic
 * @Description: PlanLayout
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/components/PlanLayout.vue
-->
<template>
  <div class="IndexPlan">
    <div class="ip-left">
      <header class="ip-left-header">
        <slot name="leftHeader" />
      </header>
      <footer class="ip-left-footer">
        <slot name="leftFooter1" />
        <div class="ip-left-footer-item2">
          <slot name="leftFooter2" />
        </div>
      </footer>
    </div>
    <div class="ip-right">
      <slot name="ipRight" />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.IndexPlan {
  display: flex;
  background-color: #F5F5F5;
  height: calc(100vh - 48px);
  // padding: 10px;
  .ip-left {
    width: 200px;
    height: 100%;
    margin-right: 10px;
    .ip-left-header {
      background-color: #fff;
      padding: 10px 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    }
    .ip-left-footer {
      margin-top: 15px;
      width: 200px;
      .ip-left-footer-item1 {
        display: flex;
        justify-content: center;
        color: rgba(184, 185, 188, 1);
        font-size: 12px;
        line-height: 20px;
        .ip-left-footer-item1-btn {
          cursor: pointer;
          text-align: center;
        }
        .line {
          height: 20px;
          margin: 0 20px;
          width: 1px;
          background-color: rgba(0, 0, 0, 0.1);
        }
      }

      .ip-left-footer-item2 {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .ip-right {
    flex: 1;
    height: 100%;
  }
}
</style>
