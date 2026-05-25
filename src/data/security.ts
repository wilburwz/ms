import type { KnowledgePoint } from '../types'

export const securityData: KnowledgePoint[] = [
  {
    id: "sec-01",
    title: "XSS 攻击与防御",
    category: "security",
    difficulty: 2,
    question: "什么是 XSS 攻击？有哪些类型？如何防御？",
    answer: "XSS（跨站脚本攻击）：攻击者向页面注入恶意脚本。\n\n三种类型：\n\n1. 存储型：恶意代码存储在服务端（如评论、用户资料）\n2. 反射型：恶意代码在 URL 参数中，服务端回显\n3. DOM 型：纯前端漏洞（innerHTML, document.write）\n\n防御措施：\n- 输出转义：< → &lt;  > → &gt; 避免 HTML 注入\n- CSP (Content Security Policy)：限制脚本来源\n- HttpOnly Cookie：禁止 JS 读取敏感 Cookie\n- 输入过滤：白名单校验\n- 使用安全的 API：textContent 代替 innerHTML\n- 前端框架自动转义：Vue/React 默认转义插值",
    codeExample: "// 危险\nel.innerHTML = userInput\n\n// 安全\nel.textContent = userInput\n\n// Vue\n<!-- {{ }} 自动转义 -->\n<p>{{ userInput }}</p>\n<!-- 需谨慎，仅用于可信内容 -->\n<p v-html=\"trustedHtml\"></p>\n\n// CSP 头\nContent-Security-Policy: default-src 'self'; script-src 'self'",
    tags: ["XSS", "安全", "CSP", "HttpOnly"],
  },
  {
    id: "sec-02",
    title: "CSRF 攻击与防御",
    category: "security",
    difficulty: 2,
    question: "CSRF 攻击的原理是什么？有哪些防御手段？",
    answer: "CSRF（跨站请求伪造）：利用用户已登录的身份，在用户不知情的情况下发起恶意请求。\n\n攻击流程：\n1. 用户登录了 bank.com（获得 Cookie）\n2. 用户访问 evil.com\n3. evil.com 中隐藏的 img 自动发起请求到 bank.com\n4. 浏览器自动带上 bank.com 的 Cookie\n5. 服务端以为是用户操作\n\n防御：\n- CSRF Token：服务端生成随机 token，前端每次请求携带\n- SameSite Cookie：SameSite=Strict/Lax 禁止跨站携带 Cookie\n- 验证 Referer/Origin：检查请求来源\n- 双重 Cookie 验证：Cookie 和 Header 中都要有 token\n- 敏感操作二次验证：输入密码/验证码",
    codeExample: "// SameSite Cookie\nSet-Cookie: sessionId=abc123; SameSite=Strict; Secure; HttpOnly\n\n// 前端携带 CSRF Token\nfetch('/api/transfer', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'X-CSRF-Token': getCSRFToken()\n  },\n  body: JSON.stringify({ amount: 1000 })\n})",
    tags: ["CSRF", "安全", "SameSite", "Token"],
  },
{
    id: "sec-03",
    title: "前端安全：中间人攻击与 HTTPS",
    category: "security",
    difficulty: 2,
    question: "什么是中间人攻击？HTTPS 如何防止？",
    answer: "中间人攻击 (MITM)：\n- 攻击者插入通信双方之间\n- 拦截、篡改、伪造通信内容\n- 常见：公共 WiFi 劫持、DNS 欺骗、ARP 欺骗\n\nHTTPS 防护机制：\n1. 加密：对称+非对称混合加密，窃听无用\n2. 完整性：消息摘要防止篡改\n3. 身份认证：CA 证书链验证服务器身份\n\n证书校验流程：\n- 浏览器内置根 CA 公钥\n- 逐级验证证书签名\n- 检查证书有效期和域名匹配\n- Certificate Transparency 日志\n\n前端防护：\n- 强制 HTTPS（HSTS）\n- 升级不安全请求（CSP upgrade-insecure-requests）\n- Subresource Integrity (SRI)：验证 CDN 资源完整性",
    tags: ["安全", "HTTPS", "MITM", "中间人攻击"],
  },
  {
    id: "sec-04",
    title: "CSP 内容安全策略",
    category: "security",
    difficulty: 2,
    question: "CSP (Content Security Policy) 是什么？如何配置？",
    answer: "CSP：浏览器安全机制，限制页面可以加载/执行的资源。\n\n作用：\n1. 防御 XSS 攻击（限制脚本来源）\n2. 防止数据注入\n3. 强制 HTTPS\n4. 防止点击劫持\n\n配置方式：\n- HTTP 响应头：Content-Security-Policy\n- HTML meta 标签\n\n常用指令：\n- default-src 'self'：默认同源\n- script-src：脚本来源\n- style-src：样式来源\n- img-src：图片来源\n- connect-src：XHR/WebSocket 来源\n- frame-src：iframe 来源\n\n安全值：\n- 'self'：同源\n- 'none'：禁止\n- 'nonce-xxx'：一次性令牌\n- 'sha256-xxx'：内容哈希",
    codeExample: "// HTTP 响应头\nContent-Security-Policy: default-src 'self'; script-src 'self' 'nonce-ed3073'; style-src 'self' 'unsafe-inline'\n\n// 报告模式（不阻止，只上报）\nContent-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report",
    tags: ["安全", "CSP", "XSS", "内容安全策略"],
  },
  {
    id: "sec-05",
    title: "前端敏感数据保护",
    category: "security",
    difficulty: 2,
    question: "前端如何处理敏感数据？token 存储的最佳实践？",
    answer: "敏感数据处理原则：\n- 前端不是安全环境，最小化存储敏感数据\n- 传输加密（HTTPS）\n- 存储加密\n\nToken 存储方案对比：\n\nlocalStorage：\n- 方便但 XSS 可读取\n- 不受 CSRF 影响\n- 适合风险低的场景\n\nHttpOnly Cookie：\n- 脚本无法访问（防 XSS）\n- 自动随请求发送\n- 需要 CSRF 防护\n- 推荐方案\n\n内存 + Refresh Token：\n- Access Token 存在内存（闭包/状态管理）\n- Refresh Token 存在 HttpOnly Cookie\n- 最安全方案\n\n最佳实践：\n- Access Token 存在内存（不持久化）\n- Refresh Token 用 HttpOnly Secure SameSite Cookie\n- Token 设置合理的过期时间\n- 使用 BFF (Backend For Frontend) 模式",
    tags: ["安全", "Token", "Cookie", "敏感数据"],
  }
]
