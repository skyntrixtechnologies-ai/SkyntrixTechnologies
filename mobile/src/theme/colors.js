// Mirrors client/tailwind.config.js + client/src/index.css so the mobile app reads as the same product.
export const colors = {
  primary: "#7200F5",
  primaryDark: "#581C87",
  primaryLight: "#F3E8FF",
  secondary: "#2048F5",
  accent: "#8A00F5",
  ink: "#17121F",
  inkMuted: "rgba(23, 18, 31, 0.5)",
  inkFaint: "rgba(23, 18, 31, 0.3)",
  base: "#F8FAFC",
  border: "#E2E8F0",
  white: "#FFFFFF",
  danger: "#DC2626",
  dangerBg: "#FEF2F2",
  success: "#059669",
};

// client/tailwind.config.js backgroundImage["primary-gradient"]: linear-gradient(135deg, #7200F5 0%, #8A00F5 30%, #2048F5 100%)
export const primaryGradient = {
  colors: ["#7200F5", "#8A00F5", "#2048F5"],
  locations: [0, 0.3, 1],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};

export const fonts = {
  display: "PlusJakartaSans_700Bold",
  displayExtraBold: "PlusJakartaSans_800ExtraBold",
  displaySemiBold: "PlusJakartaSans_600SemiBold",
  sans: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemiBold: "Inter_600SemiBold",
  sansBold: "Inter_700Bold",
};

export const radii = { sm: 8, md: 10, lg: 14, xl: 16, pill: 999 };

// client/tailwind.config.js boxShadow + client/src/index.css .card (translated to RN shadow/elevation props).
export const shadows = {
  card: {
    shadowColor: "#17121F",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  soft: {
    shadowColor: "#7200F5",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
};

export const statusColors = {
  published: { bg: "#D1FAE5", fg: "#047857" },
  draft: { bg: "#FEF3C7", fg: "#92400E" },
  archived: { bg: "#F1F5F9", fg: "#475569" },
  scheduled: { bg: "#EDE9FE", fg: "#6D28D9" },
  new: { bg: "#DBEAFE", fg: "#1D4ED8" },
  contacted: { bg: "#E0E7FF", fg: "#4338CA" },
  converted: { bg: "#D1FAE5", fg: "#047857" },
  closed: { bg: "#F1F5F9", fg: "#475569" },
  meeting_scheduled: { bg: "#EDE9FE", fg: "#6D28D9" },
  requirement_collected: { bg: "#CFFAFE", fg: "#0E7490" },
  quotation_sent: { bg: "#FEF3C7", fg: "#92400E" },
  follow_up: { bg: "#FFEDD5", fg: "#C2410C" },
  approved: { bg: "#D1FAE5", fg: "#047857" },
  advance_received: { bg: "#DCFCE7", fg: "#15803D" },
  agreement_signed: { bg: "#CCFBF1", fg: "#0F766E" },
  project_started: { bg: "#CFFAFE", fg: "#0E7490" },
  design_approval: { bg: "#FAE8FF", fg: "#A21CAF" },
  development: { bg: "#F3E8FF", fg: "#7E22CE" },
  testing: { bg: "#FCE7F3", fg: "#BE185D" },
  final_payment: { bg: "#FEF9C3", fg: "#A16207" },
  delivered: { bg: "#D1FAE5", fg: "#047857" },
  support: { bg: "#F1F5F9", fg: "#475569" },
  reviewed: { bg: "#CCFBF1", fg: "#0F766E" },
  interviewed: { bg: "#F3E8FF", fg: "#7E22CE" },
  rejected: { bg: "#FEE2E2", fg: "#B91C1C" },
  hired: { bg: "#D1FAE5", fg: "#047857" },
  active: { bg: "#D1FAE5", fg: "#047857" },
  inactive: { bg: "#F1F5F9", fg: "#475569" },
  paid: { bg: "#D1FAE5", fg: "#047857" },
  unpaid: { bg: "#FEE2E2", fg: "#B91C1C" },
  partial: { bg: "#FEF3C7", fg: "#92400E" },
};

export const getStatusColor = (value) =>
  statusColors[String(value || "draft").toLowerCase()] || { bg: "#F1F5F9", fg: "#475569" };
