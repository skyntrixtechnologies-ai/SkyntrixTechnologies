import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CrudListScreen from "../screens/crud/CrudListScreen";
import CrudFormScreen from "../screens/crud/CrudFormScreen";
import { colors, fonts } from "../theme/colors";

const headerOptions = {
  headerStyle: { backgroundColor: colors.white },
  headerTintColor: colors.ink,
  headerTitleStyle: { fontFamily: fonts.display, fontSize: 17 },
};

// One factory shared by Services/Portfolio/Team/Testimonials/Blog instead of
// hand-writing five near-identical stacks (mirrors CrudPage.jsx on the web side).
export function createCrudStack(config) {
  const Stack = createNativeStackNavigator();
  return function CrudStackScreen() {
    return (
      <Stack.Navigator screenOptions={headerOptions}>
        <Stack.Screen name="CrudList" component={CrudListScreen} initialParams={{ config }} options={{ title: config.title, headerShown: false }} />
        <Stack.Screen name="CrudForm" component={CrudFormScreen} options={{ title: config.singular }} />
      </Stack.Navigator>
    );
  };
}
