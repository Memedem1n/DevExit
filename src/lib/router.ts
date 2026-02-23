export enum AppRouter {
  HOME = "/",
  EXPLORE = "/explore",
  PRICING = "/pricing",
  DASHBOARD = "/dashboard",
  CHAT = "/chat",
  LOGIN = "/login",
  REGISTER = "/register",
  PROJECT_DETAIL = "/project",
}

export const PUBLIC_TABS = [
  { label: "Marketplace", path: AppRouter.EXPLORE, icon: "Compass" },
  { label: "Elite Boosts", path: AppRouter.PRICING, icon: "Zap" },
];

export const PROTECTED_TABS = [
  { label: "Dashboard", path: AppRouter.DASHBOARD, icon: "LayoutDashboard" },
  { label: "Messages", path: AppRouter.CHAT, icon: "MessageCircle" },
];
