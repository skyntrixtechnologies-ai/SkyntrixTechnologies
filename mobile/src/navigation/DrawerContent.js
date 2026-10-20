import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Icon from "../components/Icon";
import { colors, fonts } from "../theme/colors";

// Matches client/src/admin/components/Sidebar.jsx's react-icons/fa(6) choices.
const links = [
  { route: "Dashboard", label: "Dashboard", icon: "gauge-high" },
  { route: "Services", label: "Services", icon: "gears" },
  { route: "Portfolio", label: "Portfolio", icon: "images" },
  { route: "Team", label: "Team", icon: "users" },
  { route: "Testimonials", label: "Testimonials", icon: "comments" },
  { route: "Blog", label: "Blog Posts", icon: "newspaper" },
  { route: "Leads", label: "Leads", icon: "envelope" },
  { route: "Pipeline", label: "Pipeline", icon: "table-columns" },
  { route: "LeadContacts", label: "Lead Contacts", icon: "address-book" },
  { route: "Quotations", label: "Quotations", icon: "file-invoice-dollar" },
  { route: "Invoices", label: "Invoices", icon: "file-invoice-dollar" },
  { route: "Receipts", label: "Receipts", icon: "receipt" },
  { route: "Requirements", label: "Requirements", icon: "clipboard-list" },
  { route: "Careers", label: "Applications", icon: "briefcase" },
  { route: "Newsletter", label: "Newsletter", icon: "paper-plane" },
  { route: "Settings", label: "Settings", icon: "gear" },
  { route: "Admins", label: "Admins", icon: "shield-halved" },
];

export default function DrawerContent(props) {
  const { admin, logout } = useAuth();
  const { toast } = useToast();
  const insets = useSafeAreaInsets();
  const activeRoute = props.state.routeNames[props.state.index];

  const handleLogout = async () => {
    await logout();
    toast.info("Signed out");
  };

  return (
    <View style={styles.wrap}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Image source={require("../../assets/skyntrix-logo.png")} style={styles.logo} />
        <View>
          <Text style={styles.brand}>Skyntrix</Text>
          <Text style={styles.brandSub}>Admin Panel</Text>
        </View>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 4 }}>
        {links.map((l) => {
          const focused = activeRoute === l.route;
          return (
            <DrawerItem
              key={l.route}
              label={l.label}
              focused={focused}
              activeBackgroundColor="rgba(255,255,255,0.15)"
              inactiveTintColor="rgba(255,255,255,0.6)"
              activeTintColor="#fff"
              icon={() => <Icon name={l.icon} size={16} color={focused ? "#fff" : "rgba(255,255,255,0.6)"} />}
              onPress={() => props.navigation.navigate(l.route)}
              labelStyle={styles.itemLabel}
            />
          );
        })}
      </DrawerContentScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(16, insets.bottom + 8) }]}>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(admin?.name || "A")[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{admin?.name}</Text>
            <Text style={styles.userEmail}>{admin?.email}</Text>
          </View>
        </View>
        <Pressable onPress={handleLogout} style={styles.logoutBtn}>
          <Icon name="right-from-bracket" size={14} color="rgba(255,255,255,0.7)" />
          <Text style={styles.logoutText}>Sign out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.ink },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, paddingBottom: 18 },
  logo: { width: 40, height: 40, borderRadius: 10 },
  brand: { color: "#fff", fontFamily: fonts.displayExtraBold, fontSize: 15 },
  brandSub: { color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", fontFamily: fonts.sansMedium },
  itemLabel: { fontSize: 13, fontFamily: fonts.sansSemiBold },
  footer: { borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)", padding: 16 },
  userRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontFamily: fonts.displayExtraBold, textTransform: "uppercase" },
  userName: { color: "#fff", fontSize: 13, fontFamily: fonts.sansBold },
  userEmail: { color: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: fonts.sans },
  logoutBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8 },
  logoutText: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: fonts.sansSemiBold },
});
