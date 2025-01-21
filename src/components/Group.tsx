import { ComponentProps } from "react";
import { Button, Text } from "@gluestack-ui/themed";
import { gluestackUIConfig } from "../../config/gluestack-ui.config";

type Props = ComponentProps<typeof Button> & {
  name: string;
  isActive: boolean;
};

export function Group({ name, isActive, ...rest }: Props) {
  const colors = gluestackUIConfig.tokens.colors;

  return (
    <Button
      mr="$3"
      minWidth="$24"
      h="$10"
      bg={colors.gray600}
      rounded="$md"
      justifyContent="center"
      alignItems="center"
      borderColor={colors.green500}
      borderWidth={isActive ? 1 : 0}
      sx={{
        ":active": {
          borderWidth: 1,
        },
      }}
      {...rest}
    >
      <Text
        color={isActive ? colors.green500 : colors.gray200}
        textTransform="uppercase"
        fontSize="$xs"
        fontFamily="$heading"
      >
        {name}
      </Text>
    </Button>
  );
}
