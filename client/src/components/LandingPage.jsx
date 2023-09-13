import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react'

export const LandingPage = () => {
  return (<div>
    <Navbar />
  <div>hehhhllo world</div>
  </div>
  )
};

const Navbar = () => {
  return (
      <Box position={'static'}>
        <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        w={'80vw'}
        py={{ base: 2 }}
        px={{ base: 1 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        justify = {{ base: 'none', md: 'flex'}}>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}>
            PeerPrep
            </Text>
          </Flex>
          
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}>
            <Button as={'a'} fontSize={'sm'} fontWeight={400} variant={'link'} href={'./LoginUser'}>
            Login
            </Button>
            
            <Button
            as={'a'}
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'pink.400'}
            href={'./RegisterUser'}
            _hover={{
                bg: 'pink.300',
            }}>
            Register
            </Button>
          </Stack>
        </Flex>
      </Box>
  )
}