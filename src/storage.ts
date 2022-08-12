export interface AuthInfo {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  token: string;
}

export const storeAuthInfo = (payload: AuthInfo) => {
  localStorage.setItem("auth", JSON.stringify(payload));
};

export const getAuthInfo = () => {
  const data: any = localStorage.getItem("auth");
  return data ? (JSON.parse(data) as AuthInfo) : null;
};

export const removeLogin = () => {
  localStorage.removeItem("auth");
};
