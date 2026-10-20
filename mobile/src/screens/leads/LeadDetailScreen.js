import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { adminGet, adminPut } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Button, Card, Field, Loading, StatusBadge, TextField } from "../../components/Ui";
import Screen from "../../components/Screen";
import { colors, fonts } from "../../theme/colors";
import { ALL_STAGES, formatMoney } from "../../utils/pipeline";

export default function LeadDetailScreen({ route }) {
  const { id } = route.params;
  const { toast } = useToast();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextStatus, setNextStatus] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchOverview = useCallback(async () => {
    try {
      const res = await adminGet(`/leads/admin/${id}/overview`);
      setOverview(res.data);
      setNextStatus(res.data?.lead?.status || "");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const saveStatus = async () => {
    if (!overview?.lead) return;
    if (nextStatus === overview.lead.status) {
      toast.info("Lead is already in that status");
      return;
    }
    setSaving(true);
    try {
      await adminPut(`/leads/admin/${id}/status`, { status: nextStatus, note: note.trim() });
      toast.ok(`Status updated to ${nextStatus}`);
      setNote("");
      fetchOverview();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Screen><Loading /></Screen>;
  if (!overview?.lead) return <Screen><Text style={{ fontFamily: fonts.sans }}>Lead not found.</Text></Screen>;

  const { lead, activities = [], summary } = overview;

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        <Card style={styles.card}>
          <Text style={styles.name}>{lead.name}</Text>
          <Text style={styles.muted}>{lead.email}</Text>
          {lead.phone ? <Text style={styles.muted}>{lead.phone}</Text> : null}
          {lead.company ? <Text style={styles.muted}>{lead.company}</Text> : null}
          <View style={{ marginTop: 8, flexDirection: "row", gap: 8 }}>
            <StatusBadge value={lead.status} />
            {lead.service ? <Text style={styles.chip}>{lead.service}</Text> : null}
          </View>
          {lead.message ? (
            <View style={styles.messageBox}>
              <Text style={styles.label}>Message</Text>
              <Text style={styles.message}>{lead.message}</Text>
            </View>
          ) : null}
        </Card>

        {summary ? (
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{formatMoney(summary.totalQuoted)}</Text>
              <Text style={styles.muted}>Quoted</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{formatMoney(summary.amountPaid)}</Text>
              <Text style={styles.muted}>Paid</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{formatMoney(summary.balanceDue)}</Text>
              <Text style={styles.muted}>Balance</Text>
            </Card>
          </View>
        ) : null}

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Update status</Text>
          <Field label="Next status">
            <View style={styles.pickerWrap}>
              <Picker selectedValue={nextStatus} onValueChange={setNextStatus}>
                {ALL_STAGES.map((s) => (
                  <Picker.Item key={s.value} label={s.label} value={s.value} />
                ))}
              </Picker>
            </View>
          </Field>
          <Field label="Note (optional)" hint="Recorded with your name and timestamp on the lead's timeline">
            <TextField value={note} onChangeText={setNote} multiline numberOfLines={3} placeholder="e.g. Client requested a proposal" />
          </Field>
          <Button title="Update status" onPress={saveStatus} loading={saving} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Activity timeline</Text>
          {activities.length === 0 ? (
            <Text style={styles.muted}>No activity yet.</Text>
          ) : (
            activities.map((a) => (
              <View key={a._id} style={styles.timelineRow}>
                <View style={styles.dot} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
                    <StatusBadge value={a.status} />
                    <Text style={styles.timeText}>{new Date(a.createdAt).toLocaleString()}</Text>
                  </View>
                  {a.note ? <Text style={styles.timelineNote}>{a.note}</Text> : null}
                  {a.changedByName ? <Text style={styles.muted}>by {a.changedByName}</Text> : null}
                </View>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, marginBottom: 12 },
  name: { fontSize: 18, fontFamily: fonts.displayExtraBold, color: colors.ink },
  muted: { fontSize: 12, color: colors.inkMuted, marginTop: 2, fontFamily: fonts.sans },
  chip: { fontSize: 11, color: colors.primary, backgroundColor: colors.primaryLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, fontFamily: fonts.sansSemiBold },
  messageBox: { marginTop: 12, backgroundColor: colors.base, borderRadius: 10, padding: 10 },
  label: { fontSize: 11, color: colors.inkFaint, marginBottom: 4, fontFamily: fonts.sans },
  message: { fontSize: 13, color: colors.ink, lineHeight: 19, fontFamily: fonts.sans },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  statCard: { flex: 1, padding: 12, alignItems: "center" },
  statValue: { fontSize: 14, fontFamily: fonts.displayExtraBold, color: colors.ink },
  sectionTitle: { fontSize: 15, fontFamily: fonts.display, color: colors.ink, marginBottom: 10 },
  pickerWrap: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.white, overflow: "hidden" },
  timelineRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary, marginTop: 6 },
  timeText: { fontSize: 11, color: colors.inkFaint, fontFamily: fonts.sans },
  timelineNote: { fontSize: 13, color: colors.ink, marginTop: 4, fontFamily: fonts.sans },
});
