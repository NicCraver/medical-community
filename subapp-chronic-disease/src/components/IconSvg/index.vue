<template>
  <svg
    class="svg-icon"
    aria-hidden="true"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: "icon-svg",
  props: {
    width: {
      type: String,
      default: "22",
    },
    height: {
      type: String,
      default: "22",
    },
    iconClass: {
      type: String,
      required: true,
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`;
    },
  },
};
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
