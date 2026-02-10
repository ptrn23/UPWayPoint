import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, schema } from "@repo/db"; // your drizzle instance
import { inferAdditionalFields } from "better-auth/client/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
      provider: "pg", // or "mysql", "sqlite"
      schema
  }),
  emailAndPassword: { 
    enabled: false, 
  }, 
  socialProviders: { 
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID as string, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
    }, 
  },
  baseURL: "http://localhost:3000",
  plugins: [inferAdditionalFields()]
});