# e-Tysan 当前 Demo 功能清单

## 1. 清单说明

本清单基于当前 React demo 的已实现页面与 workflow 整理，按“主故事 / 支持型功能 / 平台壳层”划分。  
状态口径如下：

- `主故事`：本轮客户 demo 必讲
- `支持型`：Q&A 或 linked record 补充
- `产品壳层`：门户、模块首页、公共导航与展示外壳

## 2. 主故事功能

| 模块 | 功能 | 当前入口 | 分类 | 当前 demo 已实现内容 |
| --- | --- | --- | --- | --- |
| Safety | Cross-site worker profile | 首页 `Operational workflows` / Safety 首屏 | 主故事 | Gate lookup、跨工地历史、证书有效期、gate result、linked HR / incident |
| Safety | Toolbox Talk attendance | 首页 `Operational workflows` / Safety 首屏 | 主故事 | Session setup、`Tap card` / `Manual mode`、attendance count、sync 到 worker profile |
| Safety | Ad-hoc issue closure | 首页 `Operational workflows` / Safety 首屏 | 主故事 | Mobile issue logging、severity、zone、subcontractor、rectification、verify、audit trail |
| Procurement | PR -> PO -> Delivery -> Three-way match | 首页 `Operational workflows` / Procurement 首屏 | 主故事 | PR 表单、approval routing、PO lifecycle、delivery verification、variance panel、QS handover |
| IMS - Quality | Complaint -> CAR -> Closure | 首页 `Operational workflows` / IMS 首屏 | 主故事 | Complaint record、investigation、root cause、CAR、e-sign close、monthly summary |
| QS | Payment certificate review | 首页 `Operational workflows` / QS 首屏 | 主故事 | OCR extraction、commercial review、approval chain、revision / certify、linked PO / delivery note |

## 3. 支持型功能

| 模块 | 功能 | 当前入口 | 分类 | 当前 demo 已实现内容 |
| --- | --- | --- | --- | --- |
| Environmental | Permit / CNP lifecycle | Environmental 首屏 | 支持型 | Permit register、authority review、renewal watch、inspection / training / pack linkage |
| Environmental | Inspection follow-up | Environmental 首屏 / linked workspace | 支持型 | Inspection evidence、linked permit、整改跟进 |
| Environmental | Training roster | Environmental linked workspace | 支持型 | 培训名单、linked permit、supporting record |
| Environmental | Control pack | Environmental linked workspace | 支持型 | Permit / inspection / training / DMS supporting pack |
| HR | Cross-site worker compliance view | HR 首屏 | 支持型 | Profile、transfer history、certificate validity、expiry alerts |
| HR | Certificate repository | HR 首屏 / linked from Safety | 支持型 | 证书上传入口、expiry reminder、与 Safety access flag 口径对齐 |
| HR | Manpower request | HR workspace | 支持型 | 人员需求申请、审批、sourcing 启动 |
| HR | Leave workflow | HR module / workspace | 支持型 | Leave request、记录查看、审批展示 |
| Safety | 2-stage incident report | Safety module / linked from worker profile | 支持型 | Preliminary -> investigation / RCA -> close-out、linked worker / training / approval / DMS |
| DMS | Upload / review / share / watermark | DMS 首屏 / workspace | 支持型 | Library / category / current record、upload、review queue、secure share、watermark、external expiry |
| DMS | OCR document register | DMS 首屏 | 支持型 | OCR indexed records、search、status filters、preview |
| Plant | Job sheet | Plant module | 支持型 | 维修工单、成本、状态 |
| Plant | Transfer note | Plant module | 支持型 | 设备调拨流程、状态推进 |
| Plant | Inspection | Plant module | 支持型 | Fleet inspection、permit / result 记录 |

## 4. 产品壳层与跨模块能力

| 模块/壳层 | 功能 | 当前 demo 已实现内容 |
| --- | --- | --- |
| Home / Portal | 首页仪表盘 | `Operational workflows`、memo、notification、approval、module launcher、project overview |
| Navigation | 模块切换 | Sidebar、Topbar、模块首页切换 |
| Workflow shell | Full-page workflow | `WorkspacePage` 统一承载长流程页面 |
| Drawer shell | Supporting workspace | `WorkspaceDrawer` 承载轻量记录、辅助信息、linked records |
| Linked records | 跨模块深链 | Safety -> HR / Incident、Procurement -> QS、QS -> Procurement、Environmental -> DMS |
| Audit visibility | 审计展示 | 多数主故事已具备 stepper、timeline、status badge |
| 状态回写 | 前端模拟状态变化 | complaint、payment、procurement 等故事已支持前端状态推进 |

## 5. 参考文档覆盖关系

| 参考点 | 当前 demo 对应覆盖 |
| --- | --- |
| Clarification p.2 Safety worker registry / toolbox / ad-hoc issue | 已对应 3 条 Safety 主故事 |
| Clarification p.5 Complaint / CAR / CNP lifecycle | 已对应 IMS 主故事与 Environmental supporting story |
| Clarification p.7 QS payment certification | 已对应 QS payment story |
| Clarification p.9 Procurement PR / delivery / three-way match | 已对应 Procurement 主故事 |
| Clarification p.12 / p.16 HR certificate & access flag | 已通过 worker profile + HR supporting page 覆盖 |
| Modulus Description p.9 DMS OCR / watermark / external control | 已对应 DMS supporting page |
| Modulus Description p.10 Safety mobile / worker registry / access control | 已对应 Safety 主故事 |
| Modulus Description p.11 IMS complaint / environmental permit | 已对应 IMS + Environmental |
| Modulus Description p.12-14 QS / Procurement | 已对应 QS 和 Procurement 主故事 |
| Modulus Description p.18 HR profile / certificate / training | 已对应 HR supporting page |

## 6. 当前范围边界

当前 demo 明确不做真实后端能力，以下内容均以 UI 模拟方式展示：

- 真实 API / 数据库
- 真实 OCR 引擎
- 真实 RFID / NFC 读卡
- 真实推送、短信、邮件发送
- 真实文件上传和外链权限加密
- 完整 RBAC / SSO 配置后台

因此本轮 demo 的目标不是“证明技术已接通”，而是“证明业务流程、页面结构、状态变化和跨模块联动已经清晰可演示”。
