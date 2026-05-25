import type { KnowledgePoint } from '../types'

export const integrationData: KnowledgePoint[] = [
  {
    id: "int-01",
    title: "OAuth2 三方登录流程",
    category: "integration",
    difficulty: 2,
    question: "请描述 OAuth2 授权码模式 (Authorization Code) 的完整流程。",
    answer: "OAuth2 授权码流程（最安全的模式）：\n\n1. 用户点击 \"Google 登录\"\n2. 跳转到 Google 授权页面（携带 client_id, redirect_uri, scope 等）\n3. 用户同意授权\n4. Google 重定向回我们的 redirect_uri，并附带 authorization code\n5. 后端用 code + client_secret 向 Google 换取 access_token\n6. 后端用 access_token 调用 Google API 获取用户信息\n7. 后端创建/登录用户，返回自己系统的 token\n\n为什么需要后端参与？\n- client_secret 不能暴露在前端\n- access_token 应保存在服务端\n\n前端职责：\n- 拼接授权 URL 并跳转\n- 接收回调参数（code）\n- 调用后端接口完成登录\n\nPKCE 扩展（Proof Key for Code Exchange）：\n- 适用于无后端或单页应用\n- 用 code_challenge/code_verifier 替代 client_secret",
    codeExample: "// 前端 OAuth2 登录流程\nfunction loginWithGoogle() {\n  const params = new URLSearchParams({\n    client_id: 'YOUR_CLIENT_ID',\n    redirect_uri: window.location.origin + '/auth/callback',\n    response_type: 'code',\n    scope: 'openid profile email',\n    state: generateRandomState()\n  })\n  window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?' + params\n}\n\n// 回调页面\nasync function handleCallback() {\n  const code = new URLSearchParams(location.search).get('code')\n  const res = await fetch('/api/auth/google', {\n    method: 'POST',\n    body: JSON.stringify({ code })\n  })\n  const { token } = await res.json()\n  localStorage.setItem('token', token)\n}",
    tags: ["OAuth2", "三方登录", "授权码", "Google"],
  },
  {
    id: "int-02",
    title: "埋点/统计 SDK 设计与实现",
    category: "integration",
    difficulty: 2,
    question: "前端埋点 SDK 如何设计？如何集成 Google Analytics / Facebook Pixel？",
    answer: "埋点 SDK 核心设计：\n\n1. 数据采集：\n   - 页面浏览 (PV/UV)\n   - 用户行为（点击、滚动、停留时长）\n   - 性能数据（LCP, FID, CLS）\n   - 错误日志（JS Error）\n\n2. 数据传输：\n   - sendBeacon（页面卸载时可靠发送）\n   - 图片打点（1x1 gif，兼容性好）\n   - fetch/XHR（批量上报）\n\n3. 数据规范：\n   - 统一字段命名（event_name, event_params）\n   - 用户标识（device_id, user_id）\n   - 会话标识（session_id）\n\n集成方案：\n- Google Analytics 4 (GA4)：gtag.js script + gtag('event')\n- Facebook Pixel：fbq('track', 'Purchase')\n- AppsFlyer：SDK 初始化 + 事件上报",
    codeExample: "// 埋点 SDK 简化\nclass Tracker {\n  private queue: any[] = []\n\n  track(event: string, params: Record<string, any>) {\n    const payload = {\n      event,\n      params,\n      timestamp: Date.now(),\n      page: location.pathname\n    }\n    this.queue.push(payload)\n    if (this.queue.length >= 10) this.flush()\n  }\n\n  private flush() {\n    const data = this.queue.splice(0)\n    navigator.sendBeacon('/api/analytics', JSON.stringify(data))\n  }\n}\n\n// sendBeacon 页面关闭时发送\nwindow.addEventListener('beforeunload', () => {\n  tracker.track('page_close', { duration: Date.now() - startTime })\n})",
    tags: ["埋点", "GA", "Facebook Pixel", "AppsFlyer", "sendBeacon"],
  }
]
