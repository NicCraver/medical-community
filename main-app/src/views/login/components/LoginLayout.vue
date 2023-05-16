<template>
  <div class="anx-login-wrapper">
    <div id="back">
      <div class="backLeft-default" v-if="backgroundImage === 'default'"></div>
      <div class="backLeft-default" v-if="backgroundImage === '鹰眼观谱科技'"></div>
      <div class="backLeft-qiqihaer" v-if="backgroundImage === 'qiqihaer'"></div>
      <div class="backLeft-backstage" v-if="backgroundImage === 'backstage'"></div>
      <div class="backLeft2"></div>
    </div>
    <div id="slideBox">
      <div class="topLayer">
        <div class="right">
          <div class="login-conent">
            <div class="login-main">
              <div style="flex: 1">
                <img
                  v-if="backgroundImage === '鹰眼观谱科技'"
                  src="../../../assets/logo1.png"
                  alt=""
                  style="width: 250px; margin-bottom: 20px;margin-left: -10px;"
                />
                <img
                  v-if="backgroundImage === 'backstage'"
                  src="../../../assets/yuanxinglogo.png"
                  alt=""
                  style="
                    width: 40px;
                    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
                    border: 0px solid rgba(187, 187, 187, 100);
                    border-radius: 100%;
                    padding: 4px;
                  "
                />
                <img
                  v-if="backgroundImage === 'akesu'"
                  src="../../../assets/akesulogo.jpg"
                  alt=""
                  style="width: 250px; margin-bottom: 20px"
                />
                <div class="title">{{ titleComputed }}</div>
                <slot></slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
const store = useStore()
const props = defineProps({
  title: {
    type: String,
  },
  backgroundImage: {
    type: String,
  },
})
const titleComputed = computed(() => {
  let temp = ''
  if (
    store.state.app.appTitle === '医共体信息平台' ||
    store.state.app.appTitle === '电子病历信息平台'
  ) {
    temp = store.state.app.appTitle
  } else {
    temp = store.state.app.appTitle + ', 登录'
  }

  return temp
})
</script>

<style lang="less">
.anx-login-wrapper {
  input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
    -webkit-text-fill-color: #ededed !important;
    // -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    background-color: transparent;
    background-image: none;
    transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
  }

  input {
    background-color: transparent;
  }

  input:-webkit-autofill {
    // -webkit-box-shadow: 0 0 0px 1000px #fff inset !important; //关于解决输入框背景颜色
    -webkit-text-fill-color: rgba(0, 0, 0, 1) !important; //关于接输入框文字颜色
  }

  .ant-input-affix-wrapper .ant-input-suffix {
    display: flex;
    align-items: center;
    color: #bfbfbf;
    white-space: nowrap;
  }

  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
  overflow: hidden;
  height: 100%;

  .backLeft {
    position: absolute;
    left: 0;
    width: 60%;
    height: 100%;
    // background: url('../../../assets/login_bg.jpeg');
    // background: url('../../../assets/51371791 (1).jpg');
    background: url('../../../assets/77991655891442_.pic_hd.jpg');
    background-size: cover;
    background-position: 50% 50%;
  }

  .backLeft-default {
    position: absolute;
    left: 0;
    width: 60%;
    height: 100%;
    background: url('../../../assets/51371791 (1).jpg');
    background-size: cover;
    background-position: 50% 50%;
  }
  .backLeft-backstage {
    position: absolute;
    left: 0;
    width: 60%;
    height: 100%;
    background: url('../../../assets/51371791 (1).jpg');
    background-size: cover;
    background-position: 50% 50%;
  }
  .backLeft-qiqihaer {
    position: absolute;
    left: 0;
    width: 60%;
    height: 100%;
    background: url('../../../assets/login_bg.jpeg');
    background-size: cover;
    background-position: 50% 50%;
  }

  .backLeft2 {
    position: absolute;
    left: 46%;
    width: 40%;
    height: 100%;
    background: url('../../../assets/login-bg-s.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
  }

  #back {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -999;
  }

  #slideBox {
    width: 30%;
    max-height: 100%;
    height: 100%;
    overflow: hidden;
    margin-left: 64%;
    position: absolute;
    // box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .topLayer {
    width: 200%;
    height: 100%;
    position: relative;
    left: 0;
    left: -100%;
  }

  .left {
    width: 50%;
    height: 100%;
    background: #2c3034;
    left: 0;
    position: absolute;
  }

  .right {
    width: 50%;
    height: 100%;
    // background: #fff;
    right: 0;
    position: absolute;
  }

  .login-conent {
    width: 300px;
    margin: 0 auto;
    top: 30%;
    position: absolute;
    left: 40%;
    margin-left: -100px;
    display: flex;
    justify-content: flex-end;

    .login-main {
      display: flex;
      flex-direction: column;

      .title {
        width: 100%;
        font-size: 30px;
        font-weight: bold;
        color: #272727;
      }

      .anx-login-ruleForm {
        margin-top: 20px;
      }

      .anx-login-button {
        width: 306px;
        margin-top: 15px;
        color: #fff;
        background: #134a96 !important;
        border: 1px solid #134a96 !important;
        font-size: 18px;
      }

      .login-footer {
        position: fixed;
        margin-left: 50px;
        bottom: 0;
        text-align: center;
        padding: 20px;
      }
    }

    // @media only screen and (max-width: 1920px) {
    //   // screen and 前两个可以省略。
    //   .login-main {
    //     margin-right: 350px;
    //   }
    // }
    // @media only screen and (max-width: 1680px) {
    //   // screen and 前两个可以省略。
    //   .login-main {
    //     margin-right: 240px;
    //   }
    // }
    // @media only screen and (max-width: 1440px) {
    //   // screen and 前两个可以省略。
    //   .login-main {
    //     margin-right: 200px;
    //   }
    // }
    // @media only screen and (max-width: 1350px) {
    //   // screen and 前两个可以省略。
    //   .login-main {
    //     margin-right: 180px;
    //   }
    // }
    // @media only screen and (max-width: 1280px) {
    //   // screen and 前两个可以省略。
    //   .login-main {
    //     margin-right: 150px;
    //   }
    // }
  }

  .off {
    background: none;
    color: #03a9f4;
    box-shadow: none;
  }

  .right .off:hover {
    background: #eee;
    color: #03a9f4;
    box-shadow: none;
  }

  .left .off:hover {
    box-shadow: none;
    color: #03a9f4;
    background: #363a3d;
  }
}
</style>
