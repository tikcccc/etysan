export const modules = [
  {
    code: "B",
    name: "Emailing System",
    summary: "Secure messaging with compliance controls.",
    tags: ["DMARC", "2FA", "Webmail"],
  },
  {
    code: "C",
    name: "Project DMS",
    summary: "Project documentation with OCR and versioning.",
    tags: ["OCR", "Tender", "Drawings"],
  },
  {
    code: "D",
    name: "Safety DMS",
    summary: "Safety records with audit trail governance.",
    tags: ["Watermark", "Encryption", "Approvals"],
  },
  {
    code: "E",
    name: "Safety",
    summary: "Mobile inspections and incident reporting.",
    tags: ["Offline", "RCA", "Forms"],
  },
  {
    code: "F",
    name: "Quality (IMS)",
    summary: "NCR/CAR workflows and reporting.",
    tags: ["Quality", "Reports", "Signatures"],
  },
  {
    code: "G",
    name: "Environmental (IMS)",
    summary: "Environmental checks and permit tracking.",
    tags: ["Checklist", "Permits", "Reminders"],
  },
  {
    code: "H",
    name: "QS",
    summary: "Contract, cost, and invoice automation.",
    tags: ["OCR", "Zero Trust", "Payments"],
  },
  {
    code: "I",
    name: "Procurement",
    summary: "Requisition to PO with vendor control.",
    tags: ["Rates", "Quotation", "PO"],
  },
  {
    code: "J",
    name: "Human Resources",
    summary: "Employee lifecycle and training records.",
    tags: ["Profiles", "Payroll", "Training"],
  },
  {
    code: "K",
    name: "Plant",
    summary: "Equipment lifecycle and inspections.",
    tags: ["Maintenance", "Hire", "Inspections"],
  },
];

export const sidebarPrimary = [
  "Home",
  "Webmail",
];

export const sidebarModules = [
  "DMS",
  "Procurement",
  "Safety (4S)",
  "IMS",
  "Plant",
  "QS",
  "Attendance",
];

export const kpis = [
  { label: "Open Approvals", value: "128", delta: "+14 today" },
  { label: "Active Projects", value: "42", delta: "7 sites" },
  { label: "Safety Patrols", value: "96%", delta: "Monthly coverage" },
  { label: "OCR Index", value: "1.8M", delta: "Searchable pages" },
];

export const memos = [
  {
    title: "General",
    detail: "Company memo: annual rate cards updated for Q1.",
  },
  {
    title: "Safety",
    detail: "Site safety briefing checklist to be completed by Feb 2.",
  },
  {
    title: "IMS",
    detail: "Quality summary report for January now published.",
  },
];

export const notifications = [
  {
    title: "Safety",
    detail: "Follow-up action required on incident IM-2026-008.",
  },
  {
    title: "Procurement",
    detail: "Item to be approve/decline: PO-2026-102.",
  },
  {
    title: "DMS / Material Summary",
    detail: "Monthly update uploaded for West Kowloon package.",
  },
  {
    title: "Plant",
    detail: "Monthly maintenance summary ready for review.",
  },
];

export const approvals = [
  {
    id: "PA-2026-014",
    title: "Payment Application",
    module: "QS",
    owner: "C. Lau",
    due: "Today",
    status: "Pending",
  },
  {
    id: "PO-2026-102",
    title: "Purchase Order",
    module: "Procurement",
    owner: "J. Wong",
    due: "Jan 30",
    status: "Review",
  },
  {
    id: "IM-2026-008",
    title: "Incident Report",
    module: "Safety",
    owner: "S. Ahmed",
    due: "Jan 31",
    status: "Urgent",
  },
  {
    id: "HR-2026-021",
    title: "Training Allowance",
    module: "Human Resources",
    owner: "M. Chan",
    due: "Feb 1",
    status: "Pending",
  },
];

export const tasks = [
  {
    title: "Finalize environmental checklist - Site 3",
    module: "Environmental",
    due: "Today",
    priority: "High",
  },
  {
    title: "Issue drawing set to consultants",
    module: "Project DMS",
    due: "Jan 30",
    priority: "Medium",
  },
  {
    title: "Update annual rate card review",
    module: "Procurement",
    due: "Feb 2",
    priority: "Low",
  },
  {
    title: "Verify crane inspection record",
    module: "Plant",
    due: "Feb 3",
    priority: "Medium",
  },
];

export const projects = [
  {
    name: "West Kowloon Rail Extension",
    location: "Kowloon",
    phase: "Construction",
    progress: 72,
    next: "Monthly safety report",
  },
  {
    name: "Tsing Yi Logistics Hub",
    location: "New Territories",
    phase: "Tender",
    progress: 38,
    next: "Bid clarification",
  },
  {
    name: "Kai Tak Terminal Upgrade",
    location: "Kowloon",
    phase: "Design",
    progress: 54,
    next: "Stakeholder approval",
  },
];

export const projectOptions = [
  "All Projects",
  "West Kowloon Rail Extension",
  "Tsing Yi Logistics Hub",
  "Kai Tak Terminal Upgrade",
];

export const compliance = [
  "SSO & RBAC",
  "Audit Trails",
  "TLS/SSL",
  "Disaster Recovery",
  "Offline Sync",
  "Data Retention",
];

export const infra = [
  "On-premises or hybrid deployment",
  "Linux web servers + Windows file servers",
  "Dedicated database & application layer",
  "Intranet with secure web access",
];

export const usefulLinks = [
  "HKO Weather",
  "EPD Portal",
  "NEC / Contact",
  "Construction Updates",
];

export const chatContacts = [
  "Construction",
  "Safety",
];

export const roles = [
  "Requester",
  "Reviewer",
  "Approver",
  "Executive",
  "Admin",
];

export const officeTeams = [
  "Procurement Department",
  "QS Team",
  "HR Department",
  "IMS Team",
  "Finance Department",
];

export const siteTeams = [
  "Project Team (Works & DMS)",
  "Safety Team",
  "Plant Team",
];
