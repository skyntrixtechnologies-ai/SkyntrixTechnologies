import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { adminGet } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Screen from "../components/Screen";
import { Card, Loading } from "../components/Ui";
import Icon from "../components/Icon";
import BarChart from "../components/BarChart";
import { colors, fonts } from "../theme/colors";

const PERIODS = [
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
  { key: "year", label: "This Year" },
  { key: "all", label: "All Time" },
];

// Mirrors client/src/admin/pages/Dashboard.jsx cardMeta (icon + tailwind color pair per card).
const CARD_META = [
  { key: "leads", label: "Total Leads", icon: "envelope", fg: "#2563EB", bg: "#EFF6FF" },
  { key: "convertedLeads", label: "Converted", icon: "paperclip", fg: "#059669", bg: "#ECFDF5" },
  { key: "careerApplications", label: "Applications", icon: "briefcase", fg: "#9333EA", bg: "#FAF5FF" },
  { key: "newsletterSubscribers", label: "Subscribers", icon: "users", fg: "#DB2777", bg: "#FDF2F8" },
  { key: "blogs", label: "Blog Posts", icon: "newspaper", fg: "#4F46E5", bg: "#EEF2FF" },
  { key: "portfolio", label: "Projects", icon: "images", fg: "#EA580C", bg: "#FFF7ED" },
  { key: "services", label: "Services", icon: "paperclip", fg: "#0D9488", bg: "#F0FDFA" },
  { key: "totalBlogViews", label: "Blog Views", icon: "eye", fg: "#475569", bg: "#F1F5F9" },
];

const REFRESH_MS = 60 * 1000;
const GRID_GAP = 10;

const ACTIVITY_PREVIEW_COUNT = 10;

export default function DashboardScreen({ navigation }) {
  const { admin } = useAuth();
  const { width } = useWindowDimensions();
  const [period, setPeriod] = useState("year");
  const [overview, setOverview] = useState(null);
  const [charts, setCharts] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const firstLoad = useRef(true);

  // 2 columns on phones, scales up to 4 on tablets/landscape so cards never look sparse or cramped.
  const columns = width >= 1000 ? 4 : width >= 680 ? 3 : 2;
  const cardWidth = `${100 / columns}%`;

  // Mirrors client/src/admin/pages/Dashboard.jsx's loadMain: overview + charts are keyed by
  // period and refreshed together; activity is fetched once on mount, same as the web page.
  const loadMain = useCallback(async (p, silent = false) => {
    if (!silent && firstLoad.current) setLoading(true);
    try {
      const [o, c] = await Promise.all([adminGet("/dashboard/overview"), adminGet(`/dashboard/charts?period=${p}`)]);
      setOverview(o.data?.totals || {});
      setCharts(c.data || null);
      firstLoad.current = false;
    } catch (_) {
      // keep last known values on transient failures
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMain(period);
  }, [period, loadMain]);

  useEffect(() => {
    adminGet("/dashboard/activity")
      .then((a) => setActivity(a.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const id = setInterval(() => loadMain(period, true), REFRESH_MS);
    return () => clearInterval(id);
  }, [period, loadMain]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMain(period, true);
    setRefreshing(false);
  };

  if (loading) return <Screen><Loading /></Screen>;

  const totals = overview || {};
  const chartLabels = charts?.labels || [];
  const activityPreview = activity.slice(0, ACTIVITY_PREVIEW_COUNT);

  return (
    <Screen padded={false} topInset>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <Text style={styles.greeting}>Welcome back, {admin?.name?.split(" ")[0]}</Text>
        <Text style={styles.subtext}>Here's what's happening on Skyntrix.</Text>

        <View style={styles.grid}>
          {CARD_META.map((c) => (
            <View key={c.key} style={{ width: cardWidth, padding: GRID_GAP / 2 }}>
              <Card>
                <View style={[styles.iconBox, { backgroundColor: c.bg }]}>
                  <Icon name={c.icon} size={16} color={c.fg} />
                </View>
                <Text style={styles.cardValue}>{totals[c.key] ?? 0}</Text>
                <Text style={styles.cardLabel}>{c.label}</Text>
              </Card>
            </View>
          ))}
        </View>

        <Card style={styles.activityCard}>
          <Text style={styles.sectionTitle}>New leads & applications</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }} contentContainerStyle={styles.periodRow}>
            {PERIODS.map((p) => {
              const active = period === p.key;
              return (
                <Pressable key={p.key} onPress={() => setPeriod(p.key)} style={[styles.periodChip, active && styles.periodChipActive]}>
                  <Text style={[styles.periodChipText, active && styles.periodChipTextActive]}>{p.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          {chartLabels.length === 0 ? (
            <Text style={styles.muted}>No data available.</Text>
          ) : (
            <BarChart labels={chartLabels} leads={charts?.leads || []} applications={charts?.applications || []} />
          )}
        </Card>

        <Card style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Recent activity</Text>
            {activity.length > 0 && (
              <Pressable onPress={() => navigation.navigate("Activity")} hitSlop={8}>
                <Text style={styles.viewAll}>View all</Text>
              </Pressable>
            )}
          </View>
          {activityPreview.length === 0 ? (
            <Text style={styles.muted}>No activity yet.</Text>
          ) : (
            activityPreview.map((a, i) => (
              <View key={i} style={styles.activityRow}>
                <View style={styles.dot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityTitle}>{a.title}</Text>
                  <Text style={styles.muted}>{a.desc}</Text>
                </View>
                <Text style={styles.activityTime}>{new Date(a.time).toLocaleDateString()}</Text>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  greeting: { fontSize: 20, fontFamily: fonts.displayExtraBold, color: colors.ink },
  subtext: { fontSize: 13, color: colors.inkMuted, marginTop: 2, marginBottom: 16, fontFamily: fonts.sans },
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -(GRID_GAP / 2) },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardValue: { fontSize: 22, fontFamily: fonts.displayExtraBold, color: colors.ink },
  cardLabel: { fontSize: 12, color: colors.inkMuted, marginTop: 2, fontFamily: fonts.sans },
  activityCard: { marginTop: 10 },
  periodRow: { flexDirection: "row", gap: 8 },
  periodChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: colors.base },
  periodChipActive: { backgroundColor: colors.primary },
  periodChipText: { fontSize: 12, fontFamily: fonts.sansSemiBold, color: colors.inkMuted },
  periodChipTextActive: { color: "#fff" },
  activityHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontFamily: fonts.display, color: colors.ink, marginBottom: 10 },
  viewAll: { fontSize: 12, fontFamily: fonts.sansSemiBold, color: colors.primary },
  muted: { fontSize: 12, color: colors.inkMuted, fontFamily: fonts.sans },
  activityRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 12 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary, marginTop: 5 },
  activityTitle: { fontSize: 13, fontFamily: fonts.sansSemiBold, color: colors.ink },
  activityTime: { fontSize: 11, color: colors.inkFaint, fontFamily: fonts.sans },
});
