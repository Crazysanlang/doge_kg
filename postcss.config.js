const path = require("path");
module.exports = {
  plugins: {
    tailwindcss: {},
    // 使用 cnjm-postcss-px-to-viewport 规避 postcss.plugin was deprecated 警告
    "cnjm-postcss-px-to-viewport": {
      viewportWidth: 750, // 根据设计稿设定
      minPixelValue: 1, // 最小的转换数值
      unitPrecision: 2, // 转化精度，转换后保留位数
      viewportUnit: "vw", // 转换后的单位
      fontViewportUnit: "vw", // 字体转换后的单位
      customFun: ({ file }) => {
        // 这个自定义的方法是针对处理vant组件下的设计稿为375问题
        const designWidth = path
          .join(file)
          .includes(path.join("node_modules", "vant"))
          ? 375
          : 750;
        return designWidth;
      }
    },
    autoprefixer: {
      overrideBrowserslist: ["Android >= 4.0", "iOS >= 7"]
    }
  }
};
