/**
 * VendorIQ — single source of truth for all project data.
 * Every number here comes from the project's real dataset / results.
 */

export const BRAND = {
  name: "VendorIQ",
  tagline: "Autonomous AI-Powered Procurement Intelligence for Indian MSMEs",
  sub: "A zero-ERP, CSV-native procurement intelligence platform built for Indian MSMEs.",
};

/* ---------------------------------- Home --------------------------------- */

export const HERO_STATS = [
  { value: "₹2.5L Cr", label: "Annual procurement loss", note: "Indian MSME sector" },
  { value: "63M", label: "MSME enterprises", note: "Across India" },
  { value: "110M+", label: "People employed", note: "By the MSME sector" },
  { value: "30%", label: "Contribution to GDP", note: "National output" },
  { value: "90%+", label: "Still manual", note: "Procurement decisions" },
];

export const FAILURE_MODES = [
  {
    id: "forecast",
    title: "Demand Forecasting Gap",
    summary:
      "Orders are placed on historical averages with no seasonal or production-schedule integration.",
    detail:
      "Purchase quantities are extrapolated from last quarter's consumption. Festival cycles, monsoon slowdowns and confirmed production schedules never enter the calculation, so buffers are simultaneously too large on slow SKUs and too thin on critical ones.",
    icon: "chart",
  },
  {
    id: "vendor",
    title: "Informal Vendor Selection",
    summary:
      "Suppliers are chosen on relationship or headline price alone — no quantitative scoring.",
    detail:
      "Quality history, lead-time adherence and compliance records live in WhatsApp threads and paper files. Without a composite score, a vendor with the lowest quote but a 9.2% defect rate keeps winning orders.",
    icon: "users",
  },
  {
    id: "reorder",
    title: "Reactive Reordering",
    summary:
      "Reorder is triggered after a stockout — emergency purchases at premium prices.",
    detail:
      "The reorder signal is a shop-floor shortage, not a forecast. Line stoppages force spot buys at 15–30% premiums, expedited freight and unvetted substitute vendors.",
    icon: "alert",
  },
] as const;

/* ------------------------------ Architecture ----------------------------- */

export const ARCHITECTURE_LAYERS = [
  {
    id: "ingestion",
    index: "01",
    title: "Data Ingestion Layer",
    subtitle: "CSV-native, no ERP required",
    description:
      "Buyers upload the files they already keep. Nothing needs to be re-keyed into an ERP — the platform normalises raw exports into a queryable procurement store.",
    components: [
      { name: "Purchase Order CSVs", note: "Primary transaction feed" },
      { name: "Vendor Records", note: "Master supplier registry" },
      { name: "Defect Reports", note: "Goods-receipt rejections" },
      { name: "QC Logs", note: "Inspection outcomes" },
    ],
    stack: ["PostgreSQL", "MongoDB", "Real-time sync"],
  },
  {
    id: "ml",
    index: "02",
    title: "ML Processing Layer",
    subtitle: "Forecasting + classification",
    description:
      "Two model families run side by side: a hybrid time-series ensemble for demand and a gradient-boosted classifier for delivery/compliance risk, with imbalance correction and full experiment tracking.",
    components: [
      { name: "LSTM–Prophet Forecasting", note: "Hybrid demand ensemble" },
      { name: "XGBoost Classifier", note: "90.03% test accuracy" },
      { name: "SMOTE-NC Balancing", note: "85/15 → 50/50" },
      { name: "MLflow Tracking", note: "Runs, params, artefacts" },
    ],
    stack: ["scikit-learn", "XGBoost", "Prophet", "TensorFlow", "MLflow"],
  },
  {
    id: "intelligence",
    index: "03",
    title: "Intelligence Layer",
    subtitle: "Where scores become actions",
    description:
      "Model outputs are converted into procurement decisions: a weighted Vendor Performance Index, automatic RFQ dispatch on a forecast trigger, and a planned computer-vision QC path.",
    components: [
      { name: "VPI Scoring Engine", note: "α·PCS + β·QRS + γ·LTAS + δ·CRS" },
      { name: "Auto-RFQ Generator", note: "Dispatched to top-3 VPI suppliers" },
      { name: "CV Quality Control", note: "Future — mobile CNN at goods receipt" },
    ],
    stack: ["Rule + ML hybrid", "Explainable weights", "Event-driven"],
  },
  {
    id: "api",
    index: "04",
    title: "API & Backend Layer",
    subtitle: "Async, authenticated, real-time",
    description:
      "A typed REST surface with token auth, background workers for long-running model jobs, and push channels so reorder alerts reach the buyer the moment a threshold breaks.",
    components: [
      { name: "FastAPI REST", note: "Typed endpoints + OpenAPI" },
      { name: "JWT Auth", note: "Role-scoped access" },
      { name: "Celery Task Queue", note: "Redis broker" },
      { name: "WebSocket Alerts", note: "Live ROP breach push" },
    ],
    stack: ["FastAPI", "Redis", "Celery", "WebSockets"],
  },
  {
    id: "frontend",
    index: "05",
    title: "Frontend Layer",
    subtitle: "Desk, floor and admin",
    description:
      "A KPI-first web dashboard for the procurement desk, a mobile app for shop-floor quality capture, and an admin panel for vendor master data and thresholds.",
    components: [
      { name: "React Web Dashboard", note: "KPI analytics + VPI board" },
      { name: "React Native Mobile", note: "Factory-floor QC capture" },
      { name: "Admin Panel", note: "Vendors, thresholds, users" },
    ],
    stack: ["React", "React Native", "Recharts"],
  },
];

/* --------------------------- Dataset & EDA ------------------------------- */

export const DATASET_STATS = [
  { value: "777", label: "Purchase Orders", note: "Jan 2022 – Jan 2024" },
  { value: "5", label: "Suppliers", note: "Alpha · Beta · Delta · Epsilon · Gamma" },
  { value: "6", label: "Item Categories", note: "Commodity + specialty" },
  { value: "11", label: "Features per record", note: "Post feature engineering" },
];

export const ORDER_STATUS = [
  { name: "Delivered", value: 555 },
  { name: "Cancelled", value: 140 },
  { name: "Partially Delivered", value: 55 },
  { name: "Pending", value: 27 },
];

export const SUPPLIERS = [
  { supplier: "Alpha", short: "Alpha", deliveryRate: 82, defectRate: 6.8, vpi: 0.824 },
  { supplier: "Beta", short: "Beta", deliveryRate: 78, defectRate: 7.9, vpi: 0.781 },
  { supplier: "Delta", short: "Delta", deliveryRate: 72, defectRate: 9.2, vpi: 0.699 },
  { supplier: "Epsilon", short: "Epsilon", deliveryRate: 84, defectRate: 5.5, vpi: 0.857 },
  { supplier: "Gamma", short: "Gamma", deliveryRate: 76, defectRate: 8.1, vpi: 0.775 },
];

export const LEAD_TIME_HIST = [
  { bucket: "<7d", orders: 15 },
  { bucket: "7-10d", orders: 42 },
  { bucket: "11-14d", orders: 68 },
  { bucket: "15-18d", orders: 72 },
  { bucket: "19-22d", orders: 55 },
  { bucket: "23-26d", orders: 38 },
  { bucket: ">26d", orders: 22 },
];

export const DATASET_INSIGHTS = [
  {
    headline: "1,542 units average order size",
    body: "Order quantities range from 171 to 5,000 units — a 29× spread that makes flat reorder rules unusable.",
  },
  {
    headline: "8.23% average negotiated saving",
    body: "Negotiated price lands 8.23% below quoted unit price on average, but the saving is unevenly distributed across suppliers.",
  },
  {
    headline: "8.14% average defect rate",
    body: "Roughly 1 in every 12 units received is defective — the single strongest predictor in the classifier.",
  },
  {
    headline: "82.4% compliance rate",
    body: "640 of 777 purchase orders were fully compliant; the remaining 137 carry documentation or specification gaps.",
  },
  {
    headline: "Bimodal lead-time distribution",
    body: "Two clear peaks — 14 days for commodity items and 21 days for specialty items — mean 16.3 days.",
  },
  {
    headline: "Missing values handled via imputation",
    body: "Defective_Units was 22.8% missing and Lead_Time_Days 15.2% missing; both imputed inside the pipeline to avoid leakage.",
  },
];

export const ENGINEERED_FEATURES = [
  {
    name: "defect_rate_perc",
    formula: "(Defective_Units ÷ Quantity_Ordered) × 100",
    why: "Normalises quality failures against order size so a 50-unit rejection on a 200-unit order outranks the same rejection on a 5,000-unit order. Highest-gain feature in the model (0.31).",
  },
  {
    name: "lead_time_days",
    formula: "Delivery_Date − Order_Date (in days)",
    why: "Converts two raw timestamps into the operationally meaningful quantity: how long the buyer actually waited. Captures the bimodal commodity/specialty split.",
  },
  {
    name: "cost_savings_perc",
    formula: "((Unit_Price − Negotiated_Price) ÷ Unit_Price) × 100",
    why: "Measures negotiation effectiveness independent of absolute price level, making a ₹40 fastener and a ₹40,000 casting directly comparable.",
  },
];

export const PREPROCESSING_STEPS = [
  { step: "Numerical Imputation", note: "Median fill for Defective_Units & Lead_Time_Days" },
  { step: "StandardScaler", note: "Zero-mean, unit-variance on continuous features" },
  { step: "Categorical Imputation", note: "Most-frequent fill for supplier & item category" },
  { step: "OneHotEncoder", note: "handle_unknown='ignore' for unseen categories" },
  { step: "SMOTE-NC", note: "Class balance 85/15 → 50/50" },
  { step: "75-25 Stratified Split", note: "Class ratio preserved in both folds" },
];

/* ------------------------------- ML Models ------------------------------- */

export interface ModelRow {
  model: string;
  accuracy: number;
  f1: number;
  auc: number;
  trainAcc?: number;
}

export const MODEL_BENCHMARK: ModelRow[] = [
  { model: "XGBoost", accuracy: 90.03, f1: 0.9, auc: 0.935, trainAcc: 100 },
  { model: "Random Forest", accuracy: 89.43, f1: 0.887, auc: 0.931, trainAcc: 100 },
  { model: "Gradient Boosting", accuracy: 85.8, f1: 0.856, auc: 0.908, trainAcc: 94.3 },
  { model: "Decision Tree", accuracy: 80.06, f1: 0.798, auc: 0.801, trainAcc: 100 },
  { model: "SVM-RBF", accuracy: 79.46, f1: 0.789, auc: 0.846, trainAcc: 84.6 },
  { model: "KNN", accuracy: 77.64, f1: 0.772, auc: 0.822 },
  { model: "AdaBoost", accuracy: 75.53, f1: 0.751, auc: 0.804 },
  { model: "Naive Bayes", accuracy: 63.44, f1: 0.618, auc: 0.681 },
  { model: "Logistic Regression", accuracy: 62.24, f1: 0.609, auc: 0.664 },
];

export const ORACLE_BASELINE = 89;

export const TOP_MODELS = [
  {
    model: "XGBoost",
    rank: "Selected model",
    accuracy: 90.03,
    f1: 0.9,
    auc: 0.935,
    trainAcc: 100,
    note: "Gradient-boosted trees with SMOTE-NC balanced training. Beats the Oracle AI baseline by 1.03 points.",
  },
  {
    model: "Random Forest",
    rank: "Runner-up",
    accuracy: 89.43,
    f1: 0.887,
    auc: 0.931,
    trainAcc: 100,
    note: "Within 0.6 points of XGBoost and far cheaper to tune — a viable fallback for low-resource deployments.",
  },
  {
    model: "Gradient Boosting",
    rank: "Third",
    accuracy: 85.8,
    f1: 0.856,
    auc: 0.908,
    trainAcc: 94.3,
    note: "The only top-3 model that does not memorise the training fold (94.3% train accuracy).",
  },
];

export const FEATURE_IMPORTANCE = [
  { feature: "defect_rate_perc", gain: 0.31 },
  { feature: "compliance", gain: 0.19 },
  { feature: "cost_savings_perc", gain: 0.14 },
  { feature: "lead_time_days", gain: 0.12 },
  { feature: "order_month", gain: 0.07 },
  { feature: "order_year", gain: 0.06 },
  { feature: "quantity", gain: 0.04 },
  { feature: "unit_price", gain: 0.03 },
  { feature: "negotiated_price", gain: 0.02 },
  { feature: "supplier", gain: 0.01 },
  { feature: "item_category", gain: 0.01 },
];

export const OVERFIT_CHECK = [
  { model: "XGBoost", train: 100, test: 90.03 },
  { model: "Random Forest", train: 100, test: 89.43 },
  { model: "Gradient Boosting", train: 94.3, test: 85.8 },
  { model: "Decision Tree", train: 100, test: 80.06 },
  { model: "SVM-RBF", train: 84.6, test: 79.46 },
];

export const SOTA_COMPARISON = [
  {
    system: "VendorIQ (this work)",
    model: "XGBoost",
    accuracy: "90.03%",
    auc: "0.935",
    erpFree: true,
    ours: true,
  },
  { system: "Muntala 2021 / Oracle AI", model: "Ensemble", accuracy: "89%", auc: "0.93", erpFree: false, ours: false },
  { system: "Gao et al. 2023", model: "Deep hybrid", accuracy: "84%", auc: "0.87", erpFree: false, ours: false },
  { system: "Jahin et al. 2025", model: "Boosted ensemble", accuracy: "88%", auc: "0.91", erpFree: false, ours: false },
  { system: "SciDirect 2023", model: "Random Forest", accuracy: "81%", auc: "0.84", erpFree: false, ours: false },
];

/* ------------------------------- VPI Engine ------------------------------ */

export const VPI_WEIGHTS = {
  alpha: 0.25, // PCS
  beta: 0.35, // QRS
  gamma: 0.25, // LTAS
  delta: 0.15, // CRS
};

export const VPI_COMPONENTS = [
  {
    key: "pcs" as const,
    symbol: "α",
    code: "PCS",
    name: "Price Competitiveness Score",
    weight: VPI_WEIGHTS.alpha,
    desc: "Average cost saving achieved versus the market benchmark price for the same item class.",
  },
  {
    key: "qrs" as const,
    symbol: "β",
    code: "QRS",
    name: "Quality Risk Score",
    weight: VPI_WEIGHTS.beta,
    desc: "Inverse of the defect rate per order. Carries the highest weight — quality failures cost more than price gaps.",
  },
  {
    key: "ltas" as const,
    symbol: "γ",
    code: "LTAS",
    name: "Lead-Time Adherence Score",
    weight: VPI_WEIGHTS.gamma,
    desc: "Share of orders delivered inside the contracted delivery window.",
  },
  {
    key: "crs" as const,
    symbol: "δ",
    code: "CRS",
    name: "Compliance Risk Score",
    weight: VPI_WEIGHTS.delta,
    desc: "Compliance rate across every purchase order raised with the supplier.",
  },
];

export interface SupplierProfile {
  id: string;
  name: string;
  pcs: number;
  qrs: number;
  ltas: number;
  crs: number;
  vpi: number;
  defectRate: number;
  compliance: number;
  deliveryRate: number;
}

/**
 * Component scores are reconstructed so that
 * 0.25·PCS + 0.35·QRS + 0.25·LTAS + 0.15·CRS reproduces the published VPI.
 */
export const SUPPLIER_PROFILES: SupplierProfile[] = [
  {
    id: "epsilon",
    name: "Epsilon_Group",
    pcs: 70,
    qrs: 95.9,
    ltas: 84,
    crs: 91,
    vpi: 0.857,
    defectRate: 5.5,
    compliance: 91,
    deliveryRate: 84,
  },
  {
    id: "alpha",
    name: "Alpha_Supplies",
    pcs: 74,
    qrs: 88.0,
    ltas: 82,
    crs: 84,
    vpi: 0.824,
    defectRate: 6.8,
    compliance: 84,
    deliveryRate: 82,
  },
  {
    id: "beta",
    name: "Beta_Industries",
    pcs: 71,
    qrs: 82.4,
    ltas: 78,
    crs: 80,
    vpi: 0.781,
    defectRate: 7.9,
    compliance: 80,
    deliveryRate: 78,
  },
  {
    id: "gamma",
    name: "Gamma_Traders",
    pcs: 76,
    qrs: 79.4,
    ltas: 76,
    crs: 78,
    vpi: 0.775,
    defectRate: 8.1,
    compliance: 78,
    deliveryRate: 76,
  },
  {
    id: "delta",
    name: "Delta_Logistics",
    pcs: 88,
    qrs: 53.7,
    ltas: 72,
    crs: 74,
    vpi: 0.699,
    defectRate: 9.2,
    compliance: 74,
    deliveryRate: 72,
  },
];

/* --------------------------- Demand Forecasting -------------------------- */

export const FORECAST_PIPELINE = [
  {
    id: "data",
    title: "Historical PO Data",
    detail: "24 months of purchase orders, aggregated to a daily demand series per item category.",
  },
  {
    id: "features",
    title: "Feature Engineering",
    detail: "Seasonality decomposition plus confirmed production-schedule signals joined onto the series.",
  },
  {
    id: "lstm",
    title: "LSTM Model",
    detail: "2 stacked layers (64 + 32 units), dropout 0.2, 30-day input window — learns non-linear short-horizon structure.",
  },
  {
    id: "prophet",
    title: "Prophet Model",
    detail: "y(t) = g(t) + s(t) + h(t) + ε(t) — trend, seasonality, holiday effects and error term.",
  },
  {
    id: "ensemble",
    title: "Ensemble Combiner",
    detail: "Inverse-RMSE weighted average: the model with lower validation RMSE receives proportionally more weight.",
  },
  {
    id: "signal",
    title: "Reorder Signal + Auto-RFQ",
    detail: "Forecast crosses the reorder point → RFQ is generated and dispatched to the top-3 VPI suppliers.",
  },
];

export const FORECAST_STATS = [
  { value: "90%", label: "Forecast accuracy", note: "Design specification" },
  { value: "95%", label: "Confidence interval", note: "On every horizon point" },
  { value: "12 mo", label: "Rolling input window", note: "Continuously refreshed" },
  { value: "Wilson", label: "Reorder point formula", note: "Safety-stock aware" },
];

/** Illustrative ensemble demand curve used for the forecast visual. */
export const FORECAST_SERIES = [
  { month: "Feb", actual: 1420, forecast: 1398, lower: 1290, upper: 1506 },
  { month: "Mar", actual: 1510, forecast: 1487, lower: 1372, upper: 1602 },
  { month: "Apr", actual: 1385, forecast: 1421, lower: 1305, upper: 1537 },
  { month: "May", actual: 1602, forecast: 1568, lower: 1447, upper: 1689 },
  { month: "Jun", actual: 1720, forecast: 1691, lower: 1562, upper: 1820 },
  { month: "Jul", actual: 1655, forecast: 1683, lower: 1552, upper: 1814 },
  { month: "Aug", actual: 1498, forecast: 1524, lower: 1401, upper: 1647 },
  { month: "Sep", actual: 1740, forecast: 1712, lower: 1580, upper: 1844 },
  { month: "Oct", actual: 1910, forecast: 1874, lower: 1731, upper: 2017 },
  { month: "Nov", actual: null, forecast: 1958, lower: 1802, upper: 2114 },
  { month: "Dec", actual: null, forecast: 1836, lower: 1683, upper: 1989 },
  { month: "Jan", actual: null, forecast: 1602, lower: 1458, upper: 1746 },
];

/* --------------------------- Inventory & EOQ ----------------------------- */

export const ABC_CLASSES = [
  {
    cls: "A",
    skus: 20,
    value: 80,
    control: "Tight control",
    detail: "Weekly cycle counts, SMS alerts on ROP breach, dual-sourced from top-2 VPI suppliers.",
  },
  {
    cls: "B",
    skus: 30,
    value: 15,
    control: "Standard monitoring",
    detail: "Monthly review, in-app dashboard alerts, single preferred supplier with a named backup.",
  },
  {
    cls: "C",
    skus: 50,
    value: 5,
    control: "Loose control",
    detail: "Quarterly review, bulk reorder to minimise ordering cost, no individual alerting.",
  },
];

export const ALERT_CHANNELS = [
  { title: "Email on ROP breach", detail: "Sent to the procurement owner the moment stock crosses the reorder point.", tag: "All classes" },
  { title: "SMS for Class A items", detail: "High-value SKUs escalate to SMS so line-stopping shortages are never missed.", tag: "Class A" },
  { title: "In-app real-time alert", detail: "WebSocket-pushed banner on the live dashboard with the affected SKU and days of cover.", tag: "Real-time" },
  { title: "Auto-RFQ trigger", detail: "An RFQ is generated and dispatched to the top-3 suppliers ranked by VPI.", tag: "Automated" },
  { title: "Weekly inventory health report", detail: "Rolled-up ABC coverage, stockout near-misses and carrying-cost movement.", tag: "Weekly" },
];

/* ---------------------------- Impact & Results --------------------------- */

export const IMPACT_CARDS = [
  {
    value: "15–20%",
    title: "Procurement Cost Reduction",
    driver: "Driven by VPI-ranked sourcing and Auto-RFQ competition across the top-3 suppliers.",
  },
  {
    value: "~40%",
    title: "Production Downtime Reduction",
    driver: "Driven by forecast-triggered reordering replacing post-stockout emergency purchases.",
  },
  {
    value: "Up to 25%",
    title: "Inventory Carrying Cost Reduction",
    driver: "Driven by EOQ-sized orders and ABC-differentiated safety stock instead of flat buffers.",
  },
];

export const CONCLUSION_METRICS = [
  { value: "90.03%", label: "XGBoost Accuracy" },
  { value: "0.935", label: "AUC-ROC" },
  { value: "0.900", label: "F1-Score" },
  { value: "90%", label: "Forecast Accuracy" },
];

export const RESEARCH_CONTRIBUTIONS = [
  {
    n: "01",
    title: "First end-to-end MSME procurement platform",
    body: "An ERP-free, CSV-native system that takes an MSME from raw purchase-order exports to ranked suppliers and automated reorder signals without any enterprise software prerequisite.",
  },
  {
    n: "02",
    title: "LSTM–Prophet hybrid forecasting",
    body: "A demand engine that combines Prophet's interpretable trend/seasonality/holiday decomposition with an LSTM's non-linear short-horizon learning, fused by inverse-RMSE weighting.",
  },
  {
    n: "03",
    title: "ML-based VPI with Auto-RFQ generation",
    body: "A four-component weighted Vendor Performance Index that converts scattered quality, timing, price and compliance history into a single actionable score — then acts on it automatically.",
  },
  {
    n: "04",
    title: "Nine-classifier empirical benchmark",
    body: "A like-for-like evaluation of nine classifiers on identical folds, with the selected XGBoost model reaching 90.03% and exceeding the 89% Oracle AI baseline.",
  },
];

/* ------------------------------ About page ------------------------------- */

export const LIMITATIONS = [
  {
    title: "Dataset scale",
    body: "The study is built on 777 purchase orders from 5 suppliers. Conclusions about supplier ranking are internally consistent but not yet generalisable to a wider vendor pool.",
  },
  {
    title: "Possible memorisation",
    body: "XGBoost reaches 100% accuracy on the training fold. Although test accuracy holds at 90.03%, the 10-point gap is consistent with memorisation and warrants stronger regularisation.",
  },
  {
    title: "Forecasting not yet validated",
    body: "The 90% LSTM–Prophet forecast accuracy is a design specification derived from the architecture, not an empirically measured hold-out result.",
  },
  {
    title: "Short temporal coverage",
    body: "The dataset spans only 24 months (Jan 2022 – Jan 2024), which limits how confidently multi-year seasonality can be separated from trend.",
  },
];

export const ROADMAP = [
  {
    title: "Multi-sector MSME Validation",
    body: "Replicate the study across textiles, auto components, food processing and pharma to test whether the VPI weighting transfers between sectors.",
    tag: "Validation",
  },
  {
    title: "SHAP Explainability",
    body: "Move from global gain-based importance to per-prediction SHAP attributions so a buyer can see exactly why a specific PO was flagged.",
    tag: "Interpretability",
  },
  {
    title: "Lightweight Mobile Dashboard",
    body: "A React Native factory-floor app for supervisors — reorder alerts, VPI lookup and QC capture without a desktop.",
    tag: "Product",
  },
  {
    title: "Multi-Class Prediction",
    body: "Extend the binary classifier to predict delivered / partially delivered / delayed / cancelled, matching the four states already present in the data.",
    tag: "Modelling",
  },
  {
    title: "Computer Vision QC Module",
    body: "A mobile CNN that performs defect detection at goods receipt, replacing manual sampling with an image-based inspection record.",
    tag: "Future",
  },
];

export const TEAM = {
  members: ["Nitin Pandey", "Vivek"],
  institution: "Delhi Technological University (DTU)",
  department: "Production & Industrial Engineering",
  supervisor: "Prof. R.S. Mishra",
  project: "B.Tech Major Project 2025–2026",
};

/* -------------------------------- Routing -------------------------------- */

export interface RouteDef {
  path: string;
  label: string;
  short: string;
}

export const ROUTES: RouteDef[] = [
  { path: "/", label: "Home", short: "Home" },
  { path: "/architecture", label: "Architecture", short: "Architecture" },
  { path: "/dataset", label: "Dataset & Insights", short: "Dataset" },
  { path: "/models", label: "ML Models", short: "Models" },
  { path: "/vpi", label: "VPI Calculator", short: "VPI" },
  { path: "/forecasting", label: "Demand Forecasting", short: "Forecast" },
  { path: "/inventory", label: "Inventory & EOQ", short: "Inventory" },
  { path: "/impact", label: "Impact & Results", short: "Impact" },
  { path: "/about", label: "About", short: "About" },
];
