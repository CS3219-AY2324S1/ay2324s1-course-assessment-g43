import {
  Stack,
  Flex,
  Text,
  Divider,
  Input,
  Button,
  Avatar,
  AvatarBadge,
  Card,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";

export const ChatBox = observer(({ chat, otherUserName, isPeerConnected, onSendMessage }) => {

  const scrollStyle = {
    overflowY: "auto",
    maxHeight: "20vh",
    maxWidth: "100%",
  };

  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim().length) {
      return;
    }
    onSendMessage(inputMessage);
    setInputMessage("");
  };

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  return (
    <Stack w={"100%"} h={"100%"}>
      <Flex w="100%">
        <Avatar
          size="sm"
          src="https://t3.ftcdn.net/jpg/05/16/27/58/240_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
        >
          <AvatarBadge
            boxSize="1em"
            bg={isPeerConnected ? "green.500" : "red.500"}
          />
        </Avatar>
        <Flex flexDirection="column" mx="5" justify="center">
          <Text fontSize="sm" fontWeight="bold">
            {otherUserName}
          </Text>
          <Text
            color={isPeerConnected ? "green.500" : "red.500"}
            fontSize={"sm"}
          >
            {isPeerConnected ? "Online" : "Offline"}
          </Text>
        </Flex>
      </Flex>
      <Divider />
      <Flex w={["100%", "100%"]} h="50%" flexDir="column">
        <div style={scrollStyle}>
          {chat?.map((message, index) => {
            if (message.sender === "self") {
              return (
                <Flex key={index} w="100%" justify="flex-end">
                  <Card bg={"black"} maxW={"45%"} my="1" p="3" color="white">
                    <Flex>
                      <Text maxW="100%">{message.text}</Text>
                    </Flex>
                  </Card>
                </Flex>
              );
            } else {
              return (
                <Flex key={index} w="100%">
                  <Card bg={"gray.100"} color="black" maxW="45%" my="1" p="3">
                    <Flex>
                      <Text maxW="100%">{message.text}</Text>
                    </Flex>
                  </Card>
                </Flex>
              );
            }
          })}
          <AlwaysScrollToBottom />
        </div>
        <Divider />
        <Flex w="100%" mt="5">
          <Input
            placeholder="Type Something..."
            border="none"
            borderRadius="none"
            _focus={{
              border: "1px solid black",
            }}
            onKeyPress={(e) => {
              if (isPeerConnected && e.key === "Enter") {
                handleSendMessage();
              }
            }}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <Button
            bg="black"
            color="white"
            borderRadius="none"
            isDisabled={!isPeerConnected}
            _hover={{
              bg: "white",
              color: "black",
              border: "1px solid black",
            }}
            disabled={inputMessage.trim().length <= 0}
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Flex>
      </Flex>
    </Stack>
  );
});
