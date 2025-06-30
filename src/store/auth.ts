import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import { Timestamp } from "../../pb/google/protobuf/timestamp";

interface JwtPayload{
  sub: string;
  full_name: string;
  email: string;
  role: string;
  member_since: Timestamp;
}


interface AuthStoreState{
  isLoggedIn: boolean;
  jwtPayload: JwtPayload | null;
  role: "custumer" | "admin";
  login: (token: string) => void;
  logout: () => void;

}

export const useAuthStore = create<AuthStoreState>((set) => ({
  isLoggedIn: false,
  jwtPayload: null,
  role: "custumer",

  login: (token: string) => set(state => {
  try {
    const claims = jwtDecode<JwtPayload>(token)
    return  {
      ...state,
      isLoggedIn: true,
      jwtPayload: claims,
      role: claims.role === 'admin'
            ? 'admin'
            : 'custumer',
    }
    } catch  {
      return {
        ...state,
      }
    }
  }),
  logout: () => set(state => {
    return {
      ...state,
      isLoggedIn: false,
      jwtPayload: null,
      role: 'custumer',
    }
  })
}))