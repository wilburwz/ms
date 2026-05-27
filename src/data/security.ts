import type { KnowledgePoint } from '../types'

export const securityData: KnowledgePoint[] = [
  {
    id: "sec-01",
    title: "XSS 攻击与防御",
    category: "security",
    difficulty: 2,
    question: "什么是 XSS 攻击？有哪些类型？如何防御？",
    answer: 'XSS（跨站脚本攻击）是攻击者把恶意脚本注入到你的页面里执行。防御核心是不信任用户输入。前端：用户输入做转义（< > " \' 转成 HTML 实体）、不用 innerHTML/setHTML 渲染用户内容（用 textContent 或安全的渲染方式）、React/Vue 默认做 XSS 防护（花括号绑定内容是转义的）。后端：HttpOnly cookie（JS 读不到）、CSP（Content Security Policy 限制可执行脚本来源）。',
    codeExample: "// 危险\nel.innerHTML = userInput\n\n// 安全\nel.textContent = userInput\n\n// Vue\n<!-- {{ }} 自动转义 -->\n<p>{{ userInput }}</p>\n<!-- 需谨慎，仅用于可信内容 -->\n<p v-html=\"trustedHtml\"></p>\n\n// CSP 头\nContent-Security-Policy: default-src 'self'; script-src 'self'",
    tags: ["XSS", "安全", "CSP", "HttpOnly"],
  },
  {
    id: "sec-02",
    title: "CSRF 攻击与防御",
    category: "security",
    difficulty: 2,
    question: "CSRF 攻击的原理是什么？有哪些防御手段？",
    answer: 'CSRF（跨站请求伪造）是攻击者在你不知情时用你的登录状态发恶意请求。原理：你登录了银行网站，Cookie 还在。攻击者诱导你点击他网站的链接，这个链接向银行发转账请求——因为 Cookie 自动带上，银行以为是你的操作。防御：CSRF Token（每次请求带一个服务端生成的随机 token，攻击者猜不到）、SameSite Cookie（Strict 或 Lax，跨站请求不发送 Cookie）、验证码和二次确认。',
    codeExample: "// SameSite Cookie\nSet-Cookie: sessionId=abc123; SameSite=Strict; Secure; HttpOnly\n\n// 前端携带 CSRF Token\nfetch('/api/transfer', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'X-CSRF-Token': getCSRFToken()\n  },\n  body: JSON.stringify({ amount: 1000 })\n})",
    tags: ["CSRF", "安全", "SameSite", "Token"],
  },
{
    id: "sec-03",
    title: "前端安全：中间人攻击与 HTTPS",
    category: "security",
    difficulty: 2,
    question: "什么是中间人攻击？HTTPS 如何防止？",
    answer: 'CSP（Content Security Policy）是浏览器白名单机制——通过 HTTP 头告诉浏览器"只允许加载来自这些源的资源"。可以限制 script-src（只允许自己的域名和特定 CDN）、style-src、img-src 等。还能禁止内联脚本（防止 XSS 注入 inline script）。配置方式：HTTP 响应头 Content-Security-Policy 或 HTML meta 标签。部署用 report-only 模式先观察再启用强制。',
    tags: ["安全", "HTTPS", "MITM", "中间人攻击"],
  },
  {
    id: "sec-04",
    title: "CSP 内容安全策略",
    category: "security",
    difficulty: 2,
    question: "CSP (Content Security Policy) 是什么？如何配置？",
    answer: 'cookie 的安全属性：HttpOnly（JS 不可读取，防 XSS 偷 cookie）、Secure（只有 HTTPS 才发送）、SameSite（Strict 跨站不发送/Lax 部分场景发送/None 不限制）。建议：鉴权 cookie 开启 HttpOnly + Secure + SameSite=Lax。再加 session 过期时间不要太长、重要的操作（改密码、支付）要求重新验证。',
    codeExample: "// HTTP 响应头\nContent-Security-Policy: default-src 'self'; script-src 'self' 'nonce-ed3073'; style-src 'self' 'unsafe-inline'\n\n// 报告模式（不阻止，只上报）\nContent-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report",
    tags: ["安全", "CSP", "XSS", "内容安全策略"],
  },
  {
    id: "sec-05",
    title: "前端敏感数据保护",
    category: "security",
    difficulty: 2,
    question: "前端如何处理敏感数据？token 存储的最佳实践？",
    answer: 'HTTPS 是安全的 HTTP——HTTP + TLS。TLS 做了三件事：加密（传输内容被加密，中间人看不到）、身份验证（证书确保你在和真的服务器通信，不是假的）、数据完整性（防止传输过程中被篡改）。部署 HTTPS 要做的事：申请证书（Let\'s Encrypt 免费）、配置 Nginx 转发 80 到 443、开启 HSTS 头强制浏览器只能用 HTTPS。',
    tags: ["安全", "Token", "Cookie", "敏感数据"],
  }
]
