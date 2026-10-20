import { createContext, useCallback, useContext, useRef, useState } from "react";
import { StyleSheet, Text, Animated } from "react-native";
import { colors } from "../theme/colors";

const ToastContext = createContext(null);

const KIND_STYLES = {
  ok: { bg: "#065F46" },
  error: { bg: colors.danger },
  info: { bg: colors.ink },
};

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);

  const show = useCallback((kind, message) => {
    setToast({ kind, message });
    Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setToast(null));
    }, 2600);
  }, [opacity]);

  const toast_ = {
    ok: (msg) => show("ok", msg),
    error: (msg) => show("error", msg),
    info: (msg) => show("info", msg),
  };

  return (
    <ToastContext.Provider value={{ toast: toast_ }}>
      {children}
      {toast && (
        <Animated.View
          pointerEvents="none"
          style={[styles.wrap, { opacity, backgroundColor: KIND_STYLES[toast.kind]?.bg || colors.ink }]}
        >
          <Text style={styles.text}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom: 32,
    left: 20,
    right: 20,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  text: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
