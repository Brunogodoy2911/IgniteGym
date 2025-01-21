import { Center, Heading } from "@gluestack-ui/themed";
import { colors } from "@utils/colors";

type Props = {
  title: string;
};

export function ScreenHeader({ title }: Props) {
  return (
    <Center bg={colors.gray600} pb="$6" pt="$16">
      <Heading color={colors.gray100} fontSize="$xl" fontFamily="$heading">
        {title}
      </Heading>
    </Center>
  );
}
