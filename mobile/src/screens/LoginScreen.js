import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Button, TextField, Field } from "../components/Ui";
import { colors, fonts, shadows } from "../theme/colors";

export default function LoginScreen() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(email.trim(), password);
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.flex} edges={["top", "bottom", "left", "right"]}>
      {/* behavior=undefined on Android means KeyboardAvoidingView does nothing at all — the
          keyboard would simply cover the inputs. "height" is the standard Android equivalent. */}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            <View style={styles.logoWrap}>
              <Image source={require("../../assets/skyntrix-logo.png")} style={styles.logo} />
              <Text style={styles.brand}>Skyntrix Technologies</Text>
            </View>

            <View style={styles.card}>
              <Field label="Email">
                <TextField value={email} onChangeText={setEmail} placeholder="you@skyntrix.com" keyboardType="email-address" />
              </Field>
              <Field label="Password">
                <TextField value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
              </Field>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Button title={loading ? "Signing in..." : "Sign in"} onPress={handleLogin} loading={loading} style={{ marginTop: 6 }} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.ink },
  scroll: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  inner: { width: "100%", maxWidth: 420 },
  logoWrap: { alignItems: "center", marginBottom: 32 },
  logo: { width: 64, height: 64, borderRadius: 18, marginBottom: 14, ...shadows.soft },
  brand: { color: "#fff", fontSize: 20, fontFamily: fonts.displayExtraBold },
  card: { backgroundColor: colors.white, borderRadius: 18, padding: 22, ...shadows.card },
  error: { color: colors.danger, fontSize: 13, marginBottom: 10, fontFamily: fonts.sans },
});
