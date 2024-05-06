'use client'

import { useSession } from "next-auth/react";

export default function Jumbotron() {
    const { data: session, status } = useSession()

    if (status === "authenticated") {
        return (
            <div className="">
                <h1 className="font-bold text-7xl text-white">Welcome back <br/>{session.user.name}!</h1>
                <br/><h3 className="font-bold text-3xl text-white">Let&apos;s start brewing happiness.</h3>
            </div>
        )
    } else {
        return(
            <div className="">
                <h1 className="font-bold text-7xl text-white">Everything is better<br/> with coffee</h1>
                <h3 className="font-bold text-3xl text-white">Crafting Moments, One Bean at a Time</h3>
            </div>
        )
    }
}