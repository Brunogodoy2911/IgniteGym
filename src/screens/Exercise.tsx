import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import {
  VStack,
  Icon,
  HStack,
  Heading,
  Text,
  Box,
  useToast,
} from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ExerciseDTO } from "@dtos/ExerciseDTO";

import { Button } from "@components/Button";
import { ToastMessage } from "@components/ToastMessage";
import { Loading } from "@components/Loading";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionSvg from "@assets/repetitions.svg";

import { colors } from "@utils/colors";

type RouteParamsProps = {
  exerciseId: string;
};
export function Exercise() {
  const [sendingRegister, setSendingRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();

  const { exerciseId } = route.params as RouteParamsProps;

  const toast = useToast();

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/${exerciseId}`);
      setExercise(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os detalhes dos exercícios";
      return toast.show({
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
      setIsLoading(false);
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setSendingRegister(true);

      await api.post("/history", { exercise_id: exerciseId });

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="success"
            title="Exercício registrado com sucesso!"
            onClose={() => toast.close(id)}
          />
        ),
      });

      navigation.navigate("history");
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível registrar o exercícios";
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
      setSendingRegister(false);
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  return (
    <VStack flex={1}>
      <VStack px="$8" bg={colors.gray600} pt="$12">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color={colors.green500} size="xl" />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt="$4"
          mb="$8"
        >
          <Heading
            color={colors.gray100}
            fontFamily="$heading"
            fontSize="$lg"
            flexShrink={1}
          >
            {exercise.name}
          </Heading>
          <HStack alignItems="center">
            <BodySvg />

            <Text color={colors.gray200} ml="$1" textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>
      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <VStack p="$8">
            <Image
              source={{
                uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
              }}
              alt="Exercício"
              contentFit="cover"
              style={{
                width: "100%",
                height: 320,
                borderRadius: 8,
                marginBottom: 12,
              }}
            />

            <Box bg={colors.gray600} rounded="$md" pb="$4" px="$4">
              <HStack
                alignItems="center"
                justifyContent="space-around"
                mb="$6"
                mt="$5"
              >
                <HStack>
                  <SeriesSvg />
                  <Text color={colors.gray200} ml="$2">
                    {exercise.series} séries
                  </Text>
                </HStack>
                <HStack>
                  <RepetitionSvg />
                  <Text color={colors.gray200} ml="$2">
                    {exercise.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>

              <Button
                title="Marcar como realizado"
                isLoading={sendingRegister}
                onPress={handleExerciseHistoryRegister}
              />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  );
}
