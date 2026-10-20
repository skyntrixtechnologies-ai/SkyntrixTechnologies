import { StyleSheet, Text, View } from "react-native";
import Screen from "./Screen";
import Icon from "./Icon";
import { colors, fonts } from "../theme/colors";

// Placeholder for admin modules not yet ported to the mobile app
// (Pipeline, Quotations, Invoices, Receipts, Requirements, Settings, Admins, ...).
export default function ComingSoon({ title, note }) {
  return (
    <Screen>
      <View style={styles.wrap}>
        <View style={styles.iconCircle}>
          <Icon name="screwdriver-wrench" size={26} color={colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.note}>{note || "This module is managed from the web admin panel for now."}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: { fontSize: 18, fontFamily: fonts.display, color: colors.ink, marginBottom: 6, textAlign: "center" },
  note: { fontSize: 13, color: colors.inkMuted, textAlign: "center", lineHeight: 19, fontFamily: fonts.sans },
});
