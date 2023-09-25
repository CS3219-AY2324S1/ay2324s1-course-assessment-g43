import { Text, useColorModeValue, Stack } from "@chakra-ui/react";
import background from "../media/pic4.jpg";
import { PageContainer } from "../components/PageContainer";

export const LandingPage = () => {
  return (
    <PageContainer w={"100%"}>
      <Stack align={"center"}>
        <img
          src={background}
          alt="PeerPrep"
          style={{ width: "100%", height: "60vh" }}
        />
        <Text color={useColorModeValue("gray.800", "white")} fontSize={"75px"}>
          Welcome to PeerPrep
        </Text>
        <Text>
          PeerPrep is a technical interview preparation platform and peer
          matching system where students can find peers to practice
          whiteboard-style interview questions together.
        </Text>
      </Stack>
    </PageContainer>
  );
};
