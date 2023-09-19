import { Flex, Box, useColorModeValue } from "@chakra-ui/react";
import { PropTypes } from "prop-types";

export const PageContainer = ({ children }) => {
  return (
    <Flex
      minH={"100vh"}
      align={"flex-start"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
      px={6}
      py={12}
    >
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
        //w={"100%"}
        justifyContent={"center"}
        display={"flex"}
      >
        {children}
      </Box>
    </Flex>
  );
};

PageContainer.propTypes = {
  children: PropTypes.children,
};
