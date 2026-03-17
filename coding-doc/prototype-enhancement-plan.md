# e-Tysan 原型二级交互增强建议

## 1. 背景与结论

当前原型已经完成了一级模块切换，并且部分模块已经有二级 tab、列表、卡片和 KPI 展示；但整体仍然更像“静态页面集合”，还不是“可演示业务流程的交互式原型”。

客户现在能看到：

- 有哪些模块
- 每个模块大概长什么样
- 每个模块会展示哪些信息

客户现在还看不到：

- 点按钮之后会进入什么业务流程
- 表单具体长什么样、要填什么字段
- 审批链怎么流转、状态怎么变化
- 一个事件如何跨模块串起来

因此，下一步不应该继续只加页面，而应该把原型升级成“场景驱动的二级交互原型”：

- 从看板进入对象详情
- 从对象详情进入表单/审批动作
- 表单提交后能看到状态变化、流程推进、审计轨迹

这样客户才能更直观地理解最终产品的工作方式。

## 2. 现有原型的主要限制

结合当前代码实现，现状可以概括为：

- 顶层入口主要由 [`src/App.jsx`](../src/App.jsx) 的 `activeView` 切换驱动，核心是页面级切换。
- 模块内虽然已经有一些二级结构，例如 DMS library 切换、QS/Procurement/HR/Plant/IMS 的 tab 和选中行，但大部分按钮仍然没有后续动作。
- 绝大多数 CTA 只停留在视觉层，例如 `Upload`、`Share`、`Start inspection`、`Report incident`、`New requisition`、`Certify payment`、`Apply leave`、`New job sheet` 等按钮没有再打开详情、表单或流程。
- 当前没有统一的“详情页 / 抽屉 / 弹窗 / 流程页”，也没有“提交后状态变化”的演示逻辑。
- 当前没有明显的跨模块联动，例如 Safety 事件不会联动到 DMS、HR、Procurement、QS。
- 当前没有角色视角切换，不足以体现 PRD 中的 `Requester / Reviewer / Approver / Executive / Admin` 差异。

换句话说，当前原型已经有一级导航和部分二级信息布局，但缺“业务对象详情层”和“业务动作层”。

## 3. 原型升级目标

建议把原型升级到下面这个展示深度：

### 3.1 一级：模块入口

保留当前做法，用于展示信息架构和主模块范围。

### 3.2 二级：对象详情

点击卡片、列表行、通知、审批项、按钮后，进入具体对象详情，例如：

- 某一份文件的审批详情
- 某一张安全巡检单的内容
- 某一张采购申请单 / PO 的流转进度
- 某一张付款证书的审批状态
- 某个员工/工人的完整档案

### 3.3 三级：动作与结果

严格来说，客户要真正看懂最终产品，通常还需要在“二级详情”基础上再多一步动作反馈，因此建议至少补到“2.5 层”：

- 填写表单
- 点击提交/审批/退回
- 页面状态即时变化
- 时间线、审批链、审计记录同步更新

如果只做详情、不做动作，客户仍然会觉得系统只是“可点击的 PPT”。

## 4. 设计原则

### 4.1 以场景驱动，而不是以页面驱动

不要继续把重点放在“再补几个页面”，而应围绕客户最关心的业务故事来做，例如：

- 安全主任发现问题后如何拍照、定位、派整改
- 地盘如何发起采购申请并走到 PO、收货、转 QS
- QS 如何审核付款、出证书、留痕
- 客诉/NCR 如何触发 CAR 并闭环

### 4.2 表单命名和流程节点必须对齐文件

建议直接采用文档中的真实名称，而不是泛化成通用词。这样客户一眼就能对上业务语义。

关键来源包括：

- [`doc/prd.md`](../doc/prd.md)
- [`reference-doc/20260216 Email Tender Clarification to isBIM 0227 V1.docx`](../reference-doc/20260216%20Email%20Tender%20Clarification%20to%20isBIM%200227%20V1.docx)
- [`reference-doc/Appendix A - eTysan System_Modulus Experience_v1.1.docx`](../reference-doc/Appendix%20A%20-%20eTysan%20System_Modulus%20Experience_v1.1.docx)
- [`reference-doc/Modulus Description for e-Tysan System.pdf`](../reference-doc/Modulus%20Description%20for%20e-Tysan%20System.pdf)

### 4.3 优先展示“闭环”

客户最容易被打动的不是单独一个表单，而是闭环：

- 发起
- 审批/处理
- 回写状态
- 归档/留痕

### 4.4 原型先追求“可信”，再追求“完整”

不需要一开始把所有按钮都做成可操作，但优先模块必须至少各自有 1 个能走通的真实场景。

### 4.5 重要表单与复杂功能优先使用独立页面

不要把所有交互都塞进侧栏。对于下面这些场景，建议直接进入新的页面，而不是只用 drawer/sidebar 承载：

- 字段很多的核心表单
- 有多步骤状态推进的流程
- 需要同时展示详情、附件、审批链、时间线、审计记录的对象
- 会发生跨模块跳转或深链的关键业务
- 用户会停留较久、需要连续完成多个动作的任务

这类场景通常包括：

- Safety 巡检、ad-hoc issue、事故两阶段上报
- Procurement requisition / quotation analysis / delivery verification
- QS 付款详情与审批流程
- IMS complaint / NCR / CAR
- HR worker profile / leave / certificate
- Plant job sheet / transfer

侧栏和弹窗仍然保留，但只用于轻量动作，例如：

- 快速预览
- 短备注或退回原因
- 权限分享
- 最终确认或电子签核

换句话说，原型不应该是 `drawer-first`，而应该是：

- 复杂主任务：独立页面
- 次级补充操作：侧栏
- 最终确认动作：弹窗

## 5. 最值得优先补强的演示场景

下面这些场景最适合做成可以点击、可以推进状态的原型，且都能直接对齐 reference-doc。

### 5.1 Safety：Ad-hoc Issue 现场问题发现到整改闭环

来源对齐：

- Clarification 文档明确要求演示“安全主任巡查时发现一个不在预定义 checklist 里的问题，如何拍照、定位、指派分判并跟进到完成”。

原型建议：

- `Start inspection` 进入移动端样式的巡检详情页
- 在巡检页中点击 `Log new issue`
- 进入 issue 表单页：照片、位置/zone、严重程度、到期日、责任分判、备注
- 提交后自动进入整改流程时间线：
  `Created -> Assigned -> Acknowledged -> Rectified -> Verified -> Closed`
- 整改方上传 before/after 证据
- 安全主任点击 `Verify` 后关闭事项
- 同步展示 audit trail 和通知记录

这是最应该优先实现的场景之一，因为它最接近客户口中的“最终产品怎么工作”。

### 5.2 Safety：事故两阶段上报与 RCA

来源对齐：

- PRD 与 Modulus Description 都提到事故两阶段上报。
- Clarification 中也强调 preliminary -> investigation -> close 的过程。

原型建议：

- `Report incident` 打开第一阶段表单页：基本事件、时间、地点、伤害等级、临时措施
- 提交后生成事件编号，并显示 `Stage 1 submitted`
- 在事件详情中解锁第二阶段调查表：
  根因分析、责任归属、纠正措施、附件、管理层确认
- 右侧用 stepper 展示：
  `Preliminary -> Investigation -> RCA -> Closed`

### 5.3 Safety：Toolbox Talk / E-Training Attendance

来源对齐：

- Clarification 明确要求演示 100+ 工人 Toolbox Talk 的 mass attendance。
- 文档明确提到 RFID/NFC 扫卡、手动 fallback、同步到 HR/Training。

原型建议：

- `Create form` 或单独 `Start toolbox talk` 打开会话创建页
- 展示 topic、date、site、trainer、attendance method
- 在移动端样式里展示：
  `Tap card` / `Manual mode` 两种 check-in
- 勾选或刷卡后，出勤名单即时累加
- 完成后显示：
  `Synced to worker profile / training record`

这个场景能很好体现移动端、现场应用和跨模块联动。

### 5.4 Procurement：Requisition -> Quotation Analysis -> Approval -> PO -> Delivery -> QS Handover

来源对齐：

- PRD 已定义采购主流程。
- Modulus Description 明确给了采购申请字段和大额采购的 `Quotation Analysis Report (over $100,000)` 审批链。

原型建议：

- `New requisition` 打开采购申请页
- 字段直接对齐文档：
  `Job number / request date / item / quantity / delivery date / delivery location / requester / site supervisor sign / project manager sign`
- 如果金额超过阈值，自动进入 `Quotation Analysis Report` 页面
- 审批链直接按文件展示：
  `Head of Cost & Commercial -> Technical Director -> Director -> President -> Vice Chairman`
- 审批完成后生成 PO
- `Scan delivery note` 打开收货 / Delivery Note 验证页
- 最后进入 `QS handover` 状态，并可跳转到 QS 付款流程

这是最适合做“跨模块串联”的演示场景。

### 5.5 QS：Payment Application / Payment Certificate / OCR Review

来源对齐：

- PRD 与 Modulus Description 已明确列出 `Payment Application`、`Payment Certificate`、`Subcontractor’s Payment Certificate/Invoice`。
- 文档还强调 OCR 与自动归档。

原型建议：

- 在付款列表中点击某张记录进入付款详情
- 详情页显示：
  发票扫描图、OCR 摘取结果、金额、工作内容、扣款/调整、审批意见
- `Certify payment` 触发电子签核弹窗
- `Request revision` 触发退回并记录 comment
- 提交后时间线推进：
  `Request -> OCR extracted -> QS verify -> Director certify`
- 允许从 QS 详情跳转查看关联 Procurement PO / Delivery Note

### 5.6 DMS：文件上传、审批、共享与外部访问控制

来源对齐：

- Modulus Description 里给出 Project DMS/Safety DMS 的分类与审批要求。
- DMS 需要体现 OCR、版本控制、外部分享、水印、权限和审计。

原型建议：

- `Upload` 打开上传页：
  library、phase、category、owner、version、external access、watermark
- `Open for review` 打开文档详情页，展示：
  文件预览、版本、审批链、外部分享对象、到期时间
- `Share` 打开外部共享权限侧栏或轻量表单
- 文件夹 drill-down 可以对齐文档分类，例如：
  `PR-A10 Inspection Form / Photos`
  `PR-A13 Incident Report`
  `PR-A16 Complaint Record`

### 5.7 IMS：Complaint / NCR / CAR 与 Environmental Inspection

来源对齐：

- Appendix A 与 Modulus Description 都提到：
  `Client Complaint Record`、`NCR`、`CAR`、`Request for Inspection`、环境巡检与许可证管理。

原型建议：

- `New complaint` 打开客诉页面，提交后自动生成 `CAR`
- CAR 详情展示调查、根因、整改、电子签署、关闭
- `Start inspection` 打开环境巡检页面，支持照片、问题数量、整改前后对照
- Permit 列表中的 `Renewal log` 打开续期申请详情和到期提醒

### 5.8 HR：Worker Profile / Leave / Certificate

来源对齐：

- PRD 提到档案、请假、培训、资格证有效期。
- Clarification 提到跨工地 worker profile 即时查看历史。
- Modulus Description 提到 `Green Card`、资格、入离职流程。

原型建议：

- 员工/工人列表点击后进入完整档案
- 档案中展示：
  基本资料、Green Card、培训记录、事故记录、当前工地、历史转场
- `Apply leave` 打开请假申请页
- `Upload certificate` 打开证书上传和到期提醒页
- Safety 模块中的 worker 可以深链到 HR 档案

### 5.9 Plant：Job Sheet / Transfer Note / Inspection Record

来源对齐：

- PRD 与 Modulus Description 明确提到：
  `Job sheet`、`Inspection record`、`Transfer note`、`Plant hire return`、`Material disposal`

原型建议：

- `New job sheet` 打开维修工单页
- `Create transfer` 打开转场申请页
- 巡检记录点击后进入 inspection detail
- 设备详情页展示位置、状态、最近维修、证照、转移历史

## 6. 建议的“按钮到二级原型”映射

| 模块 | 当前入口/按钮 | 建议打开的二级展示 | 说明 |
| --- | --- | --- | --- |
| Home | Approval queue / notifications | 统一审批详情页 | 让首页可直接进入对象详情，而不是只做导航 |
| DMS | `Upload` | 文件上传页 | 重要字段较多，适合用完整页面展示 |
| DMS | `Share` | 权限设置侧栏/弹窗 | 轻量权限动作可以保留在侧栏 |
| DMS | `Open for review` | 文档详情页 | 对齐版本、审批链、外部分享 |
| Safety | `Start inspection` | 巡检详情页 + issue 表单页 | 对齐 checklist、拍照、定位、整改 |
| Safety | `Report incident` | 两阶段事故页 | 对齐 preliminary + investigation + RCA |
| Safety | `Create form` | e-form builder / toolbox talk 页 | 对齐 no-code form 和培训签到 |
| Procurement | `New requisition` | 采购申请页 | 对齐 Job no、送货、签核 |
| Procurement | `Timeline` / `Track` | PO 流程详情页 | 展示从 requisition 到 QS handover |
| Procurement | `Scan delivery note` | 收货/送货单确认页 | 强化现场与后端串联 |
| QS | `Certify payment` | 付款详情页 + 电子签核弹窗 | 详情放在页面，签核确认可保留弹窗 |
| QS | `Request revision` | 退回原因弹窗/轻量表单 | 体现 workflow 分支 |
| IMS | `New complaint` | Complaint + CAR 流程页 | 对齐客诉/NCR/CAR |
| IMS | `Start inspection` | 环境巡检页 | 对齐 monthly environmental inspection |
| HR | `New hire` / `Add staff` | 员工档案页 | 对齐入职资料和资格 |
| HR | `Apply leave` | 请假申请页 + 审批状态 | 对齐 leave workflow |
| HR | `Upload certificate` | 证书上传与到期提醒页 | 对齐 Green Card / training cert |
| Plant | `New job sheet` | 维修工单页 | 对齐 repair & maintenance |
| Plant | `Create transfer` / `Transfer request` | 转场申请页与审批 | 对齐 transfer note |

## 7. 为了让客户“看见最终产品”，原型里必须补的展示元素

建议每个重点场景至少具备以下 6 类元素：

1. 业务对象详情
   例如单据头、状态、编号、项目、责任人、附件。
2. 表单本体
   要能看到字段，而不是只有按钮。
3. 流程 stepper
   让客户知道现在在哪一环、下一步是什么。
4. 操作按钮
   至少要有提交、审批、退回、关闭、上传证据等动作。
5. 时间线 / 审计轨迹
   展示谁在什么时候做了什么。
6. 状态回写
   动作完成后，列表卡片和详情状态要同步变化。

如果这 6 类元素没有出现，客户仍然很难把原型理解成“接近最终系统”的产品。

## 8. 基于现有 React 原型的实现方式

建议不要推翻现有结构，而是在当前代码基础上补一层统一的页面级交互框架。

### 8.1 保留现有模块页，新增统一的页面级交互框架

建议新增可复用组件：

- `RecordPageLayout`
- `WorkflowPage`
- `FormPage`
- `QuickActionDrawer`
- `QuickActionModal`
- `AuditTimeline`
- `RecordHeader`
- `MobilePreviewFrame`（给 Safety 场景）

同时建议统一页面路由模式，例如：

- `/:module/:recordId`
- `/:module/new`
- `/:module/:recordId/workflow`

这样每个模块不需要单独发明一套交互模式，也能避免复杂流程都挤进侧栏。

### 8.2 用数据驱动场景，而不是把逻辑写死在按钮里

建议新增一组场景数据，例如：

- `src/data/scenarios/safety.js`
- `src/data/scenarios/procurement.js`
- `src/data/scenarios/qs.js`

每个场景定义：

- 标题
- 对应模块
- 表单字段
- 当前状态
- 可执行动作
- 审批链
- 时间线
- 关联记录

这样既方便快速搭原型，也方便以后继续扩展。

### 8.3 给按钮接入统一事件

当前多数按钮缺动作。建议统一接到：

- 切换到详情页
- 切换到表单页
- 切换到流程页
- 打开轻量抽屉
- 打开确认弹窗
- 执行一次模拟状态变更

优先级建议明确为“先 page，后 drawer/modal”。先做“前端状态驱动的高可信原型”，不需要一开始就接真实后端。

### 8.4 增加角色切换

建议在顶栏加入角色切换：

- Requester
- Reviewer
- Approver
- Admin

同一个流程在不同角色下展示不同按钮，客户会更容易理解 RBAC 和审批链逻辑。

### 8.5 增加跨模块深链

最值得补的跨模块联动包括：

- Safety incident -> DMS incident document
- Safety worker -> HR worker profile
- Procurement PO -> QS payment record
- IMS complaint -> DMS evidence folder

客户往往会通过这些“串起来的地方”判断系统是否真的像一个平台，而不是多个孤立页面。

## 9. 建议的实现优先级

### 第一阶段：先把 5 个核心故事做通

建议优先做：

- Safety ad-hoc issue
- Safety incident report
- Procurement requisition to PO
- QS payment approval
- DMS upload/review/share

做到这一步，客户已经能明显感知产品不是静态页面。

### 第二阶段：补跨模块联动和角色视角

建议补：

- Worker profile 跨 Safety / HR
- Delivery note 跨 Procurement / QS
- Complaint / CAR 跨 IMS / DMS
- 角色切换
- 审批时间线

### 第三阶段：补高保真演示细节

建议补：

- 移动端框架展示
- 电子签核弹窗
- OCR 识别结果对照
- 推送/通知/升级提醒
- Demo mode / guided tour

## 10. 建议的原型验收标准

如果目标是“让客户更清楚最终产品长什么样”，建议把原型增强验收标准定成下面这样：

- 每个优先模块至少有 1 个可以完整点击走通的业务场景
- 每个重点按钮点击后都能进入详情、表单或流程，而不是无响应
- 每个重点场景都能看到表单字段、审批链、状态变化、审计轨迹
- 至少有 3 条跨模块联动路径
- 至少有 1 个移动端现场场景
- 所有场景名称、节点名称、表单名称尽量对齐 reference-doc

## 11. 总结

当前原型的问题不是“页面不够多”，而是“缺少可进入下一层的业务行为”。  
下一步最有效的方向，是把现有模块页升级为“可点击进入详情、可填写表单、可推进状态、可看到流程闭环”的二级交互原型。

如果按上面的方式补强，客户将不再只是看到模块目录，而是能真实感受到：

- 一条业务是怎么发起的
- 谁来审批
- 表单长什么样
- 状态如何变化
- 资料最后如何归档和追踪

这会比继续单纯补页面，更接近“最终产品体验”的演示效果。
