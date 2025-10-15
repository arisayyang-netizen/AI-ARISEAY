# Vercel 部署指南

## 1. 准备工作

确保你的项目已经：
- ✅ 推送到 GitHub 仓库
- ✅ 配置了 Supabase 数据库
- ✅ 创建了 `vercel.json` 配置文件
- ✅ 项目可以正常构建 (`npm run build`)

## 2. 创建 Vercel 账号并连接 GitHub

1. 访问 [Vercel](https://vercel.com) 并注册账号
2. 选择 "Continue with GitHub" 使用 GitHub 账号登录
3. 授权 Vercel 访问你的 GitHub 仓库

## 3. 导入项目

1. 在 Vercel 仪表板中，点击 "New Project"
2. 从 GitHub 仓库列表中找到你的项目 `AI-ARISEAY`
3. 点击 "Import" 导入项目

## 4. 配置项目设置

### 基本设置
- **Project Name**: `ai-workspace` (或你喜欢的名称)
- **Framework Preset**: Vite (Vercel 会自动检测)
- **Root Directory**: `./` (项目根目录)
- **Build Command**: `npm run build` (默认)
- **Output Directory**: `dist` (默认)
- **Install Command**: `npm install` (默认)

### 环境变量配置
在 "Environment Variables" 部分添加：

```
VITE_SUPABASE_URL = https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
```

**重要**: 
- 变量名必须以 `VITE_` 开头才能在客户端使用
- 不要添加 `SUPABASE_SERVICE_ROLE_KEY`，这是服务端密钥，不应在客户端暴露

## 5. 部署项目

1. 确认所有配置正确后，点击 "Deploy"
2. Vercel 会自动：
   - 克隆你的 GitHub 仓库
   - 安装依赖 (`npm install`)
   - 构建项目 (`npm run build`)
   - 部署到 CDN

## 6. 自定义域名（可选）

部署成功后，Vercel 会提供一个默认域名，如：
`https://ai-workspace-xxx.vercel.app`

### 添加自定义域名
1. 在项目设置中，点击 "Domains"
2. 输入你的域名（如：`ai-workspace.com`）
3. 按照 Vercel 的指引配置 DNS 记录

## 7. 自动部署

Vercel 已自动配置 GitHub 集成：
- 每次推送到 `main` 分支会触发生产环境部署
- 推送到其他分支会创建预览部署
- Pull Request 会自动创建预览环境

## 8. 性能优化

### 构建优化
项目已配置了以下优化：
- Vite 构建优化
- 代码分割
- 资源压缩
- Tree shaking

### Vercel 配置优化
`vercel.json` 文件包含：
- SPA 路由配置
- 安全头设置
- 静态资源缓存
- 环境变量配置

## 9. 监控和分析

Vercel 提供了丰富的监控功能：

### 部署监控
- 构建日志查看
- 部署状态跟踪
- 错误日志分析

### 性能分析
- Core Web Vitals 监控
- 页面加载性能
- 用户体验指标

### 访问分析
- 页面访问统计
- 地理位置分布
- 设备和浏览器分析

## 10. 环境管理

### 多环境部署
- **Production**: `main` 分支自动部署
- **Preview**: 其他分支和 PR 自动创建预览
- **Development**: 本地开发环境

### 环境变量管理
可以为不同环境设置不同的环境变量：
- Production
- Preview
- Development

## 11. 故障排除

### 常见构建错误

1. **依赖安装失败**
   ```bash
   # 检查 package.json 中的依赖版本
   # 确保 package-lock.json 已提交
   ```

2. **TypeScript 编译错误**
   ```bash
   # 本地运行构建命令检查错误
   npm run build
   ```

3. **环境变量未生效**
   - 确保变量名以 `VITE_` 开头
   - 检查 Vercel 项目设置中的环境变量配置
   - 重新部署项目

### 部署失败处理

1. **查看构建日志**
   - 在 Vercel 仪表板中查看详细的构建日志
   - 定位具体的错误信息

2. **本地测试**
   ```bash
   # 本地构建测试
   npm run build
   npm run preview
   ```

3. **回滚部署**
   - 在 Vercel 中可以快速回滚到之前的成功部署

## 12. 高级配置

### 自定义构建命令
如果需要自定义构建过程，可以在 `vercel.json` 中配置：

```json
{
  "buildCommand": "npm run build:production"
}
```

### 函数部署
如果需要服务端功能，可以创建 Vercel Functions：

```javascript
// api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Vercel!' })
}
```

### 重定向和重写
在 `vercel.json` 中配置 URL 重定向：

```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

## 13. 安全配置

项目已配置了基本的安全头：
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### 额外安全措施
- 启用 HTTPS（Vercel 默认）
- 配置 CSP 头
- 设置适当的 CORS 策略

## 14. 成本优化

Vercel 的免费计划包括：
- 100GB 带宽/月
- 无限静态部署
- 自动 HTTPS
- 全球 CDN

### 付费功能
- 更多带宽
- 团队协作
- 高级分析
- 优先支持

## 部署完成！

部署成功后，你的 AI 工作台将可以通过以下方式访问：
- Vercel 提供的默认域名
- 你配置的自定义域名（如果有）

现在你可以：
- 分享应用链接给其他用户
- 在任何设备上访问你的工作台
- 享受全球 CDN 加速的快速访问体验

## 后续维护

1. **定期更新依赖**
   ```bash
   npm update
   npm audit fix
   ```

2. **监控性能指标**
   - 定期查看 Vercel Analytics
   - 优化加载性能

3. **备份重要数据**
   - 定期备份 Supabase 数据
   - 保持代码仓库同步

祝你的 AI 工作台部署成功！🎉