import Vue from "vue";
import IconSvg from "@/components/IconSvg/index"; // svg组件

// register globally
Vue.component("IconSvg", IconSvg);

const req = require.context("./svg", false, /\.svg$/);
const requireAll = (requireContext) =>
  requireContext.keys().map(requireContext);
requireAll(req);
