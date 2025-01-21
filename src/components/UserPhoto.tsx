import { ComponentProps } from "react";
import { Image } from "@gluestack-ui/themed";
import { colors } from "@utils/colors";

type Props = ComponentProps<typeof Image>;

export function UserPhoto({ ...rest }: Props) {
  return (
    <Image
      rounded="$full"
      borderWidth="$2"
      borderColor={colors.gray400}
      backgroundColor={colors.gray500}
      {...rest}
    />
  );
}
