import {
  Box,
  Flex,
  Button,
  Stack,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react'


export const LoginUser = () => {
  return <div>
    <NavBar />
    Login user page
    </div>;
};

const NavBar = () => {
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
          <Button
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}
            variant={'link'}
            href={"/"}>
            PeerPrep
            </Button>
          </Flex>
          
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
            whiteSpace={'nowrap'}>
            <a
            fontSize={'sm'}
            fontWeight={600}
            display={{ base: 'none', md: 'inline-flex' }}>
              No account yet?
            </a>
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