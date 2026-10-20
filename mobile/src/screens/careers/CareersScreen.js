import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Linking, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { adminGet, adminPut, adminDelete } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Card, EmptyState, IconButton, Loading, Pagination, SearchInput, StatusBadge, PageHeader } from "../../components/Ui";
import Screen from "../../components/Screen";
import { colors, fonts } from "../../theme/colors";

const STATUS_OPTIONS = ["new", "reviewed", "interviewed", "rejected", "hired", "archived"];

export default function CareersScreen() {
  const { toast } = useToast();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await adminGet("/careers/admin", { search, page, limit: 15 });
      setRows(res.data || []);
      setMeta(res.meta || null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(true);
    setRefreshing(false);
  };

  const cycleStatus = async (row) => {
    const idx = STATUS_OPTIONS.indexOf(row.status);
    const next = STATUS_OPTIONS[(idx + 1) % STATUS_OPTIONS.length];
    try {
      await adminPut(`/careers/admin/${row._id}/status`, { status: next });
      toast.info(`Status updated to ${next}`);
      fetchData(true);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDelete = (row) => {
    Alert.alert("Delete application", "Delete this application (and its resume)? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await adminDelete(`/careers/admin/${row._id}`);
            toast.ok("Application deleted");
            fetchData(true);
          } catch (e) {
            toast.error(e.message);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item: row }) => (
    <Card style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{row.name}</Text>
        <Text style={styles.sub}>{row.email}</Text>
        <Text style={styles.sub}>{row.position || "—"} {row.experience ? `· ${row.experience}` : ""}</Text>
        <View style={{ marginTop: 6 }}>
          <Pressable onPress={() => cycleStatus(row)}>
            <StatusBadge value={row.status} />
          </Pressable>
        </View>
      </View>
      <View style={{ gap: 8 }}>
        {row.resume ? <IconButton icon="file-arrow-down" onPress={() => Linking.openURL(row.resume)} /> : null}
        <IconButton icon="trash" tone="danger" onPress={() => handleDelete(row)} />
      </View>
    </Card>
  );

  return (
    <Screen>
      <PageHeader title="Career Applications" subtitle="Submitted via the careers page" />
      <SearchInput value={search} onChangeText={(v) => { setSearch(v); setPage(1); }} placeholder="Search applications..." />

      {loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <EmptyState title="No applications found" />
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(r) => r._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 12 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        />
      )}

      <Pagination meta={meta} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => p + 1)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", padding: 14, marginBottom: 8 },
  name: { fontSize: 14, fontFamily: fonts.sansBold, color: colors.ink },
  sub: { fontSize: 12, color: colors.inkMuted, marginTop: 2, fontFamily: fonts.sans },
});
