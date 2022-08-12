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

export const CreateConversation = ({ userId, onSuccess }: { userId: any; onSuccess: () => void }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reference, setReference] = useState("");

  const createConversations = async () => {
    try {
      const url = `${endpoint}/conversations`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reference,
          userId,
          metadata: {
            ticketId: Math.round(Math.random() * 1000000),
          },
        }),
      });

      const data = await response.json();

      toast("success create conversation", { autoClose: 1000 });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast(error?.message, { autoClose: 1000 });

      throw error;
    }
  };

  return (
    <>
      <Button colorScheme={"teal"} size="sm" onClick={onOpen}>
        New Conversation
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form
            name="create"
            onSubmit={(event) => {
              event.preventDefault();

              createConversations();
            }}
          >
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <FormControl>
                <FormLabel>Reference</FormLabel>
                <Input
                  placeholder="Reference"
                  name="reference"
                  onChange={(event) => {
                    setReference(event.target.value);
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
