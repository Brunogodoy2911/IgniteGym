import { Center, Spinner } from "@gluestack-ui/themed";
import { colors } from "@utils/colors";

export function Loading() {
  return (
    <Center flex={1} bg={colors.gray700}>
      <Spinner size={"large"} color={colors.green500} />
    </Center>
  );
}
