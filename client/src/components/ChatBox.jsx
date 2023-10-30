import {
  Stack,
  Flex,
  Text,
  Divider,
  Input,
  Button,
  Avatar,
  AvatarBadge,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";

export const ChatBox = observer(() => {
  const scrollStyle = {
    overflowY: "auto",
    maxHeight: "20vh",
    maxWidth: "100%",
  };

  const [messages, setMessages] = useState([
    { from: "peer", text: "Hi, I'm your Peer" },
    { from: "me", text: "Hey there" },
    {
      from: "peer",
      text: "Nice to meet you. You can send me message and i'll reply you with same message.",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim().length) {
      return;
    }
    const data = inputMessage;

    setMessages((old) => [...old, { from: "me", text: data }]);
    setInputMessage("");

    setTimeout(() => {
      setMessages((old) => [...old, { from: "computer", text: data }]);
    }, 1000);
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
          <AvatarBadge boxSize="1em" bg="green.500" />
        </Avatar>
        <Flex flexDirection="column" mx="5" justify="center">
          <Text fontSize="sm" fontWeight="bold">
            Peer
          </Text>
          <Text color="green.500" fontSize={"sm"}>
            Online
          </Text>
        </Flex>
      </Flex>
      <Divider />
      <Flex w={["100%", "100%"]} h="50%" flexDir="column">
        <div style={scrollStyle}>
          {messages.map((item, index) => {
            if (item.from === "me") {
              return (
                <Flex key={index} w="100%" justify="flex-end">
                  <Flex bg="black" color="white" maxW="45%" my="1" p="3">
                    <Text maxW="100%">{item.text}</Text>
                  </Flex>
                </Flex>
              );
            } else {
              return (
                <Flex key={index} w="100%">
                  <Flex bg="gray.100" color="black" maxW="45%" my="1" p="3">
                    <Text maxW="100%">{item.text}</Text>
                  </Flex>
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
              if (e.key === "Enter") {
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
