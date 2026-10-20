import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { adminGet, adminDelete, adminPut } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Button, Card, EmptyState, IconButton, Loading, Pagination, SearchInput, StatusBadge, PageHeader } from "../../components/Ui";
import Icon from "../../components/Icon";
import Screen from "../../components/Screen";
import { colors, fonts } from "../../theme/colors";

export default function CrudListScreen({ route, navigation }) {
  const { config } = route.params;
  const { title, singular, apiPath, columns, statusOptions, statusKey = "status" } = config;
  const { toast } = useToast();

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const listPath = `/${apiPath}/admin`;

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await adminGet(listPath, { search, page, limit: 10 });
      setRows(res.data || []);
      setMeta(res.meta || null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listPath, search, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const unsub = navigation.addListener("focus", () => fetchData(true));
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(true);
    setRefreshing(false);
  };

  const confirmDelete = (row) => {
    Alert.alert(`Delete ${singular}`, `Are you sure you want to delete this ${singular.toLowerCase()}? This cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await adminDelete(`/${apiPath}/admin/${row._id}`);
            toast.ok(`${singular} deleted`);
            fetchData(true);
          } catch (e) {
            toast.error(e.message);
          }
        },
      },
    ]);
  };

  const setStatus = async (row, option) => {
    try {
      await adminPut(`/${apiPath}/admin/${row._id}/status`, { status: option.value });
      toast.info(`Status updated to ${option.label}`);
      fetchData(true);
    } catch (e) {
      toast.error(e.message);
    }
  };

  // Action sheet instead of a web-style <select> — lets you jump straight to any status
  // in one tap (same capability as the web dropdown) instead of cycling one step at a time.
  const pickStatus = (row) => {
    if (!statusOptions) return;
    Alert.alert(
      `${singular} status`,
      row[statusKey] ? `Currently: ${row[statusKey]}` : undefined,
      [
        ...statusOptions.map((o) => ({ text: o.label, onPress: () => setStatus(row, o) })),
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const renderItem = ({ item: row }) => (
    <Pressable onPress={() => navigation.navigate("CrudForm", { config, editingId: row._id, row })}>
      <Card style={styles.row}>
        <View style={{ flex: 1 }}>
          {columns.map((c) => (
            <Text key={c.key} style={c.key === columns[0].key ? styles.rowTitle : styles.rowSub}>
              {c.render ? c.render(row) : row[c.key] ?? "—"}
            </Text>
          ))}
          <View style={styles.badgeRow}>
            {statusOptions && (
              <Pressable onPress={() => pickStatus(row)}>
                <StatusBadge value={row[statusKey]} />
              </Pressable>
            )}
            {/* Mirrors the web table's "Featured" (★) column — shown generically for any
                resource whose rows carry a boolean `featured` flag (Services/Portfolio/Testimonials). */}
            {typeof row.featured === "boolean" && row.featured && (
              <View style={styles.featuredChip}>
                <Icon name="star" size={10} color="#B45309" />
                <Text style={styles.featuredText}>Featured</Text>
              </View>
            )}
            {/* Mirrors the web table's "Order" column — shown generically wherever the
                resource has a displayOrder (Services/Portfolio/Team/Testimonials). */}
            {typeof row.displayOrder === "number" && (
              <View style={styles.orderChip}>
                <Text style={styles.orderText}>#{row.displayOrder}</Text>
              </View>
            )}
          </View>
        </View>
        <IconButton icon="trash" tone="danger" onPress={() => confirmDelete(row)} />
      </Card>
    </Pressable>
  );

  return (
    <Screen topInset>
      <PageHeader title={title} subtitle={`Manage your ${title.toLowerCase()} entries`} />
      <SearchInput value={search} onChangeText={(v) => { setSearch(v); setPage(1); }} placeholder={`Search ${title.toLowerCase()}...`} />

      {loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <EmptyState title={`No ${title.toLowerCase()} found`} hint="Try adjusting your search or create one." />
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

      <Button
        title={`New ${singular.toLowerCase()}`}
        onPress={() => navigation.navigate("CrudForm", { config, editingId: null, row: null })}
        style={styles.fab}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", padding: 14, marginBottom: 8 },
  rowTitle: { fontSize: 14, fontFamily: fonts.sansBold, color: colors.ink },
  rowSub: { fontSize: 12, color: colors.inkMuted, marginTop: 2, fontFamily: fonts.sans },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  featuredChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "#FEF3C7",
  },
  featuredText: { fontSize: 11, fontFamily: fonts.sansSemiBold, color: "#B45309" },
  orderChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: colors.base },
  orderText: { fontSize: 11, fontFamily: fonts.sansSemiBold, color: colors.inkMuted },
  fab: { marginTop: 10, marginBottom: 6 },
});
