import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Box } from "@gluestack-ui/themed";
import { gluestackUIConfig } from "../../config/gluestack-ui.config";

import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

import { Loading } from "@components/Loading";

import { useAuth } from "@hooks/useAuth";

import { colors } from "@utils/colors";

export function Routes() {
  const { user, isLoadingUserStorageData } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = gluestackUIConfig.tokens.colors.gray700;

  if (isLoadingUserStorageData) {
    return <Loading />;
  }

  return (
    <Box flex={1} bg={colors.gray700}>
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}

