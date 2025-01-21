import { Platform } from "react-native";
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";

import HomeSvg from "@assets/home.svg";
import HistorySvg from "@assets/history.svg";
import ProfileSvg from "@assets/profile.svg";

import { Home } from "@screens/Home";
import { History } from "@screens/History";
import { Profile } from "@screens/Profile";
import { Exercise } from "@screens/Exercise";
import { colors } from "@utils/colors";
import { space } from "@utils/space";

type AppRoutes = {
  home: undefined;
  exercise: { exerciseId: string };
  profile: undefined;
  history: undefined;
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const iconSize = space["6"];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.green500,
        tabBarInactiveTintColor: colors.gray200,
        tabBarStyle: {
          backgroundColor: colors.gray600,
          borderTopWidth: 0,
          height: Platform.OS === "android" ? "auto" : 96,
          paddingBottom: space["10"],
          paddingTop: space["4"],
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
      <Screen
        name="history"
        component={History}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
      <Screen
        name="exercise"
        component={Exercise}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: {
            display: "none",
          },
        }}
      />
    </Navigator>
  );
}
