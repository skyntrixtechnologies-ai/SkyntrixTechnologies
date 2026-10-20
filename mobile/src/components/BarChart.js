import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../theme/colors";

// Grouped bar chart (leads vs applications per label) — native equivalent of the
// hover-tooltip SVG chart in client/src/admin/pages/Dashboard.jsx's GroupedBarChart.
// Touch has no hover, so bars are tappable instead to reveal the same tooltip info.
const SERIES = [
  { key: "leads", label: "Leads", color: "#2563EB" },
  { key: "applications", label: "Applications", color: "#6D28D9" },
];

const CHART_HEIGHT = 150;
const GROUP_WIDTH = 46;

function Bar({ value, max, color, showValue }) {
  return (
    <View style={styles.barCol}>
      {showValue && value > 0 ? <Text style={styles.valueLabel}>{value}</Text> : null}
      <View style={[styles.bar, { height: Math.max(3, (value / max) * CHART_HEIGHT), backgroundColor: color }]} />
    </View>
  );
}

export default function BarChart({ labels = [], leads = [], applications = [] }) {
  const [tap, setTap] = useState(null);
  const max = Math.max(1, ...leads, ...applications);
  const showValueLabels = labels.length <= 10;

  return (
    <View>
      <View style={styles.legend}>
        {SERIES.map((s) => (
          <View key={s.key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: s.color }]} />
            <Text style={styles.legendText}>{s.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartRow}>
        {labels.map((label, i) => {
          const lv = leads[i] || 0;
          const av = applications[i] || 0;
          const active = tap === i;
          return (
            <Pressable key={i} style={styles.group} onPress={() => setTap(active ? null : i)}>
              {active && (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipLabel}>{label}</Text>
                  <Text style={styles.tooltipLine}>Leads: {lv}</Text>
                  <Text style={styles.tooltipLine}>Applications: {av}</Text>
                </View>
              )}
              <View style={styles.bars}>
                <Bar value={lv} max={max} color={SERIES[0].color} showValue={showValueLabels} />
                <Bar value={av} max={max} color={SERIES[1].color} showValue={showValueLabels} />
              </View>
              <Text style={styles.axisLabel} numberOfLines={1}>{label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: { flexDirection: "row", gap: 16, marginBottom: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 9, height: 9, borderRadius: 2 },
  legendText: { fontSize: 12, color: colors.inkMuted, fontFamily: fonts.sans },
  // flex-end here is what keeps every group's baseline (and axis label) aligned across the
  // row — each "bars" box below is a fixed CHART_HEIGHT, so short/tall groups still bottom-align.
  chartRow: { alignItems: "flex-end", paddingTop: 16 },
  group: { width: GROUP_WIDTH, alignItems: "center" },
  // Fixed height + alignItems:"flex-end": a short bar's (label+bar) column is shorter than
  // CHART_HEIGHT, so flex-end pins its bottom to the shared baseline and the label floats
  // directly above that bar's own top — same effect as the web chart's yFor(v)-4 text, no
  // absolute-position math needed.
  bars: { height: CHART_HEIGHT, flexDirection: "row", alignItems: "flex-end", gap: 3 },
  barCol: { alignItems: "center" },
  bar: { width: 10, borderRadius: 3 },
  valueLabel: { fontSize: 9, color: colors.inkMuted, fontFamily: fonts.sans, marginBottom: 2 },
  axisLabel: { fontSize: 10, color: colors.inkMuted, marginTop: 6, fontFamily: fonts.sans },
  tooltip: {
    position: "absolute",
    top: -58,
    backgroundColor: colors.ink,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    zIndex: 10,
    width: 130,
  },
  tooltipLabel: { color: "#fff", fontSize: 11, fontFamily: fonts.sansBold, marginBottom: 2 },
  tooltipLine: { color: "rgba(255,255,255,0.8)", fontSize: 10, fontFamily: fonts.sans },
});
