import { useEffect, useState } from "react";
import { Box, Text, FormControl, Input, Flex } from "@chakra-ui/react";
import { replyMessage, socket } from "./socket";
import { useRecoilState } from "recoil";
import { conversationState } from "./store";
import { fetchConversation } from "./api";
import { useQuery } from "@tanstack/react-query";

export const Conversation = ({ conversationId }: any) => {
  const [conversation, setConversation] = useRecoilState<any>(conversationState);
  const [message, setMessage] = useState("");

  const { data, isSuccess } = useQuery<any>(["conversation", conversationId], () => fetchConversation(conversationId), {
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (data) {
      setConversation(data);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    socket.on("join", ({ payload, status }) => {
      console.log("join", payload, status);
    });
    socket.on("leave", ({ payload, status }) => {
      console.log("leave", payload, status);
    });
    socket.on("messages", ({ payload, status }) => {
      setConversation((prev: any) => ({
        ...prev,
        messages: [...prev?.messages, payload],
      }));
    });
    return () => {
      socket.off("messages");
      socket.off("join");
      socket.off("leave");
    };
  }, []);

  return (
    <>
      Members:
      <Flex direction={"row"} gap="2" maxWidth="600" height="50px" overflowX={"auto"}>
        {(conversation?.members || []).map((member: any, index: number) => (
          <Text fontSize="xs" key={index}>
            {member?.memberId}
          </Text>
        ))}
      </Flex>
      <br />
      {(conversation?.messages || []).map((message: any, index: number) => (
        <Box key={index} borderBottom="1px" borderBottomColor={"gray.200"} width={"100%"} p={4}>
          <Text>{message?.body}</Text>
          <Text>{message?.sender?.name}</Text>
        </Box>
      ))}
      <form
        name="create"
        onSubmit={(event) => {
          replyMessage(conversationId, message);

          setMessage("");

          event.preventDefault();
        }}
      >
        <FormControl>
          <Input
            name="message"
            value={message}
            onChange={(event) => {
              if (!event.target.value) {
                return;
              }
              setMessage(event.target.value);
            }}
          />
        </FormControl>
      </form>
    </>
  );
};
