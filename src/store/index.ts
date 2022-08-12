import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

export const ATOM_KEYS = {
  CONVERSATION: "CONVERSATION",
};

export const conversationState = atom({
  key: ATOM_KEYS.CONVERSATION,
  default: null,
});
