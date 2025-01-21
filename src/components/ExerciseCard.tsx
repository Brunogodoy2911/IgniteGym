import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import {
  Heading,
  HStack,
  Image,
  Text,
  VStack,
  Icon,
} from "@gluestack-ui/themed";
import { gluestackUIConfig } from "../../config/gluestack-ui.config";

import { ChevronRight } from "lucide-react-native";

import { api } from "@services/api";
import { ExerciseDTO } from "@dtos/ExerciseDTO";

type Props = TouchableOpacityProps & {
  data: ExerciseDTO;
};

export function ExerciseCard({ data, ...rest }: Props) {
  const colors = gluestackUIConfig.tokens.colors;

  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg={colors.gray500}
        alignItems="center"
        p="$2"
        pr="$4"
        rounded="$md"
        mb="$3"
      >
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`,
          }}
          alt="Imagem do exercício"
          w="$16"
          h="$16"
          rounded="$md"
          mr="$4"
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading fontSize="$lg" color="$white" fontFamily="$heading">
            {data.name}
          </Heading>
          <Text fontSize="$sm" color={colors.gray200} mt="$1" numberOfLines={2}>
            {data.series} séries x {data.repetitions} repetições
          </Text>
        </VStack>

        <Icon as={ChevronRight} color={colors.gray200} />
      </HStack>
    </TouchableOpacity>
  );
}
