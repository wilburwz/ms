import type { KnowledgePoint } from '../types'

export const mobileData: KnowledgePoint[] = [
  {
    id: "mob-01",
    title: "移动端适配方案",
    category: "mobile",
    difficulty: 2,
    question: "前端移动端适配有哪些方案？各自的优缺点？",
    answer: '移动端适配的核心是 viewport + rem/vw + 媒体查询。viewport meta 标签是第一步——width=device-width, initial-scale=1，让页面按设备宽度渲染。淘宝的 flexible 方案用 rem 配合根字体大小缩放。现在更推荐 vw/vh 方案——直接用视口百分比，配合 clamp() 做最小/最大限制。媒体查询处理不同断点的布局差异。',
    codeExample: "/* VW 方案 */\n/* postcss-px-to-viewport 配置 */\n/* viewportWidth: 375, unitPrecision: 5 */\n\n/* 设计稿 375px，元素 100px → 自动转为 vw */\n.btn {\n  width: 100px;  /* 编译后: 26.66667vw */\n}\n\n/* 1px 边框 */\n.border-1px {\n  position: relative;\n}\n.border-1px::after {\n  content: '';\n  position: absolute;\n  border: 1px solid #ddd;\n  transform: scaleY(0.5);\n}",
    tags: ["移动端", "适配", "rem", "vw", "1px"],
  },
  {
    id: "mob-02",
    title: "跨端方案对比：RN vs Flutter vs 小程序",
    category: "mobile",
    difficulty: 2,
    question: "React Native、Flutter 和小程序各自的优缺点？",
    answer: '1px 边框问题：设计师想要的 1px 在 Retina 屏上显示 2-3 个物理像素，看起来像 2px。解决方案：transform: scale(0.5) 把边框缩小一半、用 box-shadow 模拟细线、用伪元素 + transform 画边框然后缩放到 0.5。移动端还有个 300ms 点击延迟问题——浏览器等 300ms 判断是否双击缩放。用 viewport meta 加 user-scalable=no 或 fastclick 库解决。现代移动端浏览器已逐步修复。',
    tags: ["移动端", "React Native", "Flutter", "小程序", "跨端"],
  },
  {
    id: "mob-03",
    title: "移动端性能优化与踩坑",
    category: "mobile",
    difficulty: 2,
    question: "移动端特有的性能问题和常见坑有哪些？",
    answer: '移动端手势操作：touchstart/touchmove/touchend 三个事件。判断滑动方向——对比起始和结束的坐标差，水平差 > 垂直差就是横滑，反之竖滑。判断滑动距离决定是否触发操作。双指缩放用 e.touches 两个点的距离变化。实际开发中用 Hammer.js 或 @use-gesture 库——它们处理了复杂的多点触摸和手势识别。',
    tags: ["移动端", "性能", "兼容性", "iOS"],
  },
  {
    id: "mob-04",
    title: "Hybrid App 与 JSBridge",
    category: "mobile",
    difficulty: 2,
    question: "Hybrid App 的架构？JSBridge 的通信原理？",
    answer: '移动端 JSBridge 是 H5 和原生 App 通信的桥梁。原理：原生注入一个全局对象（window.JSBridge），H5 调 JSBridge.call(method, params, callback)，原生收到后执行对应方法并回调。反过来原生也可以调 H5 的函数。常见用途：获取设备信息、调用原生相机/相册、打开原生页面、分享到社交平台。微信 JS-SDK 也是类似原理。',
    tags: ["Hybrid", "JSBridge", "WebView", "跨端"],
  }
]
