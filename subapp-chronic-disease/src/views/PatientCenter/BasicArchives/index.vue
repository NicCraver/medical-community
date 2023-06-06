<!--
 * @Author: Nic
 * @Date: 2023-03-29 10:22:25
 * @LastEditTime: 2023-03-31 09:43:17
 * @LastEditors: Nic
 * @Description: BasicArchives
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/PatientCenter/BasicArchives/index.vue
-->
<template>
  <div class="BasicArchives">
    <!-- <div class="sliding-tabs-container">
      <div class="sliding-tabs">
        <input type="radio" id="radio-1" name="tabs" v-model="selectedTab" value="FullInformation" />
        <label class="tab" for="radio-1">全量信息</label>
        <input type="radio" id="radio-2" name="tabs" v-model="selectedTab" value="PatientSubmission" />
        <label class="tab" for="radio-2">
          患者提交
          <span class="notification"></span>
        </label>
        <span class="spot"></span>
        <span class="glider"></span>
      </div>
    </div> -->
    <router-view></router-view>
  </div>
</template>

<script>
import SlidingTabs from '../../../components/SlidingTabs/index.vue'
export default {
  components: {
    SlidingTabs,
  },
  data() {
    return {
      selectedTab: 'FullInformation',
    }
  },
  mounted() {
    console.log(`this.$route`, this.$route.query)
  },
  watch: {
    '$route.name': {
      immediate: true,
      handler(n, o) {
        if (n !== o) {
          this.selectedTab = n
        }
      },
    },
    selectedTab(newValue, oldValue) {
      if (newValue === 'FullInformation') {
        this.$router.push({
          name: 'FullInformation',
          query: { ...this.$route.query },
        })
      } else if (newValue === 'PatientSubmission') {
        this.$router.push({
          name: 'PatientSubmission',
          query: { ...this.$route.query },
        })
      }
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.BasicArchives {
  height: 100%;
  background: #f5f5f5;
  .sliding-tabs-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    color: #919191;

    .sliding-tabs {
      display: flex;
      position: relative;
      background-color: #e7e9ed;
      // box-shadow: 0 0 1px 0 rgba(#185ee0, 0.15), 0 6px 12px 0 rgba(#185ee0, 0.15);
      padding: 4px;
      border-radius: 4px; // just a high number to create pill effect
      * {
        z-index: 2;
      }
    }

    input[type='radio'] {
      display: none;
    }

    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px;
      width: 88px;
      font-size: 14px;
      // font-weight: 500;
      border-radius: 8px; // just a high number to create pill effect
      cursor: pointer;
      transition: color 0.15s ease-in;
      position: relative;
    }

    .notification {
      display: flex;
      height: 5px;
      width: 5px;
      border-radius: 50%;
      transition: 0.15s ease-in;
      position: absolute;
      top: 6px;
      right: 10px;
      background-color: #f77602;
    }

    input[type='radio'] {
      &:checked {
        & + label {
          color: #333333;
        }
      }
    }

    input[id='radio-1'] {
      &:checked {
        & ~ .glider {
          transform: translateX(0);
        }
      }
    }

    input[id='radio-2'] {
      &:checked {
        & ~ .glider {
          transform: translateX(100%);
        }
      }
    }

    input[id='radio-3'] {
      &:checked {
        & ~ .glider {
          transform: translateX(200%);
        }
      }
    }

    .glider {
      position: absolute;
      display: flex;
      height: 30px;
      width: 88px;
      background-color: #fff;
      z-index: 1;
      border-radius: 4px; // just a high number to create pill effect
      transition: 0.25s ease-out;
    }
    @media (max-width: 700px) {
      .sliding-tabs {
        transform: scale(0.6);
      }
    }
  }
}
</style>
