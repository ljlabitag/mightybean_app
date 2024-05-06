'use client'
import { signIn, signOut } from "next-auth/react"
import { useSession } from "next-auth/react"

export default function SignInButton() {
    const { data: session, status } = useSession()

    if (status === "authenticated") {
        return (
            <button
                onClick={()=>signOut()}
                className=""
            >Logout</button>
        )
    } else {
        return(
            <button
                onClick={()=>signIn()}
                className=""
            >Login</button>
        )
    }
}