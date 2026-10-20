import { StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

const WIDE_BREAKPOINT = 768;
const MAX_CONTENT_WIDTH = 720;

// topInset: most screens already sit under a React Navigation header, which accounts for the
// status bar itself — adding a second top safe-area inset here would double that gap. Only pass
// topInset when the screen has headerShown:false (its own list screens) or no navigator at all (Login).
export default function Screen({ children, padded = true, topInset = false }) {
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;
  const edges = topInset ? ["top", "bottom", "left", "right"] : ["bottom", "left", "right"];

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <View style={[styles.body, padded && styles.padded, isWide && styles.wideCenter]}>
        {/* maxWidth (not a fixed width) so this still shrinks to fit when a permanent
            drawer has already eaten into the available space on a wide-but-not-huge screen. */}
        <View style={{ flex: 1, width: "100%", maxWidth: MAX_CONTENT_WIDTH }}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.base },
  body: { flex: 1 },
  padded: { paddingHorizontal: 16, paddingTop: 12 },
  wideCenter: { alignItems: "center" },
});
