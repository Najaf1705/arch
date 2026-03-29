export type AuthState = {
  user: any | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
};