const endpoint = "http://localhost:3341";
export const fetchConversations = async () => {
  const url = `${endpoint}/conversations`;
  const response = await fetch(url);
  const data = await response.json();
  return data || [];
};

export const fetchConversation = async (id: number) => {
  const url = `${endpoint}/conversations/${id}`;
  const response = await fetch(url);
  const data = await response.json();
  return data || [];
};
