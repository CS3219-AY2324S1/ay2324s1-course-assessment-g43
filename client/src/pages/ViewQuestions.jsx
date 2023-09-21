import {
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  Text,
  Stack,
  IconButton,
  Input,
  ButtonGroup,
} from "@chakra-ui/react";
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import { observer } from "mobx-react";
import { PageContainer } from "../components/PageContainer";
import { useEffect } from "react";
import { viewQuestionsStore } from "../stores/viewQuestionsStore";

export const ViewQuestions = observer(() => {
  const store = viewQuestionsStore;
  const state = store.state;

  useEffect(() => {
    viewQuestionsStore.getAllQuestions();
  }, [viewQuestionsStore]);

  return (
    <PageContainer w={"100%"}>
      <Stack spacing={4} w={"100%"}>
        <HStack justifyContent={"space-between"}>
          <Text fontSize="40px" align={"start"}>
            Questions
          </Text>
          <HStack>
            <Input variant="outline" placeholder="Search" width="400px" />
            <IconButton aria-label="Search database" icon={<SearchIcon />} />
          </HStack>
        </HStack>
        <ButtonGroup size="sm" isAttached variant="outline">
          <Button>Create new question </Button>
          <IconButton aria-label="Add to friends" icon={<AddIcon />} />
        </ButtonGroup>
        <Flex justifyContent={"space-between"} px={6}>
          <HStack>
            <Text fontWeight="bold">ID</Text>
            <Text fontWeight="bold">Question Title</Text>
          </HStack>
          <Text fontWeight="bold">Actions</Text>
        </Flex>
        {!!state.questions ? (
          state.questions.map((question) => {
            return (
              <Card key="">
                <CardBody>
                  <Flex justifyContent={"space-between"}>
                    <HStack>
                      <Text>{question.questionId}.</Text>
                      <Text textOverflow={"ellipsis"} maxW={"inherit"}>
                        {question.title}
                      </Text>
                    </HStack>
                    <Button>View Details</Button>
                  </Flex>
                </CardBody>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardBody>
              {/* eslint-disable-next-line react/no-unescaped-entities*/}
              <Text>Can't seem to find any questions.</Text>
            </CardBody>
          </Card>
        )}
      </Stack>
    </PageContainer>
  );
});
