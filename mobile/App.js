import { useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
// Subpath imports (not the package root) so Metro only bundles the 7 weights we
// actually use instead of all ~35 weight files in both font families.
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { PlusJakartaSans_600SemiBold } from "@expo-google-fonts/plus-jakarta-sans/600SemiBold";
import { PlusJakartaSans_700Bold } from "@expo-google-fonts/plus-jakarta-sans/700Bold";
import { PlusJakartaSans_800ExtraBold } from "@expo-google-fonts/plus-jakarta-sans/800ExtraBold";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import { ToastProvider } from "./src/context/ToastContext";
import RootNavigator from "./src/navigation/RootNavigator";

// Keep the native splash (app.json's expo-splash-screen config: Skyntrix logo on
// the brand ink background) visible until fonts are ready — called at module scope
// so it runs before the first render, not inside the component.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  // Hide the native splash only once the real app has laid out its first frame —
  // avoids any flash between the splash disappearing and content appearing.
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <ToastProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </ToastProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
