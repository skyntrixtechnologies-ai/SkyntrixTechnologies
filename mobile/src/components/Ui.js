import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Icon from "./Icon";
import { colors, fonts, getStatusColor, primaryGradient, radii, shadows } from "../theme/colors";

export function Card({ children, style, noPad }) {
  return <View style={[styles.card, !noPad && styles.cardPad, style]}>{children}</View>;
}

export function StatusBadge({ value }) {
  const c = getStatusColor(value);
  const label = String(value || "draft").replace(/_/g, " ");
  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderColor: c.fg + "33" }]}>
      <Text style={[styles.badgeText, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

export function Button({ title, onPress, variant = "primary", loading, disabled, style, icon }) {
  const isPrimary = variant === "primary";
  const variantStyle = {
    secondary: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.primaryLight },
    danger: { backgroundColor: colors.danger },
    ghost: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.border },
  }[variant];
  const textColor = variant === "secondary" ? colors.primary : variant === "ghost" ? colors.ink : colors.white;

  // Keep the label visible during loading (spinner + text together) instead of swapping to a
  // bare spinner — a lone spinner on a faded button reads as a stray mark, not a loading state.
  const content = (
    <>
      {loading ? <ActivityIndicator size="small" color={textColor} /> : icon}
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </>
  );

  if (isPrimary) {
    return (
      <Pressable onPress={onPress} disabled={disabled || loading} style={[disabled && { opacity: 0.5 }, style]}>
        <LinearGradient colors={primaryGradient.colors} locations={primaryGradient.locations} start={primaryGradient.start} end={primaryGradient.end} style={[styles.button, shadows.soft]}>
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={[styles.button, variantStyle, disabled && { opacity: 0.5 }, style]}>
      {content}
    </Pressable>
  );
}

export function IconButton({ icon, onPress, tone = "default", disabled, variant = "solid" }) {
  const tones = {
    default: { bg: "rgba(23,18,31,0.05)", fg: colors.inkMuted },
    danger: { bg: colors.dangerBg, fg: colors.danger },
    success: { bg: "#ECFDF5", fg: colors.success },
  }[tone];
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.iconBtn, { backgroundColor: tones.bg }, disabled && { opacity: 0.4 }]} hitSlop={6}>
      <Icon name={icon} size={15} color={tones.fg} variant={variant} />
    </Pressable>
  );
}

export function Loading({ label = "Loading..." }) {
  return (
    <View style={styles.centerBox}>
      <ActivityIndicator color={colors.primary} size="large" />
      {label ? <Text style={styles.mutedText}>{label}</Text> : null}
    </View>
  );
}

export function EmptyState({ title = "Nothing here yet", hint }) {
  return (
    <View style={styles.centerBox}>
      <Icon name="folder-open" size={32} color={colors.inkFaint} variant="regular" />
      <Text style={[styles.emptyTitle, { marginTop: 12 }]}>{title}</Text>
      {hint ? <Text style={styles.mutedText}>{hint}</Text> : null}
    </View>
  );
}

export function SearchInput({ value, onChangeText, placeholder }) {
  return (
    <View style={styles.searchWrap}>
      <View style={styles.searchIcon}>
        <Icon name="magnifying-glass" size={14} color={colors.inkFaint} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inkFaint}
        style={styles.searchInput}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

export function Pagination({ meta, onPrev, onNext }) {
  if (!meta || meta.totalPages <= 1) return null;
  return (
    <View style={styles.pagination}>
      <Text style={styles.mutedText}>
        Page {meta.page} of {meta.totalPages} · {meta.totalItems} total
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Button title="Prev" variant="secondary" disabled={!meta.hasPrevPage} onPress={onPrev} style={styles.pageBtn} />
        <Button title="Next" variant="secondary" disabled={!meta.hasNextPage} onPress={onNext} style={styles.pageBtn} />
      </View>
    </View>
  );
}

export function Field({ label, required, hint, children }) {
  return (
    <View style={{ marginBottom: 14 }}>
      {label ? (
        <Text style={styles.fieldLabel}>
          {label} {required ? <Text style={{ color: colors.danger }}>*</Text> : null}
        </Text>
      ) : null}
      {children}
      {hint ? <Text style={styles.hintText}>{hint}</Text> : null}
    </View>
  );
}

export function TextField({ value, onChangeText, placeholder, multiline, keyboardType, secureTextEntry, numberOfLines }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.inkFaint}
      multiline={multiline}
      numberOfLines={multiline ? numberOfLines || 4 : 1}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      style={[styles.input, multiline && { height: (numberOfLines || 4) * 22, textAlignVertical: "top" }]}
    />
  );
}

export function PageHeader({ title, subtitle }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.pageTitle}>{title}</Text>
      {subtitle ? <Text style={styles.mutedText}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.xl, borderWidth: 1, borderColor: colors.base, ...shadows.card },
  cardPad: { padding: 16 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radii.pill, borderWidth: 1, alignSelf: "flex-start" },
  badgeText: { fontSize: 11, fontFamily: fonts.sansSemiBold, textTransform: "capitalize" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: radii.md,
  },
  buttonText: { fontFamily: fonts.sansBold, fontSize: 14 },
  iconBtn: { width: 36, height: 36, borderRadius: radii.sm, alignItems: "center", justifyContent: "center" },
  centerBox: { paddingVertical: 48, alignItems: "center", justifyContent: "center" },
  mutedText: { color: colors.inkMuted, fontSize: 13, marginTop: 6, fontFamily: fonts.sans },
  emptyTitle: { color: colors.ink, fontFamily: fonts.sansBold, fontSize: 15 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: { marginRight: 8, opacity: 0.5 },
  searchInput: { flex: 1, paddingVertical: 10, color: colors.ink, fontSize: 14, fontFamily: fonts.sans },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 14,
    paddingBottom: 4,
  },
  pageBtn: { paddingVertical: 7, paddingHorizontal: 12 },
  fieldLabel: { fontSize: 13, fontFamily: fonts.sansSemiBold, color: colors.ink, marginBottom: 6 },
  hintText: { fontSize: 11, color: colors.inkFaint, marginTop: 4, fontFamily: fonts.sans },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.ink,
    fontFamily: fonts.sans,
  },
  pageTitle: { fontSize: 22, fontFamily: fonts.displayExtraBold, color: colors.ink },
});
