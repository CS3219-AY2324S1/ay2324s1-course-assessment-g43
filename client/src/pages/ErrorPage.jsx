import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { PageContainer } from "../components/PageContainer";
import { errorCodeContent } from "../utils/error";

export const ErrorPage = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  const statusCode = params.statusCode;
  return (
    <PageContainer>
      <Box textAlign="center" py={10} px={6}>
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bgGradient="linear(to-r, red.500, red.500)"
          backgroundClip="text"
        >
          {statusCode}
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          {errorCodeContent[statusCode].title}
        </Text>
        <Text color={"gray.500"} mb={6}>
          {errorCodeContent[statusCode].description}
        </Text>

        <Button
          variant="solid"
          onClick={() => {
            window.location.replace(errorCodeContent[statusCode].redirectUrl);
          }}
        >
          {errorCodeContent[statusCode].buttonText}
        </Button>
      </Box>
    </PageContainer>
  );
};
