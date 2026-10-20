import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { adminGet } from "../api/client";
import Screen from "../components/Screen";
import { Card, EmptyState, Loading, PageHeader } from "../components/Ui";
import { colors, fonts } from "../theme/colors";

// Full list behind Dashboard's "View all" — note the backend endpoint itself caps at
// 12 merged items (leads/careers/newsletter/audit log), so this is everything there is.
export default function ActivityScreen() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await adminGet("/dashboard/activity");
      setActivity(res.data || []);
    } catch (_) {
      // keep last known values on transient failures
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load(true);
    setRefreshing(false);
  };

  return (
    <Screen>
      <PageHeader title="Recent Activity" subtitle="Latest leads, applications, subscribers and admin actions" />

      {loading ? (
        <Loading />
      ) : activity.length === 0 ? (
        <EmptyState title="No activity yet" />
      ) : (
        <FlatList
          data={activity}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={{ paddingBottom: 12 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          renderItem={({ item: a }) => (
            <Card style={styles.row}>
              <View style={styles.dot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{a.title}</Text>
                <Text style={styles.muted}>{a.desc}</Text>
              </View>
              <Text style={styles.time}>{new Date(a.time).toLocaleDateString()}</Text>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14, marginBottom: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary, marginTop: 5 },
  title: { fontSize: 13, fontFamily: fonts.sansSemiBold, color: colors.ink },
  muted: { fontSize: 12, color: colors.inkMuted, marginTop: 2, fontFamily: fonts.sans },
  time: { fontSize: 11, color: colors.inkFaint, fontFamily: fonts.sans },
});
