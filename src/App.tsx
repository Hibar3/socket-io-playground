import { useState, useEffect } from "react";
import { Flex, Input, Box, Button, FormControl, FormLabel, Text } from "@chakra-ui/react";
import { CreateConversation } from "./components/create-conversation-modal";
import { Conversation } from "./conversation";
import { joinRoom, leaveRoom, socket, socketConnect, socketDisconnect } from "./socket";
import { useQuery } from "@tanstack/react-query";
import { fetchConversations } from "./api";
import { CreateConversationMember } from "./components/create-conversation-member-modal";
import { AuthInfo, getAuthInfo, storeAuthInfo } from "./storage";

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [token, setToken] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string>("");

  const { data: conversations, refetch } = useQuery<any[]>(["conversations"], fetchConversations, { enabled: false });
  useEffect(() => {
    if (isConnected) {
      refetch();
    }
  }, [isConnected]);

  useEffect(() => {
    // stay logged on mounted
    const auth = getAuthInfo();
    if (auth?.token) {
      socketConnect(auth.token);
    }

    // login success
    socket.on("logged", ({ status, payload }: { status: string; payload: AuthInfo }) => {
      storeAuthInfo({
        ...payload,
      });
    });

    socket.on("new_conversation", () => {
      // OR merge with state
      refetch();
    });

    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("session");
    };
  }, []);

  const renderLogin = () => {
    return (
      <Box m={4} p={4} borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Box display="flex" alignItems="end">
          <FormControl>
            <FormLabel>User token</FormLabel>
            <Input
              required
              onChange={(event) => {
                setToken(event.target.value);
              }}
            />
          </FormControl>

          <Button
            ml={2}
            onClick={() => {
              socketConnect(token as string);
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
    );
  };

  const renderChats = () => {
    const authInfo = getAuthInfo();

    return (
      <>
        <Box flex="1" height="100vh" borderWidth="0.5px" p={4} overflowY="scroll">
          <Box borderBottom="1px" borderBottomColor={"gray.200"} width={"100%"} p={4}>
            <Text fontWeight="bold">{authInfo?.name}</Text>
            <Text fontWeight="bold" fontSize="xs">
              {authInfo?.id}
            </Text>
          </Box>

          <Box borderBottom="1px" borderBottomColor={"gray.200"} width={"100%"} p={4}>
            <Button colorScheme={"teal"} size="sm" onClick={() => socketDisconnect()}>
              Logout
            </Button>
          </Box>

          <Box borderBottom="1px" borderBottomColor={"gray.200"} width={"100%"} p={4}>
            <CreateConversation
              userId={authInfo?.id}
              onSuccess={() => {
                fetchConversations();
              }}
            />
          </Box>

          {(conversations || []).map((current, index) => {
            return (
              <Box
                key={index}
                borderBottom="1px"
                borderBottomColor={"gray.200"}
                width={"100%"}
                p={4}
                onClick={() => {
                  setConversationId((prev: any) => {
                    leaveRoom(prev);
                    return current.id;
                  });
                  console.log("line 123", current?.id);

                  joinRoom(current.id);
                }}
                _hover={{ cursor: "pointer" }}
              >
                <Text>{current?.title}</Text>
                <Text color="gray.500">{current?.latestMessage?.body}</Text>
              </Box>
            );
          })}
        </Box>

        <Box flex="5" p={4}>
          {conversationId ? (
            <>
              <CreateConversationMember conversationId={conversationId} />

              <Box marginTop={5} height="80vh" overflowY="scroll">
                <Conversation conversationId={conversationId} />
              </Box>
            </>
          ) : (
            <>Please select chat</>
          )}
        </Box>
      </>
    );
  };

  return (
    <Flex height="100vh" width="100%" justifyContent="center" alignItems="center">
      {isConnected ? <>{renderChats()}</> : <>{renderLogin()}</>}
    </Flex>
  );
}
