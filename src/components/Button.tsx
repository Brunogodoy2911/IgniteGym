import { ComponentProps } from "react";
import {
  ButtonSpinner,
  Button as GluestackButton,
  Text,
} from "@gluestack-ui/themed";

import { space } from "@utils/space";
import { colors } from "@utils/colors";

type Props = ComponentProps<typeof GluestackButton> & {
  title: string;
  variant?: "solid" | "outline";
  isLoading?: boolean;
};

export function Button({
  title,
  variant = "solid",
  isLoading = false,
  ...rest
}: Props) {
  return (
    <GluestackButton
      w="$full"
      h={space[14]}
      bg={variant === "outline" ? "transparent" : colors.green700}
      borderWidth={variant === "outline" ? "$1" : "$0"}
      borderColor={colors.green500}
      rounded="$sm"
      $active-bg={variant === "outline" ? colors.gray500 : colors.green500}
      disabled={isLoading}
      opacity={isLoading ? 0.5 : 1}
      {...rest}
    >
      {isLoading ? (
        <ButtonSpinner color="$white" />
      ) : (
        <Text
          color={variant === "outline" ? colors.green500 : "$white"}
          fontFamily="$heading"
          fontSize="$sm"
        >
          {title}
        </Text>
      )}
    </GluestackButton>
  );
}
