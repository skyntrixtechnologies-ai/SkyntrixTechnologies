import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../theme/colors";

// Custom JS splash shown for a fixed duration after the native splash hides (see
// RootNavigator.js) — logo + full company name, held briefly before Login/Dashboard.
// Unlike the native app.json splash config, this renders as normal React content,
// so it's visible in Expo Go too, not just a real native build.
export default function BrandSplash() {
  return (
    <View style={styles.wrap}>
      <StatusBar barStyle="light-content" backgroundColor={colors.ink} />
      <Image source={require("../../assets/skyntrix-logo.png")} style={styles.logo} />
      <Text style={styles.name}>Skyntrix Technologies</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center" },
  logo: { width: 100, height: 100, borderRadius: 24, marginBottom: 18 },
  name: { color: "#fff", fontSize: 17, fontFamily: fonts.displayExtraBold, letterSpacing: 0.2 },
});
