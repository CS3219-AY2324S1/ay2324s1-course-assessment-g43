import { Button, Card, CardBody, Flex, HStack, Text } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { PageContainer } from "../components/PageContainer";

export const ViewQuestions = observer(() => {
  return (
    <PageContainer w={"100%"}>
      <Card>
        <CardBody>
          <Flex justifyContent={"space-between"}>
            <HStack>
              <Text>1.</Text>
              <Text>Question title</Text>
            </HStack>
            <Button>view</Button>
          </Flex>
        </CardBody>
      </Card>
    </PageContainer>
  );
});
