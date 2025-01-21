import { TouchableOpacity } from "react-native";
import { Heading, HStack, VStack, Text, Icon } from "@gluestack-ui/themed";
import { gluestackUIConfig } from "../../config/gluestack-ui.config";

import { LogOut } from "lucide-react-native";

import { api } from "@services/api";

import { UserPhoto } from "./UserPhoto";

import { useAuth } from "@hooks/useAuth";

import defaultUserPhotoImg from "@assets/userPhotoDefault.png";

export function HomeHeader() {
  const { user, signOut } = useAuth();
  const { tokens } = gluestackUIConfig;

  return (
    <HStack
      bg={tokens.colors.gray600}
      pt="$16"
      pb="$5"
      px="$8"
      alignItems="center"
      gap="$4"
    >
      <UserPhoto
        source={
          user.avatar
            ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
            : defaultUserPhotoImg
        }
        w="$16"
        h="$16"
        borderColor={tokens.colors.gray300}
        alt="Imagem do usuário"
      />

      <VStack flex={1}>
        <Text color={tokens.colors.gray100} fontSize="$sm">
          Olá,
        </Text>
        <Heading color={tokens.colors.gray100} fontSize="$md">
          {user.name}
        </Heading>
      </VStack>

      <TouchableOpacity onPress={signOut}>
        <Icon as={LogOut} color={tokens.colors.gray200} size="xl" />
      </TouchableOpacity>
    </HStack>
  );
}
