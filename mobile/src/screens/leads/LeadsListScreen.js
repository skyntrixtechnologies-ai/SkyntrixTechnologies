import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { adminGet, adminDelete, adminPost } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Card, EmptyState, IconButton, Loading, Pagination, SearchInput, StatusBadge, PageHeader } from "../../components/Ui";
import Screen from "../../components/Screen";
import { colors, fonts } from "../../theme/colors";

export default function LeadsListScreen({ navigation }) {
  const { toast } = useToast();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [convertingId, setConvertingId] = useState(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await adminGet("/leads/admin", { search, page, limit: 15 });
      setRows(res.data || []);
      setMeta(res.meta || null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

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

  const handleDelete = (row) => {
    Alert.alert("Delete lead", "Delete this lead and its activity history? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await adminDelete(`/leads/admin/${row._id}`);
            toast.ok("Lead deleted");
            fetchData(true);
          } catch (e) {
            toast.error(e.message);
          }
        },
      },
    ]);
  };

  const handleConvert = async (row) => {
    if (!row.phone) {
      toast.error(`Cannot convert "${row.name}": the inquiry has no phone number`);
      return;
    }
    setConvertingId(row._id);
    try {
      const res = await adminPost(`/lead-contacts/convert/${row._id}`);
      toast.ok(res.data?.alreadyConverted ? "Lead was already converted" : "Converted to Lead Contact");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setConvertingId(null);
    }
  };

  const renderItem = ({ item: row }) => (
    <Pressable onPress={() => navigation.navigate("LeadDetail", { id: row._id })}>
      <Card style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{row.name}</Text>
          <Text style={styles.sub}>{row.email}{row.phone ? ` · ${row.phone}` : ""}</Text>
          {row.service ? <Text style={styles.sub}>{row.service}</Text> : null}
          <View style={{ marginTop: 6 }}>
            <StatusBadge value={row.status} />
          </View>
        </View>
        <View style={{ gap: 8 }}>
          <IconButton icon="whatsapp" variant="brand" tone="success" onPress={() => handleConvert(row)} disabled={convertingId === row._id} />
          <IconButton icon="trash" tone="danger" onPress={() => handleDelete(row)} />
        </View>
      </Card>
    </Pressable>
  );

  return (
    <Screen topInset>
      <PageHeader title="Leads" subtitle="Inquiries submitted through the contact form" />
      <SearchInput value={search} onChangeText={(v) => { setSearch(v); setPage(1); }} placeholder="Search leads..." />

      {loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <EmptyState title="No leads found" />
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
  row: { flexDirection: "row", alignItems: "flex-start", padding: 14, marginBottom: 8 },
  name: { fontSize: 14, fontFamily: fonts.sansBold, color: colors.ink },
  sub: { fontSize: 12, color: colors.inkMuted, marginTop: 2, fontFamily: fonts.sans },
});
