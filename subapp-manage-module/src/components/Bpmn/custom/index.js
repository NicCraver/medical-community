import CustomPalette from "./palette";
import CustomContextPadProvider from "./contextPadProvider";

export default {
  __init__: ["paletteProvider", "contextPadProvider"],
  paletteProvider: ["type", CustomPalette],
  contextPadProvider: ["type", CustomContextPadProvider]
};
