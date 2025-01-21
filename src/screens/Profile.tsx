import { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { VStack, Center, Text, Heading, useToast } from "@gluestack-ui/themed";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as yup from "yup";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { ToastMessage } from "@components/ToastMessage";
import defaultUserPhotoImg from "@assets/userPhotoDefault.png";

import { useAuth } from "@hooks/useAuth";

import { colors } from "@utils/colors";

const profileSchema = yup.object({
  name: yup.string().required("Informe o nome."),
  email: yup.string().optional(),
  old_password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 dígitos.")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 dígitos.")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref("password"), null], "A confirmação de senha não confere.")
    .when("password", {
      is: (Field: any) => Field,
      then: (schema) =>
        schema.nullable().required("Informe a confirmação da senha"),
    }),
});

type FormDataProps = yup.InferType<typeof profileSchema>;

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      const photoUri = photoSelected.assets[0].uri;

      if (photoUri) {
        const photoInfo = (await FileSystem.getInfoAsync(photoUri)) as {
          size: number;
        };

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action="error"
                title="Imagem muito grande!"
                description="Essa imagem é muito grande. Escolha uma de até 5MB."
                onClose={() => toast.close(id)}
              />
            ),
          });
        }

        const fileExtension = photoSelected.assets[0].uri.split(".").pop();

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append("avatar", photoFile);

        const avatarUpdatedResponse = await api.patch(
          "/users/avatar",
          userPhotoUploadForm,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const userUpdated = user;
        userUpdated.avatar = avatarUpdatedResponse.data.avatar;
        updateUserProfile(userUpdated);

        toast.show({
          placement: "top",
          render: ({ id }) => (
            <ToastMessage
              id={id}
              action="success"
              title="Foto atualizada com sucesso!"
              onClose={() => toast.close(id)}
            />
          ),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true);

      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put("/users", data);

      await updateUserProfile(userUpdated);

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="success"
            title="Perfil atualizado com sucesso!"
            onClose={() => toast.close(id)}
          />
        ),
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível atualizar os dados. Tente novamente mais tarde";
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
            onClose={() => toast.close(id)}
          />
        ),
      });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={
              user.avatar
                ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                : defaultUserPhotoImg
            }
            alt="Foto do usuário"
            size="xl"
          />

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color={colors.green500}
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>
          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Nome"
                  bg={colors.gray600}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  bg={colors.gray600}
                  onChangeText={onChange}
                  value={value}
                  isReadOnly
                />
              )}
            />
          </Center>

          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color={colors.gray200}
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Alterar senha
          </Heading>

          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="old_password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Senha antiga"
                  bg={colors.gray600}
                  onChangeText={onChange}
                  errorMessage={errors.old_password?.message}
                  secureTextEntry
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Nova senha"
                  bg={colors.gray600}
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                  secureTextEntry
                />
              )}
            />
            <Controller
              control={control}
              name="confirm_password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Confirme nova senha"
                  bg={colors.gray600}
                  onChangeText={onChange}
                  errorMessage={errors.confirm_password?.message}
                  secureTextEntry
                />
              )}
            />

            <Button
              title="Atualizar"
              onPress={handleSubmit(handleProfileUpdate)}
              isLoading={isUpdating}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
