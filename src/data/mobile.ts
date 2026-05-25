import type { KnowledgePoint } from '../types'

export const mobileData: KnowledgePoint[] = [
  {
    id: "mob-01",
    title: "移动端适配方案",
    category: "mobile",
    difficulty: 2,
    question: "前端移动端适配有哪些方案？各自的优缺点？",
    answer: "1. Rem 适配：\n   - 设置根元素 font-size = 屏幕宽度 / 设计稿宽度 * 100\n   - 元素用 rem 单位\n   - 需要 JS 动态计算\n\n2. VW 适配（推荐）：\n   - 1vw = 屏幕宽度 1%\n   - postcss-px-to-viewport 自动转换\n   - 纯 CSS 方案，无需 JS\n\n3. vw + rem 组合：\n   - 根元素 font-size 用 vw\n   - 元素用 rem\n\n4. 响应式媒体查询：\n   - @media 断点适配\n\n5. 弹性盒 + 百分比：\n   - Flex/Grid + % 混合布局\n\n特殊处理：\n- 1px 边框：transform: scaleY(0.5)\n- 安全区域：env(safe-area-inset-*)\n- viewport meta 设置",
    codeExample: "/* VW 方案 */\n/* postcss-px-to-viewport 配置 */\n/* viewportWidth: 375, unitPrecision: 5 */\n\n/* 设计稿 375px，元素 100px → 自动转为 vw */\n.btn {\n  width: 100px;  /* 编译后: 26.66667vw */\n}\n\n/* 1px 边框 */\n.border-1px {\n  position: relative;\n}\n.border-1px::after {\n  content: '';\n  position: absolute;\n  border: 1px solid #ddd;\n  transform: scaleY(0.5);\n}",
    tags: ["移动端", "适配", "rem", "vw", "1px"],
  },
  {
    id: "mob-02",
    title: "跨端方案对比：RN vs Flutter vs 小程序",
    category: "mobile",
    difficulty: 2,
    question: "React Native、Flutter 和小程序各自的优缺点？",
    answer: "React Native：\n- JS/TS 开发，React 语法\n- 原生组件渲染\n- 热更新\n- 性能不如原生\n- 生态成熟\n\nFlutter：\n- Dart 语言\n- 自绘引擎，性能接近原生\n- 一套代码多端运行\n- 体积较大\n- 学习曲线\n\n小程序：\n- 微信生态，无需安装\n- WXML/WXSS/JS\n- 性能受限（WebView + 原生组件）\n- 获客成本低\n\n跨端框架：\n- Taro：React 语法，多端适配\n- Uni-app：Vue 语法，多端适配\n\n选择：\n- 纯移动端追求性能 → Flutter\n- Web 团队 → RN\n- 国内市场 → 小程序 + Taro/Uni-app",
    tags: ["移动端", "React Native", "Flutter", "小程序", "跨端"],
  },
  {
    id: "mob-03",
    title: "移动端性能优化与踩坑",
    category: "mobile",
    difficulty: 2,
    question: "移动端特有的性能问题和常见坑有哪些？",
    answer: "常见问题：\n1. 300ms 点击延迟：touch-action: manipulation\n2. iOS 橡皮筋效果：overscroll-behavior: none\n3. 软键盘遮挡：visualViewport API\n4. 滚动卡顿：-webkit-overflow-scrolling: touch\n5. 点击穿透：touchend → click 延迟\n6. 高清屏 1px 边框问题\n7. 固定定位在软键盘弹出时失效\n\n性能优化：\n- 被动事件监听：{ passive: true }\n- 减少重排重绘\n- 图片懒加载 + WebP\n- 虚拟列表\n- 骨架屏\n- 预加载关键资源\n\n安全区域：\n- env(safe-area-inset-top)\n- viewport-fit=cover",
    tags: ["移动端", "性能", "兼容性", "iOS"],
  },
  {
    id: "mob-04",
    title: "Hybrid App 与 JSBridge",
    category: "mobile",
    difficulty: 2,
    question: "Hybrid App 的架构？JSBridge 的通信原理？",
    answer: "Hybrid App 架构：\n- Native Shell + WebView 容器\n- Web 页面运行在 WebView 中\n- Native 提供能力（相机、定位、支付等）\n\nJSBridge 通信原理：\n\nJS → Native：\n1. URL Scheme 拦截（旧方案）\n2. prompt/console.log 拦截\n3. WebView.addJavascriptInterface (Android)\n4. WKWebView.messageHandlers (iOS)\n\nNative → JS：\n1. evaluateJavascript\n2. loadUrl(\"javascript:...\")\n\n通信协议：\n{ handlerName: 'getUserInfo', data: {}, callbackId: 'cb_1' }\n\n常见框架：\n- DSBridge\n- JsBridge\n- WebViewJavascriptBridge",
    tags: ["Hybrid", "JSBridge", "WebView", "跨端"],
  }
]
