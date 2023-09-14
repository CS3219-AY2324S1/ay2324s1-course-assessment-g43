import { Box, Text, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import background from '../media/pic1.png';

export const LandingPage = () => {
  return (
  <Box
    align={'center'}>
    <img src={background} alt="PeerPrep" style={{width: "100%", height: 450}} />
    <Text
      textAlign={useBreakpointValue({ base: "center", md: "center" })}
      fontFamily={'initial'}
      color={useColorModeValue("gray.800", "white")}
      fontSize={'75px'}
    >
      Welcome to PeerPrep
    </Text>
    <a>PeerPrep is a technical interview preparation platform and 
      peer matching system where students can find peers to practice whiteboard-style
      interview questions together.</a>
  </Box>
  );
};