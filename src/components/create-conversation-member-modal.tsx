import {
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useState } from "react";
import { toast } from "react-toastify";

const endpoint = "http://localhost:3341";

export const CreateConversationMember = ({ conversationId }: { conversationId: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [memberId, setMemberId] = useState("");

  const createConversationMember = async () => {
    try {
      const url = `${endpoint}/conversations/${conversationId}/members`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId,
        }),
      });

      const data = await response.json();

      toast("success add member", { autoClose: 1000 });
      onClose();
    } catch (error: any) {
      toast(error?.message, { autoClose: 1000 });

      throw error;
    }
  };

  return (
    <>
      <Button colorScheme={"teal"} size="sm" onClick={onOpen}>
        Add Member
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form
            name="create"
            onSubmit={(event) => {
              event.preventDefault();

              createConversationMember();
            }}
          >
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <FormControl>
                <FormLabel>Member Id</FormLabel>
                <Input
                  placeholder="Member Id"
                  name="memberId"
                  onChange={(event) => {
                    setMemberId(event.target.value);
                  }}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>

              <Button type="submit" value="Submit">
                Create
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
