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

const Navbar = observer(() => {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const localStorageUser = localStorage.getItem("user");
  const navItems =
    !!localStorageUser && localStorageUser !== "undefined"
      ? [
          {
            label: "Questions",
            children: [
              {
                label: "Browse",
                subLabel: "Explore the question pool",
                href: "/browse",
              },
              {
                label: "Match",
                subLabel: "Get matched with a peer",
              },
            ],
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
              display={{ base: "none", md: "inline-flex" }}
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
                display={{ base: "none", md: "inline-flex" }}
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

const DesktopNav = ({ navItems }) => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const redirectToSessionPage = () => {
    navigate("/session", {
      state: {
        questionId: 35,
        title: "Linked List Cycle Detection",
        description:
          "Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter. Return true if there is a cycle in the linked list. Otherwise, return false. Example 1: Input: head = [3,2,0,-4], pos = 1 Output: true Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed). Example 2: Input: head = [1,2], pos = 0 Output: true Explanation: There is a cycle in the linked list, where the tail connects to the 0th node. Example 3: Input: head = [1], pos = -1 Output: false Explanation: There is no cycle in the linked list. Constraints:  The number of the nodes in the list is in the range [0, 104].  -105 <= Node.val <= 105  pos is -1 or a valid index in the linked-list. Follow up: Can you solve it using O(1) (i.e. constant) memory?",
        category: ["Data Structures", "Algorithms"],
        complexity: "Easy",
      },
    });
  };
  const modalComponentStore = useModalComponentStore();

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
      onClick={label != "Match" ? () => {} : modalComponentStore.openModal}
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
  const navigate = useNavigate();
  const { isOpen: isToggleOpen, onToggle } = useDisclosure();
  const modalComponentStore = useModalComponentStore();

  const redirectToSessionPage = () => {
    navigate("/session", {
      state: {
        questionId: 35,
        title: "Linked List Cycle Detection",
        description:
          "Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter. Return true if there is a cycle in the linked list. Otherwise, return false. Example 1: Input: head = [3,2,0,-4], pos = 1 Output: true Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed). Example 2: Input: head = [1,2], pos = 0 Output: true Explanation: There is a cycle in the linked list, where the tail connects to the 0th node. Example 3: Input: head = [1], pos = -1 Output: false Explanation: There is no cycle in the linked list. Constraints:  The number of the nodes in the list is in the range [0, 104].  -105 <= Node.val <= 105  pos is -1 or a valid index in the linked-list. Follow up: Can you solve it using O(1) (i.e. constant) memory?",
        category: ["Data Structures", "Algorithms"],
        complexity: "Easy",
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
                onClick={
                  child.label != "Match"
                    ? () => {}
                    : modalComponentStore.openModal
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
