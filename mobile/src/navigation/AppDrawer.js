import { createDrawerNavigator } from "@react-navigation/drawer";
import { useWindowDimensions } from "react-native";
import DrawerContent from "./DrawerContent";
import { colors, fonts } from "../theme/colors";

import DashboardStack from "./DashboardStack";
import { createCrudStack } from "./CrudStack";
import { servicesConfig, portfolioConfig, teamConfig, testimonialsConfig, blogConfig } from "../screens/crud/crudConfigs";
import LeadsStack from "./LeadsStack";
import CareersScreen from "../screens/careers/CareersScreen";
import NewsletterScreen from "../screens/newsletter/NewsletterScreen";
import ComingSoon from "../components/ComingSoon";

const Drawer = createDrawerNavigator();

const WIDE_BREAKPOINT = 768;

const baseHeaderOptions = {
  headerStyle: { backgroundColor: colors.white },
  headerTintColor: colors.ink,
  headerTitleStyle: { fontFamily: fonts.display, fontSize: 17 },
  drawerActiveBackgroundColor: "transparent",
};

// Created once at module scope — calling createCrudStack(...) inline in JSX would make a new
// component type every render, which React Navigation treats as unmount/remount (losing nav state).
const ServicesStack = createCrudStack(servicesConfig);
const PortfolioStack = createCrudStack(portfolioConfig);
const TeamStack = createCrudStack(teamConfig);
const TestimonialsStack = createCrudStack(testimonialsConfig);
const BlogStack = createCrudStack(blogConfig);

const PipelineScreen = () => <ComingSoon title="Pipeline Board" note="The drag-and-drop Kanban pipeline is managed from the web admin panel for now." />;
const LeadContactsScreen = () => <ComingSoon title="Lead Contacts" note="Lead contact outreach (WhatsApp/email history) is managed from the web admin panel for now." />;
const QuotationsScreen = () => <ComingSoon title="Quotations" note="Quotation creation and PDF generation are managed from the web admin panel for now." />;
const InvoicesScreen = () => <ComingSoon title="Invoices" note="Invoice creation, payments and PDF generation are managed from the web admin panel for now." />;
const ReceiptsScreen = () => <ComingSoon title="Receipts" note="Receipts are generated automatically and managed from the web admin panel for now." />;
const RequirementsScreen = () => <ComingSoon title="Requirements" note="Requirement forms are managed from the web admin panel for now." />;
const SettingsScreen = () => <ComingSoon title="Settings" note="Site-wide settings are managed from the web admin panel for now." />;
const AdminsScreen = () => <ComingSoon title="Admins" note="Admin account management is managed from the web admin panel for now." />;

export default function AppDrawer() {
  const { width } = useWindowDimensions();
  // Tablets/landscape: keep the drawer pinned open instead of an overlay you have to swipe for.
  const isWide = width >= WIDE_BREAKPOINT;

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        ...baseHeaderOptions,
        drawerType: isWide ? "permanent" : "front",
        drawerStyle: isWide ? { width: 280 } : undefined,
        overlayColor: "rgba(23,18,31,0.4)",
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardStack} options={{ headerShown: false }} />
      <Drawer.Screen name="Services" component={ServicesStack} options={{ headerShown: false }} />
      <Drawer.Screen name="Portfolio" component={PortfolioStack} options={{ headerShown: false }} />
      <Drawer.Screen name="Team" component={TeamStack} options={{ headerShown: false }} />
      <Drawer.Screen name="Testimonials" component={TestimonialsStack} options={{ headerShown: false }} />
      <Drawer.Screen name="Blog" component={BlogStack} options={{ headerShown: false }} />
      <Drawer.Screen name="Leads" component={LeadsStack} options={{ headerShown: false }} />
      <Drawer.Screen name="Pipeline" component={PipelineScreen} />
      <Drawer.Screen name="LeadContacts" component={LeadContactsScreen} options={{ title: "Lead Contacts" }} />
      <Drawer.Screen name="Quotations" component={QuotationsScreen} />
      <Drawer.Screen name="Invoices" component={InvoicesScreen} />
      <Drawer.Screen name="Receipts" component={ReceiptsScreen} />
      <Drawer.Screen name="Requirements" component={RequirementsScreen} />
      <Drawer.Screen name="Careers" component={CareersScreen} options={{ title: "Applications" }} />
      <Drawer.Screen name="Newsletter" component={NewsletterScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Admins" component={AdminsScreen} />
    </Drawer.Navigator>
  );
}
