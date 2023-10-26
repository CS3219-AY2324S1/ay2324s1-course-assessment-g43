import { Flex, Box, useColorModeValue } from "@chakra-ui/react";
import { PropTypes } from "prop-types";
import Navbar from "./Navbar";
import ModalComponent from "./ModalComponent";
import useHasActiveSession from "../hooks/useShowResumeSession";
import ResumeSession from "./ResumeSession";

export const PageContainer = ({ children, w }) => {
  const hasActiveSession = useHasActiveSession();
  return (
    <>
      <Navbar />
      <Flex
        minH={"100vh"}
        align={"flex-start"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        {hasActiveSession ? <ResumeSession /> : <></>}
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
      <ModalComponent />
    </>
  );
};

PageContainer.propTypes = {
  children: PropTypes.object,
  w: PropTypes.string,
};
