import { useCallback, useState } from "react";
import { SectionList } from "react-native";
import { Heading, Text, useToast, VStack } from "@gluestack-ui/themed";
import { useFocusEffect } from "@react-navigation/native";

import { api } from "@services/api";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";

import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { ToastMessage } from "@components/ToastMessage";
import { Loading } from "@components/Loading";

import { colors } from "@utils/colors";
import { space } from "@utils/space";
import { AppError } from "@utils/AppError";

export function History() {
  const [isLoading, setIsLoading] = useState(false);
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

  const toast = useToast();

  async function fetchHistory() {
    try {
      setIsLoading(true);
      const response = await api.get("/history");
      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar o histórico";
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
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />
      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard data={item} />}
          renderSectionHeader={({ section }) => (
            <Heading
              color={colors.gray200}
              fontSize="$md"
              mt={space[10]}
              mb="$3"
            >
              {section.title}
            </Heading>
          )}
          style={{ paddingHorizontal: 32 }}
          contentContainerStyle={
            exercises.length === 0 && { flex: 1, justifyContent: "center" }
          }
          ListEmptyComponent={() => (
            <Text color={colors.gray100} textAlign="center">
              Não há exercícios registrados ainda.{"\n"} Vamos fazer exercícios
              hoje?
            </Text>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </VStack>
  );
}
