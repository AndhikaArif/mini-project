import { type JwtPayload } from "jsonwebtoken";

export interface CostumJwtPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface IRegister {
  name: string;
  username: string;
  email: string;
  password: string;
  referralCode?: string | undefined;
}

export interface IExistingUser {
  id: string;
  name: string;
  email: string;
  role: string;
}
