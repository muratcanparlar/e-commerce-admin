import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export type DecodedToken = {
  sub: string;
  email: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string[];
  exp: number;
  iat: number;
};

export async function getUserFromToken() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("accessToken")?.value;

    if (!token) return null;

    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    return null;
  }
}
