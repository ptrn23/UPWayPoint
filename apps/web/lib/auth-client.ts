import { auth } from "@repo/auth"
import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000",
    plugins: [inferAdditionalFields<typeof auth>()]
})

export type Session = typeof authClient.$Infer.Session
export const { signIn, signUp, signOut, useSession, getSession } = authClient;