import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import User from "@/Models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers:[
    CredentialsProvider({
      name: "Credentials",
      credentials:{
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"}
      },
      async authorize(credentials){
        if(!credentials?.email || !credentials?.password){
          throw new Error("Email and password are required");
        }
        try {
          await dbConnect();
          const user = await User.findOne({email: credentials.email});
          if(!user){
            throw new Error("No user found with the provided email");
          }
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if(!isPasswordValid){
            throw new Error("Invalid password");
          }
          return {
            email: user.email,
            id: user._id.toString(),
          };
        } catch (error) {
          console.error("Error connecting to the database or processing request:", error);
          throw error;
        }
      }
    })

  ],
  callbacks:{
    async jwt({token, user}){
      if(user){
        token.id = user.id;
      }
      return token;
    },
    async session({session,token}){
      if(session.user){
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages:{
    signIn: "/login",
    error: "/login",
  },
  session:{
    strategy:"jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}