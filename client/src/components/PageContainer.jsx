import { Flex, Box, useColorModeValue } from "@chakra-ui/react";
import { PropTypes } from "prop-types";

export const PageContainer = ({ children, w }) => {
  return (
    <Flex
      minH={"100vh"}
      align={"flex-start"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={6}
        m={6}
        w={w || "auto"}
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
  w: PropTypes.w,
};
