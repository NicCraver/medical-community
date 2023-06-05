<template>
  <div class="cardtitle">
    <div class="cardtitle-bar"></div>
    <div class="titleleft">
      <slot name="left"></slot>
    </div>
    <div class="titleright">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "LCardTitle",
  data() {
    return {};
  }
};
</script>

<style  lang="scss">
.cardtitle {
  display: flex;
  align-items: center;
  background: $l-color-white;
  height: auto;
  .titleleft {
    flex: 1;
    overflow: hidden;
    color: $l-color-fontcolor-3;
    font-size: $l-font-size;
    font-weight: 700;
  }
  .titleright {
    margin-left: $l-margin-default-5;
  }
  .cardtitle-bar {
    width: 4px;
    height: 14px;
    background: $l-color-bgcolor-4;
    margin-right: $l-margin-default-4;
  }
}

@media screen and (max-width: $resolution-ratio-width) {
  .cardtitle {
    .titleleft {
      font-size: $l-font-size;
    }
  }
}
</style>
