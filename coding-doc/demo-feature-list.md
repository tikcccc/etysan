# e-Tysan 当前 Demo 功能清单

## 1. 清单说明

本清单已按最新版 [`customer-demo-script.md`](./customer-demo-script.md) 的演示层级同步整理，分为：

- `6 条主故事`：第一轮客户 demo 必讲
- `4 条 Q&A 备用故事`：客户追问时直接打开 workflow 的补充链路
- `其他非优先补充`：保留，但不建议第一轮主动展开
- `产品壳层与共通能力`：支撑所有故事的门户、workflow、跨模块联动

以下主故事标题和备用故事名称，已按当前 demo 画面标题与关键按钮统一口径整理。

## 2. 6 条主故事

| 模块 | 主故事 | 当前入口 | 当前 demo 已实现内容 |
| --- | --- | --- | --- |
| Safety | Cross-site worker profile | 首页 `Operational workflows` / Safety 首屏 | Gate lookup、跨工地历史、证书有效期、gate result、linked HR / incident |
| Safety | Toolbox Talk attendance | 首页 `Operational workflows` / Safety 首屏 | Session setup、`Tap card` / `Manual mode`、attendance count、manual fallback、sync 到 worker profile |
| Safety | Ad-hoc issue closure | 首页 `Operational workflows` / Safety 首屏 | Mobile issue logging、severity、zone、subcontractor、rectification、verify、audit trail |
| Procurement | PR -> PO -> Delivery -> Three-way match | 首页 `Operational workflows` / Procurement 首屏 | PR 表单、approval routing、PO lifecycle、delivery verification、variance panel、QS handover |
| IMS - Quality | Client complaint -> CAR -> Closure | 首页 `Operational workflows` / IMS 首屏 | Complaint record、case owner、project / contractor / responsible parties、CAR、closure notification、e-sign close、monthly summary |
| QS | Payment certificate review | 首页 `Operational workflows` / QS 首屏 | OCR extraction、commercial review、approval chain、revision / certify、linked PO / delivery note |

## 3. 4 条 Q&A 备用故事

| 模块 | 备用故事 | 当前入口 | 当前 demo 已实现内容 |
| --- | --- | --- | --- |
| Environmental | Environmental permit / CNP lifecycle | Environmental 首屏 `Open CNP lifecycle` | Permit lifecycle、inspection evidence、training linkage、control pack、DMS deep link |
| HR | Certificate upload & renewal | Worker profile -> linked HR profile -> `Upload certificate` | 扫描件、expiry、reminder window、verifier、和 Safety access flag 联动 |
| DMS | New controlled record -> Review -> External share control | DMS 首屏 `New controlled record` | Record details、record metadata、approval routing、external access、expiry、secure link |
| Safety | 2-stage incident report | Worker profile linked incident / Safety supporting workspace | Preliminary report、investigation / RCA、approval route、toolbox talk linkage、incident pack -> DMS |

## 4. 其他非优先补充

| 模块 | 功能 | 当前 demo 已实现内容 |
| --- | --- | --- |
| HR | Manpower request | 人员需求申请、审批、sourcing 启动 |
| HR | Leave workflow | Leave request、记录查看、审批展示 |
| Plant | Job sheet | 维修工单、成本、状态 |
| Plant | Transfer note | 设备调拨流程、状态推进 |
| Plant | Inspection | Fleet inspection、permit / result 记录 |
| Webmail | Mailbox workspace | Inbox、folder、search、quick reply |

## 5. 产品壳层与共通能力

| 模块/壳层 | 功能 | 当前 demo 已实现内容 |
| --- | --- | --- |
| Home / Portal | 首页仪表盘 | `Operational workflows`、memo、notification、approval、module launcher、project overview |
| Navigation | 模块切换 | Sidebar、Topbar、模块首页切换 |
| Workflow shell | Full-page workflow | `WorkspacePage` 统一承载长流程页面 |
| Drawer shell | Supporting workspace | `WorkspaceDrawer` 承载轻量记录、辅助信息、linked records |
| Linked records | 跨模块深链 | Safety -> HR / Incident、Procurement -> QS、QS -> Procurement、Environmental -> DMS、IMS -> closure notice |
| Audit visibility | 审计展示 | 主故事与备用故事均具备 stepper、timeline、status badge |
| 状态回写 | 前端模拟状态变化 | complaint、payment、procurement、permit、incident 等故事支持前端状态推进 |

## 6. 本轮已补强的重点

| 模块 | 补强点 | 当前状态 |
| --- | --- | --- |
| IMS - Quality | `project / contractor / responsible parties` linkage | 已加入 complaint workflow 可见字段与摘要 |
| IMS - Quality | `closure notification` | 已加入 linked record、结果区与 audit timeline |
| Customer demo docs | 4 条 Q&A 备用故事 | 已同步到 demo script 与本清单 |
| Demo terminology | 主故事与备用故事标题 | 已按当前 UI 标题、按钮和关键字段统一口径 |

## 7. 参考文档覆盖关系

| 参考点 | 当前 demo 对应覆盖 |
| --- | --- |
| Clarification p.2 Safety worker registry / toolbox / ad-hoc issue | 已对应 3 条 Safety 主故事 |
| Clarification p.5 Complaint / CAR / closure / CNP lifecycle | 已对应 IMS 主故事与 Environmental 备用故事 |
| Clarification p.7 QS payment certification | 已对应 QS payment story |
| Clarification p.9 Procurement PR / delivery / three-way match | 已对应 Procurement 主故事 |
| Clarification p.12 / p.16 HR certificate & access flag | 已通过 worker profile + HR certificate 备用故事覆盖 |
| Modulus Description p.9 DMS OCR / watermark / external control | 已对应 DMS 备用故事 |
| Modulus Description p.10 Safety mobile / worker registry / access control | 已对应 Safety 主故事 |
| Modulus Description p.11 IMS complaint / environmental permit | 已对应 IMS + Environmental |
| Modulus Description p.12-14 QS / Procurement | 已对应 QS 和 Procurement 主故事 |
| Modulus Description p.18 HR profile / certificate / training | 已对应 HR supporting workflow |

## 8. 当前范围边界

当前 demo 明确不做真实后端能力，以下内容均以 UI 模拟方式展示：

- 真实 API / 数据库
- 真实 OCR 引擎
- 真实 RFID / NFC 读卡
- 真实推送、短信、邮件发送
- 真实文件上传和外链权限加密
- 完整 RBAC / SSO 配置后台

因此本轮 demo 的目标不是“证明技术已接通”，而是“证明业务流程、页面结构、状态变化和跨模块联动已经清晰可演示”。
