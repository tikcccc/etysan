# e-Tysan 客户演示操作说明

## 1. 文档目的

本说明基于以下 3 类资料整理：

- [`coding-doc/prototype-enhancement-plan.md`](./prototype-enhancement-plan.md)
- `reference-doc/` 中的客户澄清文件、模块说明文件
- 当前 React demo 中已经可点击的页面与 workflow

建议把客户演示收敛为 6 条主故事，其他模块只作为 Q&A 补充，不在第一轮平均展开。

## 2. 演示前准备

- 统一从首页 `Home` 开始，首屏聚焦 `Operational workflows`
- 优先使用首页的 6 张 workflow 卡片进入主故事
- 当前 demo 为前端状态模拟，不接真实 API / 数据库 / OCR / RFID / NFC
- 如需恢复初始状态，直接刷新浏览器

## 3. 建议演示顺序

| 顺序 | 主故事 | 建议时长 | 目标 |
| --- | --- | --- | --- |
| 1 | Safety：Cross-site worker profile | 3 分钟 | 先让客户看到最明确点名的 worker cross-site 场景 |
| 2 | Safety：Toolbox Talk attendance | 3 分钟 | 展示现场高频、mobile-first、100+ attendance 思路 |
| 3 | Safety：Ad-hoc issue closure | 3 分钟 | 展示现场问题从拍照到关闭的闭环 |
| 4 | Procurement：PR -> PO -> Delivery -> Three-way match | 4 分钟 | 展示地盘到收货、对账、交 QS 的业务闭环 |
| 5 | IMS：Complaint -> CAR -> Closure | 3 分钟 | 展示质量闭环和管理 summary hook |
| 6 | QS：Payment certificate review | 4 分钟 | 展示商业审批界面、OCR、linked record |

## 4. 首页统一开场

操作建议：

1. 先停留在 `Home`
2. 指向 `Operational workflows`
3. 说明这 6 张卡片就是本轮客户 demo 的主线，不再平均展开所有模块
4. 说明每条故事都能看到：状态、关键字段、workflow、linked records、audit trail

当前 demo 已实现：

- 首页直达 6 条主故事
- 每条故事都能从首页 1 次点击进入 full-page workflow
- 多条故事之间已经接入跨模块 linked records

---

## 5. 主故事逐条演示

### 5.1 Safety：Cross-site worker profile

入口：

- `Home` -> `Operational workflows` -> `Cross-site worker profile` -> `Open workflow`

建议操作：

1. 先讲 `Gate lookup`，说明现场可通过 `Scan card / search by HKID / worker ID` 查人
2. 停在 `Worker summary`，强调工人已从 Site A 转到 Site B，但不需要重新登记
3. 展示 `Certificates and training`，说明证书、培训、事故历史已经从原工地带过来
4. 展示 `Site transfer history`
5. 点击 `Open linked HR profile`，补一句这是 `Safety + HR` 联动
6. 如客户继续追问，再点 linked incident record

客户应看到的重点：

- `No re-registration`
- Site A 历史可在 Site B 即时查看
- 证书有效期会直接影响 gate result
- worker profile 不是孤立页面，而是跨模块主档

对应 reference-doc point：

- `reference-doc/20260216-Email Tender Clarification to isBIM.pdf`
  - p.2 `E(isBIM)-1. Worker Registry & Smart Access Controls`
  - p.2 `E(isBIM)-1.1. Centralized Worker Database`
- `reference-doc/20260216-Email Tender Clarification to isBIM.pdf`
  - p.12 / p.16 `J(isBIM)-3.2. Certificate & Qualification Management`
- `reference-doc/Modulus Description for e-Tysan System.pdf`
  - p.10 `Unified Worker Registry` / `Smart Access Control`
  - p.18 `Qualification/Training record and certificates`

当前 demo 已实现的重要功能：

- Gate lookup 入口
- `Allowed / Flagged / Blocked` gate result
- Site transfer history
- 证书有效期与培训记录展示
- Linked HR profile
- Linked safety incident history

### 5.2 Safety：Toolbox Talk attendance

入口：

- `Home` -> `Operational workflows` -> `Toolbox Talk attendance` -> `Open workflow`

建议操作：

1. 先讲 `Session setup`，展示 `topic / date / site / trainer / attendance mode`
2. 在 `Attendance mode` 切换 `Tap card` 和 `Manual mode`
3. 在 `Attendance roster` 勾选几位工人，说明这里代表 100+ 工人的签到逻辑
4. 点击 `Start session`
5. 再点击 `Sync attendance`
6. 打开 linked worker profile，说明培训记录已同步到 HR + Safety

客户应看到的重点：

- 这是现场 mobile-first 场景
- 系统既支持刷卡，也支持 manual fallback
- 签到结束后不是停在 attendance，而是会回写 worker profile / training record

对应 reference-doc point：

- `reference-doc/20260216-Email Tender Clarification to isBIM.pdf`
  - p.2 `E(isBIM)-2. E-Training Attendance`
  - p.2 `Mass Attendance for Toolbox Talks`
  - p.2 `Hardware & Efficiency`
- `reference-doc/Modulus Description for e-Tysan System.pdf`
  - p.10 `E-Training & Analytics`

当前 demo 已实现的重要功能：

- Session setup
- `Tap card` / `Manual mode`
- 实时 attendance count
- Fallback 逻辑说明
- `Synced to worker profile / training record`
- Linked worker profile

### 5.3 Safety：Ad-hoc issue closure

入口：

- `Home` -> `Operational workflows` -> `Ad-hoc issue closure` -> `Open workflow`

建议操作：

1. 先停在左侧 `Field capture`，说明这是 mobile 巡查视角
2. 在 `Issue form` 展示 `severity / zone / subcontractor / due date / geo tag / observation`
3. 如果要强调严重程度分级，把 `Severity` 切成 `Immediate work stoppage`
4. 指给客户看自动出现的 `Escalation`
5. 按顺序点击：
   - `Assign issue`
   - `Record rectification`
   - `Verify close`
6. 最后停在 `Evidence`、`Workflow` 和 `Audit trail`

客户应看到的重点：

- 现场新问题可以不依赖预设 checklist 直接上报
- 能拍照、定 zone、指派分判、收整改证据、完成验证关闭
- 严重问题会触发升级提醒

对应 reference-doc point：

- `reference-doc/20260216-Email Tender Clarification to isBIM.pdf`
  - p.2 `E(isBIM)-3.1. Ad-Hoc Issue Logging`
  - p.2 `E(isBIM)-3.2. Severity-Based Notifications`
- `reference-doc/Modulus Description for e-Tysan System.pdf`
  - p.10 `Inspection & Patrol`
  - p.10 `Smart Workflows`

当前 demo 已实现的重要功能：

- Mobile inspection frame
- Ad-hoc issue form
- `Log -> Assign -> Rectify -> Verify`
- Before / after evidence
- Audit trail
- `Immediate work stoppage` escalation 提示

### 5.4 Procurement：PR -> PO -> Delivery -> Three-way match

建议分两段演示。

入口 A，先看闭环后段：

- `Home` -> `Operational workflows` -> `PR to delivery and three-way match` -> `Open workflow`

入口 B，再补前段表单：

- `Go to module` -> `Procurement`
- 首屏 `Start requisition`

建议操作：

1. 从首页先打开 `Delivery note verification`
2. 展示 `Delivery note / Invoice reference / Received quantity / Condition / Variance note`
3. 停在右侧 `Three-way match`，明确说这是 `PO / GRN / Invoice`
4. 点击 `Confirm receipt`
5. 再点击 `Open QS handover`
6. 返回 Procurement 模块首屏，补看 `Start requisition`
7. 在 requisition 页面展示：
   - `Job number`
   - `Request date`
   - `Item / quantity`
   - `Required delivery`
   - `Delivery location`
   - `Requester`
   - `Amount`
8. 指出金额超过阈值后，`Approval routing` 会进入 `Quotation analysis`
9. 如客户要看 PO，再从 `Active requisitions` 打开任一订单看 `Lifecycle`

客户应看到的重点：

- 不只是“发起采购”，而是从地盘请购一路走到收货、对账、交 QS
- 超额申请会进入 quotation analysis 和 multi-level approval
- three-way match 是这个故事的核心，不是报价页面本身

对应 reference-doc point：

- `reference-doc/20260216-Email Tender Clarification to isBIM.pdf`
  - p.9 `I(isBIM)-1.1.`
  - p.9 `Purchase requisition to purchase order`
  - p.9 `Material tracking and site delivery verification`
  - p.9 `Three-way matching (PO, GRN, Invoice)`
- `reference-doc/Modulus Description for e-Tysan System.pdf`
  - p.14 第 1-10 步采购流程
  - p.14 `Quotation Analysis Report (over $100,000)`
  - p.14 `Delivery Note` / `Invoice` / 转交 QS

当前 demo 已实现的重要功能：

- PR 表单
- 金额阈值驱动 approval routing
- PO lifecycle
- Delivery note verification
- Three-way match / variance panel
- QS handover deep link

### 5.5 IMS：Complaint -> CAR -> Closure

入口：

- `Home` -> `Operational workflows` -> `Complaint to CAR closure` -> `Open workflow`

建议操作：

1. 在 `Complaint record` 展示 `Client / Subject / Case owner / Severity`
2. 重点停在 `Root cause` 和 `Corrective action`
3. 点击 `Start investigation`
4. 再点击 `Issue CAR`
5. 最后点击 `Close with e-sign`
6. 打开 linked `Monthly quality summary`

客户应看到的重点：

- complaint 不是单点记录，而是质量 nonconformance 的闭环起点
- CAR 会自动生成
- closure 后可直接进入 monthly summary / trend hook

对应 reference-doc point：

- `reference-doc/20260216-Email Tender Clarification to isBIM.pdf`
  - p.5 `F(isBIM)-2. Client Complaint Handling`
  - p.5 `Register complaint -> assign investigator -> CAR auto-generated -> closure`
- `reference-doc/Modulus Description for e-Tysan System.pdf`
  - p.11 `Client Complaint Record`

当前 demo 已实现的重要功能：

- Complaint record 表单
- Investigator / case owner
- Root cause / corrective action
- CAR 自动生成引用
- `Close with e-sign`
- Monthly summary link

### 5.6 QS：Payment certificate review

入口：

- `Home` -> `Operational workflows` -> `Payment certificate review` -> `Open workflow`

建议操作：

1. 先停在 `OCR extraction`
2. 讲 `Invoice / Retention / Certified quantity / Adjustment / Delivery note`
3. 再停在 `Payment summary`，指出 linked PO 和 delivery note 状态
4. 打开 linked `Delivery note / GRN` 或 linked PO，强调 QS 不是孤立审批
5. 回到 payment 页面
6. 先点一次 `Request revision`，展示可退回
7. 再点 `Certify payment`，展示最终签核

客户应看到的重点：

- 这页是接近最终产品的商业审批界面
- OCR 是辅助能力，重点仍是 payment review 和 linked records
- QS 与 Procurement 已经通过 PO / Delivery / handover 接起来

对应 reference-doc point：

- `reference-doc/20260216-Email Tender Clarification to isBIM.pdf`
  - p.7 `Progress payment certification`
  - p.7 `Subcontractor payment certification`
  - p.7 `Materials on-site verification and reconciliation`
  - p.7 `Digital signatures for certificates`
- `reference-doc/Modulus Description for e-Tysan System.pdf`
  - p.12 `QS-A2 Payment Certificate`
  - p.12 `QS-B3 Invoice/Debit Note from Procurement Department`
  - p.12 `QS-B8 Subcontractor’s Payment Certificate/Invoice`
  - p.13 `OCR Capabilities`

当前 demo 已实现的重要功能：

- OCR extraction panel
- Commercial review note
- Approval stepper
- `Request revision` / `Certify payment`
- Linked PO
- Linked delivery note / GRN

---

## 6. Q&A 时可补充的 supporting 页面

如客户在主故事之后继续追问，可按下面顺序补充：

1. Environmental：`Environmental permit and CNP lifecycle`
2. HR：`Cross-site worker compliance view` / `Upload certificate`
3. DMS：`Upload / review / share / watermark / external expiry`
4. Safety：`2-stage incident report`
5. Plant：`Job sheet / transfer / inspection`

这些页面的用途是证明系统面不是只有 6 条故事，而是已经具备 supporting module 与 linked workflow。

## 7. 演示时不要主动展开的内容

- 不主动讲后端集成实现
- 不主动讲真实 OCR 引擎
- 不主动讲真实 RFID / NFC 硬件部署
- 不主动讲完整 RBAC / SSO 配置后台
- 不主动平均展示 Plant / Webmail 等非本轮核心故事

本轮最重要的是让客户看到：业务闭环、状态变化、跨模块联动、术语对齐。
