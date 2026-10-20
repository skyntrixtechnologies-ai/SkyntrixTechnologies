import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LeadsListScreen from "../screens/leads/LeadsListScreen";
import LeadDetailScreen from "../screens/leads/LeadDetailScreen";
import { colors, fonts } from "../theme/colors";

const Stack = createNativeStackNavigator();

export default function LeadsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerTintColor: colors.ink,
        headerTitleStyle: { fontFamily: fonts.display, fontSize: 17 },
      }}
    >
      <Stack.Screen name="LeadsList" component={LeadsListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LeadDetail" component={LeadDetailScreen} options={{ title: "Lead" }} />
    </Stack.Navigator>
  );
}
