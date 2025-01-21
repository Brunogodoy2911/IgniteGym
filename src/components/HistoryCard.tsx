import { HistoryDTO } from "@dtos/HistoryDTO";
import { Heading, HStack, Text, VStack } from "@gluestack-ui/themed";
import { colors } from "@utils/colors";

type Props = {
  data: HistoryDTO;
};

export function HistoryCard({ data }: Props) {
  return (
    <HStack
      w="$full"
      px="$5"
      py="$4"
      mb="$3"
      bg={colors.gray600}
      rounded="$md"
      alignItems="center"
      justifyContent="space-between"
    >
      <VStack mr="$5">
        <Heading
          color="$white"
          fontSize="$md"
          textTransform="capitalize"
          fontFamily="$heading"
          numberOfLines={1}
        >
          {data.group}
        </Heading>

        <Text color={colors.gray100} fontSize="$lg" numberOfLines={1}>
          {data.name}
        </Text>
      </VStack>

      <Text color={colors.gray300} fontSize="$md">
        {data.hour}
      </Text>
    </HStack>
  );
}
