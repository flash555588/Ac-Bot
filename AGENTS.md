# AGENTS.md

## 项目概览

Ac-Bot 是一个社群专属的跨平台机器人系统。当前 MVP 只实现 Telegram 入群申请验证与审批，但架构必须保留 QQ、Discord、Matrix 等平台 adapter 的扩展入口。

核心原则：

- 一个仓库维护所有平台能力。
- 核心模块保持平台无关。
- Telegram API 只能出现在 `apps/worker/src/adapters/telegram/` 或 Telegram 专属 contract 中。
- 入群申请、成员档案、风控、验证、审计等能力应由 core modules 承载。

## 关键文档

实现前先阅读：

- `docs/specs/0001-community-bot-platform-mvp.md`

该 spec 是当前项目的主要设计来源。除非用户明确要求调整架构，否则实现应遵守其中的技术选型、模块边界和 MVP 范围。

## 技术栈

- TypeScript
- Cloudflare Workers Runtime
- Hono
- grammY，仅用于 Telegram adapter
- Cloudflare D1
- Drizzle ORM 与 drizzle-kit
- Cloudflare Queues
- Cloudflare Cron Triggers
- Cloudflare R2
- Cloudflare Turnstile
- React + Vite
- pnpm
- Vitest
- Wrangler

## 代码组织规则

- 平台相关代码放在 `apps/worker/src/adapters/<platform>/`。
- 平台无关业务放在 `apps/worker/src/modules/` 或 `apps/worker/src/core/`。
- 数据库 schema 和迁移放在 `packages/db/`。
- 跨平台类型放在 `packages/platform-contracts/src/core/`。
- Telegram 专属类型放在 `packages/platform-contracts/src/telegram/`。
- 不要在 core modules 中直接使用 `ChatJoinRequest`、`approveChatJoinRequest`、`declineChatJoinRequest`、`telegram_user_id`、`chat_id` 等 Telegram 专属概念。

## 开发命令

项目尚未脚手架化。脚手架完成后，应在这里补充实际命令。

预期命令形态：

- 安装依赖：`pnpm install`
- 本地开发：`pnpm dev`
- 类型检查：`pnpm typecheck`
- 测试：`pnpm test`
- 数据库迁移：`pnpm db:migrate`
- 部署：`pnpm deploy`

## 测试要求

- 修改平台 adapter 时，至少覆盖平台事件到核心事件的映射。
- 修改核心状态机时，必须覆盖状态流转、重复事件幂等、失败重试。
- 修改数据库 schema 时，必须同步更新迁移和相关类型。
- 修改安全相关逻辑时，必须覆盖 webhook secret、Mini App init data、管理员权限校验。

## 安全注意事项

- 不要提交 bot token、webhook secret、Cloudflare secret、R2 key 或 Turnstile secret。
- 日志不得输出完整敏感资料。
- 管理员权限必须按 `platform + platform_account_id` 校验。
- 所有自动拒绝和人工覆盖都必须写入审计记录。

## 提交前检查

在项目脚手架完成后，提交前应运行：

- `pnpm typecheck`
- `pnpm test`

如果命令尚不存在，在最终回复中说明未运行的原因。
