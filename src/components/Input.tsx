import { ComponentProps } from "react";
import {
  Input as GluestackInput,
  InputField,
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@gluestack-ui/themed";

import { space } from "@utils/space";
import { colors } from "@utils/colors";

type Props = ComponentProps<typeof InputField> & {
  errorMessage?: string | null;
  isInvalid?: boolean;
  isReadOnly?: boolean;
};
export function Input({
  isReadOnly = false,
  errorMessage = null,
  isInvalid = false,
  ...rest
}: Props) {
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid} mb="$4" w="$full">
      <GluestackInput
        isInvalid={isInvalid}
        h={space[14]}
        borderWidth="$0"
        borderRadius="$md"
        $focus={{
          borderWidth: 1,
          borderColor: invalid ? colors.red500 : colors.green500,
        }}
        isReadOnly={isReadOnly}
        opacity={isReadOnly ? 0.5 : 1}
      >
        <InputField
          px="$4"
          bg={colors.gray700}
          color="$white"
          fontFamily="$body"
          placeholderTextColor={colors.gray300}
          {...rest}
        />
      </GluestackInput>

      <FormControlError>
        <FormControlErrorText color={colors.red500}>
          {errorMessage}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
}
