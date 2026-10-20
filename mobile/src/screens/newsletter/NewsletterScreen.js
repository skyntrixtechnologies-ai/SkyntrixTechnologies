import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { adminGet, adminDelete } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Card, EmptyState, IconButton, Loading, Pagination, SearchInput, StatusBadge, PageHeader } from "../../components/Ui";
import Screen from "../../components/Screen";
import { colors, fonts } from "../../theme/colors";

export default function NewsletterScreen() {
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
      const res = await adminGet("/newsletter/admin", { search, page, limit: 20 });
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

  const handleDelete = (row) => {
    Alert.alert("Remove subscriber", "Remove this subscriber? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await adminDelete(`/newsletter/admin/${row._id}`);
            toast.ok("Subscriber removed");
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
        <Text style={styles.name}>{row.email}</Text>
        <Text style={styles.sub}>{new Date(row.subscribedAt || row.createdAt).toLocaleDateString()}</Text>
        <View style={{ marginTop: 6 }}>
          <StatusBadge value={row.isActive ? "active" : "inactive"} />
        </View>
      </View>
      <IconButton icon="trash" tone="danger" onPress={() => handleDelete(row)} />
    </Card>
  );

  return (
    <Screen>
      <PageHeader title="Newsletter" subtitle="Manage email subscribers" />
      <SearchInput value={search} onChangeText={(v) => { setSearch(v); setPage(1); }} placeholder="Search subscribers..." />

      {loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <EmptyState title="No subscribers found" />
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
  row: { flexDirection: "row", alignItems: "center", padding: 14, marginBottom: 8 },
  name: { fontSize: 14, fontFamily: fonts.sansBold, color: colors.ink },
  sub: { fontSize: 12, color: colors.inkMuted, marginTop: 2, fontFamily: fonts.sans },
});
