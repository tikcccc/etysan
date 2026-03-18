# e-Tysan 原型对齐与前端 Demo 增强计划

## 1. 本次结论

本计划已对照以下资料重新收敛：

- [`doc/prd.md`](../doc/prd.md)
- [`reference-doc/20260216 Email Tender Clarification to isBIM 0227 V1.docx`](../reference-doc/20260216%20Email%20Tender%20Clarification%20to%20isBIM%200227%20V1.docx)
- [`reference-doc/Appendix A - eTysan System_Modulus Experience_v1.1.docx`](../reference-doc/Appendix%20A%20-%20eTysan%20System_Modulus%20Experience_v1.1.docx)
- [`reference-doc/Modulus Description for e-Tysan System.pdf`](../reference-doc/Modulus%20Description%20for%20e-Tysan%20System.pdf)

结论有 4 点：

- 当前目标应该明确为“给客户看的前端 Demo”，不是“先把完整系统和后端打通”。
- 当前代码已经有可复用的前端流程骨架，包括 [`src/App.jsx`](../src/App.jsx)、[`src/components/WorkspacePage.jsx`](../src/components/WorkspacePage.jsx)、[`src/components/WorkspaceDrawer.jsx`](../src/components/WorkspaceDrawer.jsx)，不需要为了这轮 Demo 再做一轮大重构。
- 当前文档里的优先级与 reference-doc 还没有完全对齐，尤其是客户明确点名要看的 `跨工地 worker profile`、`100+ 工人 Toolbox Talk attendance`、`Complaint -> CAR` 没有被提升到第一优先级。
- 下一步最重要的不是“补更多模块页”，而是把客户真正想看的 6 条业务故事做得更清楚、更可点、更像最终产品。

## 2. 与 reference-doc 的对齐检查

### 2.1 客户明确想看的 Demo 场景

| 场景 | reference-doc 明确要求 | 当前计划情况 | 调整结论 |
| --- | --- | --- | --- |
| Safety：跨工地 worker profile | Clarification 明确要求演示工人从 Site A 转到 Site B 后，无需重新登记即可查看培训、事故、证书有效期 | 只在 HR 场景里提到，但不是第一阶段核心故事 | 提升为第一阶段核心故事 |
| Safety：Toolbox Talk 100+ attendance | Clarification 明确要求演示 100+ 工人签到、RFID/NFC、Manual Mode、同步到 HR/Training | 文档已写到，但未进入第一阶段优先级 | 提升为第一阶段核心故事 |
| Safety：Ad-hoc issue logging | Clarification 明确要求移动端拍照、site plan/GPS/zone、指派分判、跟进至关闭 | 当前计划基本对齐 | 保持第一阶段核心故事 |
| IMS：Complaint -> CAR -> Closure | Clarification 明确要求从 complaint registration 到 RCA/CAPA、closure notification 的闭环 | 当前计划有写，但优先级不够高 | 提升为第一阶段核心故事 |
| Environmental：Permit / CNP lifecycle | Clarification 明确要求 permit 申请、附件、审批、validity/renewal tracking | 当前计划只有环境巡检和 renewal log，permit 主流程不够完整 | 补成支持型故事 |
| Procurement：PR -> PO -> delivery verification -> three-way match | Clarification 明确要求 PR to PO、site delivery verification、PO/GRN/Invoice 三方匹配 | 当前计划写到了 requisition、approval、PO、delivery，但三方匹配不够明确 | 在采购主故事里补强 GRN / invoice variance 展示 |
| QS：Payment certification / OCR review | PRD 与参考材料明确强调 Payment Application、Payment Certificate、OCR、Delivery Note 关联 | 当前计划基本对齐 | 保持第一阶段核心故事 |
| HR：Certificate repository / expiry reminder / site access flag | Clarification 明确要求证书扫描件、到期提醒、过期阻挡或标记入场 | 当前计划有 certificate，但没有明确写成和 Safety access 联动的重点 | 作为 worker profile 的支持故事补强 |
| DMS：Upload / review / share / watermark | PRD 与模块说明强调 OCR、版本、水印、外部分享、审批 | 当前计划对齐，但这不是客户澄清里最核心的 interview story | 保留，但降为支持型展示 |
| Plant：Job sheet / transfer | PRD 有要求，但不属于这轮 reference-doc 最明确的客户点名场景 | 当前计划权重偏高 | 移到 Demo 后续阶段 |
| Safety：incident two-stage report | PRD 提到，两阶段事故上报也有业务价值 | 当前计划放在很前 | 不删除，但降到第一轮 Demo 之后 |

### 2.2 需要修正的判断

当前文档里有几处判断已经落后于代码现状，需要修正：

- 现在不能再说“大部分按钮都没有后续动作”。当前代码里已经有 `Safety ad-hoc issue`、`Toolbox talk attendance`、`Procurement requisition / delivery verification`、`QS payment`、`IMS complaint / CAR`、`HR profile / leave / certificate`、`DMS upload / share` 等前端流程。
- 现在也不能再说“没有统一的详情页 / 流程页框架”。[`src/components/WorkspacePage.jsx`](../src/components/WorkspacePage.jsx) 和 [`src/components/WorkspaceDrawer.jsx`](../src/components/WorkspaceDrawer.jsx) 已经是可复用的展示外壳。
- 这一轮不应该把重点放在新增路由体系、重做组件分层、甚至预先铺后端接口，而应该直接在现有前端状态流上完成客户指定故事。

换句话说，当前原型的问题已经不再是“完全没有流程”，而是：

- 场景优先级还不够贴近客户澄清文件
- 首页到重点故事的路径还不够清晰
- 同一类页面的视觉层次和信息结构还不够统一
- 有些 supporting story 还没有被明确降级，导致 scope 容易过大

## 3. 这轮 Demo 的范围定义

### 3.1 明确目标

这轮只做“前端可演示原型”，目标是让客户在演示时清楚看到：

- 表单长什么样
- 业务如何推进
- 状态如何变化
- 谁在什么环节处理
- 相关资料如何联动到其他模块

### 3.2 明确不做

这轮不做真实后端能力，不把时间花在下面这些地方：

- 不接真实 API
- 不接真实数据库
- 不做真实登录、SSO、RBAC 配置后台
- 不做真实 OCR 引擎
- 不接真实 RFID/NFC 读卡器
- 不做真实短信、推送、邮件通知
- 不做真实文件上传、外链、权限加密

以上内容只以“前端模拟结果”呈现，例如：

- `OCR extracted`
- `NFC tap simulated`
- `Synced to HR + Safety`
- `Push notification sent`
- `Access blocked`

### 3.3 演示原则

- 所有故事都用固定假资料与前端状态驱动。
- 每一步操作都能即时回写状态、时间线、摘要卡片。
- 每条故事都能重置到初始状态，方便 demo 反复演示。
- 技术能力只做“可信展示”，不做真实集成实现。

## 4. 客户 Demo 主线

建议把第一轮客户 Demo 收敛成 6 条主故事，其他模块作为 supporting surface 出现，不再平均铺开。

### 4.1 Safety：跨工地 worker profile

来源对齐：

- Clarification 明确要求演示工人从 Site A 转到 Site B 后，安全主任如何即时查看完整历史。

原型必须显示：

- `Scan card / Search ID` 入口
- 工人主档：姓名、工种、当前工地、唯一 ID
- Site A 的事故记录、培训记录、证书有效期
- Site transfer history
- 当前 access result：`Allowed / Flagged / Blocked`
- 深链到 HR profile

演示重点：

- 强调 `No re-registration`
- 强调 `Safety + HR` 的跨模块联动
- 强调证书与入场控制的关系

### 4.2 Safety：Toolbox Talk / E-Training Attendance

来源对齐：

- Clarification 明确要求演示 100+ 工人签到、RFID/NFC、Manual Mode、同步到 training record。

原型必须显示：

- Session setup：topic、date、site、trainer、attendance mode
- `Tap card` 与 `Manual mode` 两种签到方式
- 实时 attendance count
- 漏带卡时的 fallback 搜索
- 完成后 `Synced to worker profile / training record`

演示重点：

- 这是最典型的 mobile-first 现场场景
- 必须突出“快”和“清楚”，不要堆太多后台概念

### 4.3 Safety：Ad-hoc Issue 现场问题闭环

来源对齐：

- Clarification 明确要求安全主任巡查时新发现问题，移动端拍照、定位、指派分判、跟进直至关闭。

原型必须显示：

- 移动端巡检界面
- 新 issue 表单：photo、site plan / GPS / zone、severity、due date、subcontractor、remark
- 状态推进：`Log -> Assign -> Rectify -> Verify -> Close`
- before / after evidence
- audit trail

建议补强：

- 当 severity 为 `Immediate work stoppage` 时，显示 `PM notified` / `Escalation pending` 的前端提示

### 4.4 Procurement：PR -> PO -> Delivery -> Three-way Match

来源对齐：

- Clarification 明确要求演示 PR to PO、site delivery verification、PO/GRN/Invoice 三方匹配。

原型必须显示：

- Requisition 表单字段：
  `Job number / request date / item / quantity / delivery date / delivery location / requester`
- 按金额触发 approval route
- 审批后自动生成 PO
- Site delivery note / GRN 验证
- Invoice 上传后进行 three-way match
- 若有差异，显示 variance panel
- 流程终点为 `QS handover`

需要特别修正：

- 当前计划里 `Quotation Analysis` 写得比较重，但客户演示真正必须看到的是 `delivery verification + three-way match`
- 因此采购故事应从“长审批链展示”调整成“从地盘发起到收货、对账、交 QS 的闭环”

### 4.5 IMS：Client Complaint -> CAR -> Closure

来源对齐：

- Clarification 明确要求从 complaint registration 到 investigator、RCA/CAPA、closure notification 的全过程。

原型必须显示：

- Complaint record
- Investigator / case owner
- Root cause
- Corrective / preventive action
- CAR 自动生成
- E-sign close
- Monthly summary / trend hook

演示重点：

- 这是质量模块最容易被客户快速理解的闭环故事
- 页面命名必须直接用 `Complaint`、`CAR`、`Closure`

### 4.6 QS：Payment Certificate / OCR Review

来源对齐：

- PRD 与参考材料都强调 payment certificate、OCR、delivery note 关联、审批链与审计留痕。

原型必须显示：

- 付款详情页
- OCR extraction panel
- 金额、工作内容、retention / adjustment
- 关联 Procurement PO / Delivery Note
- `Request revision` 与 `Certify payment`
- 审批 stepper 与 audit trail

演示重点：

- 这一页应该看起来像“接近最终系统的商业审批界面”
- `OCR` 是展示点，但只做前端模拟结果，不需要真实识别

### 4.7 支持型展示，不作为第一轮主故事

下面这些保留，但不再占用第一轮主路径：

- DMS：`Upload / review / share / watermark`
- HR：`Certificate upload / expiry reminder / access flag`
- Environmental：`Permit / renewal tracking`
- Safety：`incident two-stage report`
- Plant：`job sheet / transfer`

这些内容建议作为：

- 主故事里的 linked record
- 侧边 supporting drawer
- 演示 Q&A 时的补充页面

## 5. 界面需要如何更清晰

这轮 Demo 的界面目标不是更花，而是更容易让客户一眼看懂。

### 5.1 一屏只讲一件事

- 模块首页负责“入口与摘要”
- 故事页负责“单条业务闭环”
- 不要在同一页同时讲 3 个流程

### 5.2 固定页面骨架

所有主故事页面尽量统一为：

- 顶部：标题、编号、状态、主 CTA
- 左侧：详情 / 表单 / 证据
- 右侧：stepper / 审批链 / 时间线 / linked records

### 5.3 主按钮只能有一个重点

每个故事页上方只保留一个最强的主动作，例如：

- `Submit requisition`
- `Sync attendance`
- `Assign issue`
- `Issue CAR`
- `Certify payment`

其他动作放到次级按钮，避免客户找不到下一步。

### 5.4 状态必须放在首屏

客户最关心的是流程推进，因此以下元素必须在首屏可见：

- 当前状态 badge
- stepper
- 下一步动作
- 关键摘要字段

### 5.5 术语直接对齐文件

不要在界面里混用泛化命名。优先使用 reference-doc 与 PRD 中出现的真实业务词，例如：

- `Toolbox Talk`
- `Client Complaint Record`
- `CAR`
- `Payment Certificate`
- `Delivery Note`
- `Quotation Analysis`
- `Green Card`

### 5.6 KPI 和卡片要减量

- 模块页上的 KPI 卡片控制在 3 到 4 个最有解释力的指标
- 减少“装饰性摘要卡”
- 把点击路径让出来给主故事入口

### 5.7 移动端展示只留给现场场景

移动端框架只在下面几类场景使用：

- Safety patrol / ad-hoc issue
- Toolbox Talk attendance
- 必要时的 mobile approval

其他模块优先用桌面页面展示，避免视觉语言过杂。

### 5.8 技术能力展示要克制

像 `OCR`、`NFC`、`API sync`、`push sent` 这些能力应作为辅助标签出现，而不是页面主角。  
客户在 Demo 里首先要看懂业务，不是先看技术术语。

## 6. 基于现有 React 原型的落地方式

### 6.1 不做大重构，直接复用现有框架

现有前端已经具备以下能力：

- [`src/App.jsx`](../src/App.jsx) 负责 `activeView`、`workspace`、`pageWorkspace`
- [`src/components/WorkspacePage.jsx`](../src/components/WorkspacePage.jsx) 已支持全页流程展示
- [`src/components/WorkspaceDrawer.jsx`](../src/components/WorkspaceDrawer.jsx) 已覆盖多条业务故事

因此这轮不建议先做：

- 新路由体系
- 新状态管理框架
- 大规模组件目录重组
- 先行后端接口抽象

### 6.2 页面与抽屉的使用边界

建议直接沿用当前模式：

- 长流程、字段多、要给客户重点看的故事：`pageWorkspace`
- 轻量确认、辅助信息、supporting record：`workspace drawer`

这比先引入新的 `router-first` 架构更适合当前 Demo 节奏。

### 6.3 数据仍然以场景假资料驱动

建议继续使用 `src/data/*` 里的模块假数据，并只在需要时补少量场景预设：

- `scenarioId`
- 默认字段
- 初始状态
- 可执行动作
- linked record
- demo 完成后的状态回写

目标是“快速做出可信故事”，不是“先搭一套抽象平台”。

### 6.4 建议新增的只是轻量通用件

如果要补组件，只补高复用且直接提升清晰度的部分，例如：

- `DemoPathCard`
- `StoryStatusHeader`
- `LinkedRecordList`
- `WorkflowStepper`
- `AuditTimeline`

不要为了这轮 Demo 先发明太多中间层。

## 7. 修订后的实现优先级

### 第一阶段：客户 Demo 必须完成

- Safety worker cross-site profile
- Safety toolbox talk attendance
- Safety ad-hoc issue
- Procurement PR -> PO -> delivery -> three-way match
- IMS complaint -> CAR
- QS payment certificate

### 第一阶段补充：支持型页面

- HR certificate upload / expiry reminder / site access flag（已通过 worker profile + linked HR profile 部分接入）
- DMS upload / review / share / watermark（下一轮优先补）
- Environmental permit / renewal tracking（排在 DMS 之后）

### 第二阶段：Demo 之后再补

- Safety incident two-stage report（降级后的补充故事，排在 DMS / Environmental permit 之后）
- Role switch / RBAC 视角
- Plant job sheet / transfer
- Email / SSO / API 等技术型演示包装

## 8. 这轮 Demo 的验收标准

- 6 条主故事都能从首页或模块首页在 2 次点击内进入
- 演示主路径上没有 dead CTA
- 每条主故事都能看到：
  - 业务对象标题与状态
  - 表单或关键字段
  - stepper / workflow
  - 主动作按钮
  - 时间线 / 审计记录
  - 至少 1 个 linked record
- 所有业务名词与 reference-doc / PRD 保持一致
- 不依赖后端也能完成完整演示
- 至少有 3 条跨模块联动路径
- 现场类场景采用移动端视觉，其余模块保持桌面页面清晰展示

## 9. 当前执行进展

### 9.1 本轮已完成

- 首页已新增 6 条客户 demo 直达入口，由 [`src/components/DemoPathways.jsx`](../src/components/DemoPathways.jsx) 驱动，并在 [`src/App.jsx`](../src/App.jsx) 接入。
- 6 条入口可直达 `跨工地 worker profile`、`Toolbox Talk`、`Ad-hoc issue`、`PR -> three-way match`、`Complaint -> CAR`、`Payment certificate`。
- Safety 已新增真正属于主故事的 [`safetyWorkerProfile`](../src/components/WorkspaceDrawer.jsx) 页面，并在 [`src/components/SafetyPage.jsx`](../src/components/SafetyPage.jsx) 的主 CTA 与 worker registry 上改成直达该故事。
- `Immediate work stoppage` 已补 `PM notified` / `Escalation pending` 级别的前端提示。
- [`src/components/StorySpotlight.jsx`](../src/components/StorySpotlight.jsx) 已接入 [`src/components/ProcurementPage.jsx`](../src/components/ProcurementPage.jsx)、[`src/components/QsPage.jsx`](../src/components/QsPage.jsx)、[`src/components/ImsPage.jsx`](../src/components/ImsPage.jsx)、[`src/components/HrPage.jsx`](../src/components/HrPage.jsx)，把客户要看的主路径提升到模块首页首屏。
- `StorySpotlight` 的默认 `Primary workflow` 文字已取消，改成按模块显式命名，避免多个产品页首屏重复同一层级标签。
- [`src/components/DmsPage.jsx`](../src/components/DmsPage.jsx) 已收敛成更清楚的正式产品页，去掉重复的 folder card / 说明堆叠，改成 `library -> category -> controlled register -> current record` 的主阅读路径。
- Environmental 已从 [`src/components/ImsPage.jsx`](../src/components/ImsPage.jsx) 的混合页签中拆出，新增独立的 [`src/components/EnvironmentalPage.jsx`](../src/components/EnvironmentalPage.jsx)，并在 [`src/App.jsx`](../src/App.jsx)、[`src/components/Sidebar.jsx`](../src/components/Sidebar.jsx)、[`src/components/ModuleLauncher.jsx`](../src/components/ModuleLauncher.jsx)、[`src/components/Topbar.jsx`](../src/components/Topbar.jsx) 接入为正式页面入口。
- [`src/data/ims.js`](../src/data/ims.js) 已补 permit / CNP lifecycle 所需的 `site`、`owner`、`lifecycleStage`、`nextAction`、`pack` 等假资料字段，支持环保模块首屏直接展示 `application / authority review / active / renewal`。
- 首页文案已在 [`src/components/Topbar.jsx`](../src/components/Topbar.jsx) 收敛成 demo 导向，相关样式已集中到 [`src/styles.css`](../src/styles.css)。
- 验证已完成：`npm run build` 通过。

### 9.2 这一步实际完成了什么

- 完成“主故事入口”：首页和模块首页都能更直接进入客户要看的主路径。
- 完成“首屏层次”：模块首页先讲 spotlight，再展开 supporting content，避免客户先看到次要 KPI 和列表。
- HR 已从独立大故事降为 Safety worker profile 的 supporting module，并通过 linked HR profile 承接证书、培训与转场信息。
- 完成“产品页分级”：Environmental 不再和 Quality 共用一个 IMS 页签，而是提升成独立 permit 产品页；IMS 本身则回到 `Complaint -> CAR -> Closure` 的质量闭环。
- 完成“信息减量”：DMS 首屏删掉重复说明和重复分组，只保留最关键的库切换、分类、记录列表与当前记录预览。

### 9.3 下一步收口顺序

- DMS / Environmental：继续补强 page workspace 与 linked record 的细节，让 supporting story 和主故事之间的跳转更像最终产品。
- Safety incident：保留为降级后的补充故事，排在当前主故事收口之后。
- Plant / 其他 supporting module：维持现状，等客户 Demo 第一轮反馈后再决定是否继续加深。

## 10. 总结

这轮最正确的方向，不是继续把所有模块平均铺开，也不是提前进入后端建设，而是把客户在 reference-doc 中明确要求的故事做成一套“前端可走通、界面够清楚、术语完全对齐、状态能即时变化”的 Demo。

如果按这份计划执行，客户在演示时看到的将不再是“很多页面”，而是：

- 一个工人如何跨工地被识别和追踪
- 一场 Toolbox Talk 如何快速签到并同步记录
- 一个现场问题如何被拍照、指派、整改、关闭
- 一张采购申请如何走到收货与对账
- 一个客诉如何触发 CAR 并闭环
- 一张付款证书如何被审核、退回或签核

这会比继续补通用页面，更接近客户真正想看到的产品 Demo。
