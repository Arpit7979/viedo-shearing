import { DefaultSession } from "next-auth"

declare module "next-auth" {

  interface Session {
    user: {
      /** The user's ID. */
      id: string
    } & DefaultSession["user"]
  }
}