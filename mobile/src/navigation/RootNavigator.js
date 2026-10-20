import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import AppDrawer from "./AppDrawer";
import BrandSplash from "../components/BrandSplash";

const SPLASH_DURATION_MS = 2000;

export default function RootNavigator() {
  const { admin, loading } = useAuth();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setSplashDone(true), SPLASH_DURATION_MS);
    return () => clearTimeout(id);
  }, []);

  // Stays up until BOTH the 2s timer AND the saved-session check are done, so a slow
  // network never cuts the splash short right before Login/Dashboard would flash in.
  if (!splashDone || loading) return <BrandSplash />;

  // Login screen has a dark background (light status bar icons); every screen inside the
  // app has a white header (dark status bar icons) — matching web's light admin theme.
  return (
    <NavigationContainer>
      <StatusBar style={admin ? "dark" : "light"} />
      {admin ? <AppDrawer /> : <LoginScreen />}
    </NavigationContainer>
  );
}
