import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  useToast,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { useModalComponentStore } from "../contextProviders/modalContext";
import { matchingFormStore } from "../stores/matchingFormStore";
import jwt from "jwt-decode";

const Navbar = observer(() => {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    navigate("/");
  };

  let userRole = "";
  try {
    const token = localStorage.getItem("jwt");
    if (token) {
      const decodedToken = jwt(token);
      userRole = decodedToken.usertype;
    }
  } catch (error) {
    console.log("Error: Failed to get/decode jwt. ", error);
  }
  const localStorageUser = localStorage.getItem("user");
  const navItems =
    !!localStorageUser && localStorageUser !== "undefined"
      ? [
          userRole === "admin"
            ? {
                label: "Questions",
                children: [
                  {
                    label: "Browse",
                    subLabel: "Explore the question pool",
                    href: "/browse-admin",
                  },
                  {
                    label: "Match",
                    subLabel: "Get matched with a peer",
                  },
                ],
              }
            : {
                label: "Match",
              },
          {
            label: "History",
            href: "/history",
          },
          {
            label: "My Profile",
            href: "/me",
          },
        ]
      : [];

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
            as={"a"}
            href="/"
          >
            PeerPrep
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav navItems={navItems} />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          {localStorageUser ? (
            <Button
              as={"a"}
              display={{ base: "inline_flex", md: "inline-flex" }}
              fontSize={"sm"}
              fontWeight={600}
              color={"white"}
              bg={"pink.400"}
              _hover={{
                bg: "pink.300",
              }}
              onClick={onLogout}
            >
              Log Out
            </Button>
          ) : (
            <>
              <Button
                as={"a"}
                fontSize={"sm"}
                fontWeight={400}
                variant={"link"}
                href={"/login-user"}
              >
                Log In
              </Button>
              <Button
                as={"a"}
                display={{ base: "inline-flex", md: "inline-flex" }}
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"pink.400"}
                href={"/register-user"}
                _hover={{
                  bg: "pink.300",
                }}
              >
                Register
              </Button>
            </>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav navItems={navItems} />
      </Collapse>
    </Box>
  );
});

const matchingModalTitle = "Find a Match!";

const MatchingModalBody = observer(() => {
  return (
    <FormControl id="complexity" isRequired>
      <FormLabel>Complexity</FormLabel>
      <Select
        placeholder="Select complexity"
        isDisabled={matchingFormStore.isLoading}
        onChange={(e) => matchingFormStore.setComplexity(e.target.value)}
      >
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </Select>
    </FormControl>
  );
});

const MatchingModalFooter = observer(() => {

  const handleCancel = (e) => {
    e.preventDefault();

    matchingFormStore.setIsCancelLoading(true);
    matchingFormStore.sendMatchCancelRequest();
  };

  return (
    <>
      <Button
        colorScheme="red"
        mr={3}
        isLoading={matchingFormStore.isCancelLoading}
        isDisabled={!matchingFormStore.isLoading}
        onClick={handleCancel}
      >
        Cancel
      </Button>

      <Button
      colorScheme="green"
      mr={3}
      type="submit"
      isLoading={matchingFormStore.isLoading}
      isDisabled={matchingFormStore.isLoading}
      loadingText={`Finding you a match (${matchingFormStore.countdown}s)`}
    >
      Match
    </Button>

    </>

  );
});

const DesktopNav = ({ navItems }) => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const navigate = useNavigate();
  const toast = useToast();
  const modalComponentStore = useModalComponentStore();

  // This only runs on successful POST to Sessions collection
  const redirectToSessionPage = ({
    questionId,
    title,
    description,
    category,
    complexity,
    roomId,
  }) => {
    // Write roomId to localStorage
    localStorage.setItem("roomId", roomId);
    navigate(`/session/${roomId}`, {
      state: {
        questionId,
        title,
        description,
        category,
        complexity,
      },
    });
  };

  return (
    <Stack direction={"row"} spacing={4}>
      {navItems.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Box
                as="a"
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
                onClick={
                  navItem.label != "Match"
                    ? () => {}
                    : () =>
                        modalComponentStore.openModal(
                          matchingModalTitle,
                          <MatchingModalBody />,
                          <MatchingModalFooter />,
                          (e) => {
                            e.preventDefault();

                            modalComponentStore.setClosable(false);

                            const uid = JSON.parse(
                              localStorage.getItem("user")
                            ).uid;
                            matchingFormStore.setUid(uid);

                            const matchSuccessCallback = (data) => {
                              modalComponentStore.closeModal();
                              redirectToSessionPage(data);
                              toast({
                                title: `Successfully matched with User #${data.firstUserId} on ${data.complexity} question - ${data.title}`,
                                status: "success",
                                duration: 8000,
                                isClosable: true,
                              });
                            };
                            const matchFailureCallback = (rejectionReason) => {
                              modalComponentStore.setClosable(true);
                              toast({
                                title: rejectionReason,
                                status: "warning",
                                duration: 5000,
                                isClosable: true,
                              });
                            };

                            const matchCancelCallback = () => {
                              modalComponentStore.setClosable(true);
                              toast({
                                title: `Cancelled match successfully`,
                                status: "warning",
                                duration: 5000,
                                isClosable: true,
                              });
                            };

                            matchingFormStore
                              .startLoading()
                              .then(null, matchFailureCallback);
                            matchingFormStore.sendMatchRequest(
                              matchSuccessCallback,
                              matchFailureCallback,
                              matchCancelCallback,
                            );
                          },
                          () => matchingFormStore.resetState()
                        )
                }
              >
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  const bgcolor = useColorModeValue("pink.50", "gray.900");
  const navigate = useNavigate();
  const toast = useToast();
  const modalComponentStore = useModalComponentStore();

  // This only runs on successful POST to Sessions collection
  const redirectToSessionPage = ({
    questionId,
    title,
    description,
    category,
    complexity,
    roomId,
  }) => {
    // Write roomId to localStorage
    localStorage.setItem("roomId", roomId);
    navigate(`/session/${roomId}`, {
      state: {
        questionId,
        title,
        description,
        category,
        complexity,
      },
    });
  };

  return (
    <Box
      as="a"
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: bgcolor }}
      cursor={"pointer"}
      onClick={
        label != "Match"
          ? () => {}
          : () =>
              modalComponentStore.openModal(
                matchingModalTitle,
                <MatchingModalBody />,
                <MatchingModalFooter />,
                (e) => {
                  e.preventDefault();

                  modalComponentStore.setClosable(false);

                  const uid = JSON.parse(localStorage.getItem("user")).uid;
                  matchingFormStore.setUid(uid);

                  const matchSuccessCallback = (data) => {
                    modalComponentStore.closeModal();
                    redirectToSessionPage(data);
                    toast({
                      title: `Successfully matched with User #${data.firstUserId} on ${data.complexity} question - ${data.title}`,
                      status: "success",
                      duration: 8000,
                      isClosable: true,
                    });
                  };
                  const matchFailureCallback = (rejectionReason) => {
                    modalComponentStore.setClosable(true);
                    toast({
                      title: rejectionReason,
                      status: "warning",
                      duration: 5000,
                      isClosable: true,
                    });
                  };

                  const matchCancelCallback = () => {
                    modalComponentStore.setClosable(true);
                    toast({
                      title: `Cancelled match successfully`,
                      status: "warning",
                      duration: 5000,
                      isClosable: true,
                    });
                  };

                  matchingFormStore
                    .startLoading()
                    .then(null, matchFailureCallback);
                  matchingFormStore.sendMatchRequest(
                    matchSuccessCallback,
                    matchFailureCallback,
                    matchCancelCallback
                  );
                },
                () => matchingFormStore.resetState()
              )
      }
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

const MobileNav = ({ navItems }) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {navItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen: isToggleOpen, onToggle } = useDisclosure();
  const modalComponentStore = useModalComponentStore();
  const toast = useToast();
  const navigate = useNavigate();

  // This only runs on successful POST to Sessions collection
  const redirectToSessionPage = ({
    questionId,
    title,
    description,
    category,
    complexity,
    roomId,
  }) => {
    // Write roomId to localStorage
    localStorage.setItem("roomId", roomId);
    navigate(`/session/${roomId}`, {
      state: {
        questionId: questionId,
        title: title,
        description: description,
        category: category,
        complexity: complexity,
      },
    });
  };

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        as="a"
        href={href ?? "#"}
        _hover={{
          textDecoration: "none",
        }}
        onClick={
          label != "Match"
            ? () => {}
            : () =>
                modalComponentStore.openModal(
                  matchingModalTitle,
                  <MatchingModalBody />,
                  <MatchingModalFooter />,
                  (e) => {
                    e.preventDefault();

                    modalComponentStore.setClosable(false);

                    const uid = JSON.parse(localStorage.getItem("user")).uid;
                    matchingFormStore.setUid(uid);

                    const matchSuccessCallback = (data) => {
                      modalComponentStore.closeModal();
                      redirectToSessionPage(data);
                      toast({
                        title: `Successfully matched with User #${data.firstUserId} on ${data.complexity} question - ${data.title}`,
                        status: "success",
                        duration: 8000,
                        isClosable: true,
                      });
                    };
                    const matchFailureCallback = (rejectionReason) => {
                      modalComponentStore.setClosable(true);
                      toast({
                        title: rejectionReason,
                        status: "warning",
                        duration: 5000,
                        isClosable: true,
                      });
                    };

                    const matchCancelCallback = () => {
                      modalComponentStore.setClosable(true);
                      toast({
                        title: `Cancelled match successfully`,
                        status: "warning",
                        duration: 5000,
                        isClosable: true,
                      });
                    };

                    matchingFormStore
                      .startLoading()
                      .then(null, matchFailureCallback);
                    matchingFormStore.sendMatchRequest(
                      matchSuccessCallback,
                      matchFailureCallback,
                      matchCancelCallback,
                    );
                  },
                  () => matchingFormStore.resetState()
                )
        }
      >
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Text
            fontWeight={600}
            color={useColorModeValue("gray.600", "gray.200")}
          >
            {label}
          </Text>
          {children && (
            <Icon
              as={ChevronDownIcon}
              transition={"all .25s ease-in-out"}
              transform={isToggleOpen ? "rotate(180deg)" : ""}
              w={6}
              h={6}
            />
          )}
        </Flex>
      </Box>

      <Collapse
        in={isToggleOpen}
        animateOpacity
        style={{ marginTop: "0!important" }}
      >
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Box
                as="a"
                key={child.label}
                py={2}
                href={child.href}
                cursor={"pointer"}
                onClick={
                  child.label != "Match"
                    ? () => {}
                    : () =>
                        modalComponentStore.openModal(
                          matchingModalTitle,
                          <MatchingModalBody />,
                          <MatchingModalFooter />,
                          (e) => {
                            e.preventDefault();

                            modalComponentStore.setClosable(false);

                            const uid = JSON.parse(
                              localStorage.getItem("user")
                            ).uid;
                            matchingFormStore.setUid(uid);

                            const matchSuccessCallback = (data) => {
                              modalComponentStore.closeModal();
                              redirectToSessionPage(data);
                              toast({
                                title: `Successfully matched with User #${data.firstUserId} on ${data.complexity} question - ${data.title}`,
                                status: "success",
                                duration: 8000,
                                isClosable: true,
                              });
                            };
                            const matchFailureCallback = (rejectionReason) => {
                              modalComponentStore.setClosable(true);
                              toast({
                                title: rejectionReason,
                                status: "warning",
                                duration: 5000,
                                isClosable: true,
                              });
                            };

                            const matchCancelCallback = () => {
                              modalComponentStore.setClosable(true);
                              toast({
                                title: `Cancelled match successfully`,
                                status: "warning",
                                duration: 5000,
                                isClosable: true,
                              });
                            };
          
                            matchingFormStore
                              .startLoading()
                              .then(null, matchFailureCallback);
                            matchingFormStore.sendMatchRequest(
                              matchSuccessCallback,
                              matchFailureCallback,
                              matchCancelCallback
                            );
                          },
                          () => matchingFormStore.resetState()
                        )
                }
              >
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

DesktopSubNav.propTypes = {
  label: PropTypes.string,
  href: PropTypes.string,
  subLabel: PropTypes.string,
};

MobileNavItem.propTypes = {
  label: PropTypes.string,
  children: PropTypes.array,
  href: PropTypes.string,
};

MobileNav.propTypes = {
  navItems: PropTypes.array,
};

DesktopNav.propTypes = {
  navItems: PropTypes.array,
  map: PropTypes.object,
};

export default Navbar;
