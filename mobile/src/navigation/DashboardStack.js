import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../screens/DashboardScreen";
import ActivityScreen from "../screens/ActivityScreen";
import { colors, fonts } from "../theme/colors";

const Stack = createNativeStackNavigator();

export default function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerTintColor: colors.ink,
        headerTitleStyle: { fontFamily: fonts.display, fontSize: 17 },
      }}
    >
      <Stack.Screen name="DashboardHome" component={DashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Activity" component={ActivityScreen} options={{ title: "Recent Activity" }} />
    </Stack.Navigator>
  );
}
