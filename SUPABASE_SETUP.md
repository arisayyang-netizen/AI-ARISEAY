# Supabase 数据库配置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并注册账号
2. 点击 "New Project" 创建新项目
3. 选择组织，输入项目名称（如：ai-workspace）
4. 设置数据库密码（请记住此密码）
5. 选择地区（建议选择离用户最近的地区）
6. 点击 "Create new project"

## 2. 获取项目配置信息

项目创建完成后，在项目仪表板中：

1. 点击左侧菜单的 "Settings" → "API"
2. 复制以下信息：
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJ...` (用于客户端访问)
   - **service_role key**: `eyJ...` (用于服务端管理操作，请妥善保管)

## 3. 配置环境变量

1. 在项目根目录创建 `.env` 文件
2. 复制 `.env.example` 的内容到 `.env`
3. 替换为你的实际配置：

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key

# Optional: Supabase Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
```

## 4. 创建数据库表结构

1. 在 Supabase 仪表板中，点击左侧菜单的 "SQL Editor"
2. 点击 "New query"
3. 复制 `supabase-setup.sql` 文件中的所有内容
4. 粘贴到 SQL 编辑器中
5. 点击 "Run" 执行 SQL 脚本

这将创建以下表：
- `tasks` - 任务管理
- `work_logs` - 工作记录
- `projects` - 项目管理
- `learning_progress` - 学习进度
- `user_settings` - 用户设置

## 5. 配置认证

### 启用匿名认证（推荐用于演示）
1. 在 Supabase 仪表板中，点击 "Authentication" → "Settings"
2. 在 "Auth Providers" 部分找到 "Anonymous sign-ins"
3. 开启 "Enable anonymous sign-ins"

### 配置邮箱认证（可选）
1. 在 "Auth Providers" 部分，邮箱认证默认已启用
2. 可以自定义邮件模板和发送设置

### 配置第三方登录（可选）
可以配置 Google、GitHub、Discord 等第三方登录：
1. 在相应的第三方平台创建应用
2. 在 Supabase 中配置对应的 Client ID 和 Client Secret

## 6. 配置行级安全策略 (RLS)

SQL 脚本已经包含了基本的 RLS 策略，确保：
- 用户只能访问自己的数据
- 数据安全隔离
- 防止未授权访问

## 7. 测试数据库连接

在项目中，Supabase 客户端会自动使用环境变量中的配置。你可以通过以下方式测试连接：

```javascript
import { supabase } from './src/utils/supabase'

// 测试连接
async function testConnection() {
  const { data, error } = await supabase.from('tasks').select('count')
  if (error) {
    console.error('数据库连接失败:', error)
  } else {
    console.log('数据库连接成功!')
  }
}
```

## 8. 实时功能

项目已配置实时订阅功能，可以实时同步数据变化：
- 任务状态更新
- 工作记录变化
- 项目进度更新

## 9. 数据备份

建议定期备份数据：
1. 在 Supabase 仪表板中，点击 "Settings" → "Database"
2. 使用 "Database backups" 功能
3. 可以设置自动备份计划

## 10. 监控和分析

Supabase 提供了丰富的监控功能：
- 数据库性能监控
- API 使用统计
- 错误日志追踪
- 用户活动分析

## 故障排除

### 常见问题

1. **连接失败**
   - 检查环境变量是否正确配置
   - 确认项目 URL 和 API Key 是否有效
   - 检查网络连接

2. **权限错误**
   - 确认 RLS 策略已正确配置
   - 检查用户是否已认证
   - 验证数据访问权限

3. **SQL 执行错误**
   - 检查 SQL 语法
   - 确认表结构是否正确创建
   - 查看 Supabase 日志获取详细错误信息

### 获取帮助

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase 社区](https://github.com/supabase/supabase/discussions)
- [Discord 社区](https://discord.supabase.com/)

## 安全注意事项

1. **永远不要在客户端代码中暴露 service_role key**
2. **使用环境变量存储敏感信息**
3. **定期轮换 API 密钥**
4. **启用适当的 RLS 策略**
5. **监控异常访问模式**

配置完成后，你的应用就可以使用 Supabase 作为后端数据库了！