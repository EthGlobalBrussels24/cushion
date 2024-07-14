"use client"

import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "./header.module.css"
import {Button} from "~/components/ui/button";
import { useAuth } from "~/lib/authContext";

export default function WorldIdButton() {
    const { session, loading } = useAuth();

    return (
        <>
            {!session && (
            <>
                <a
                    href={`/api/auth/signin`}
                    onClick={(e) => {
                        e.preventDefault()
                        signIn("worldcoin")
                    }}
                >
                    <Button
                        className="m-4 rounded-full bg-customLightPink text-black transition-all duration-500 hover:bg-customGray hover:text-white">

                        World Id Login
                    </Button>
                </a>
            </>

            )}

            {session?.user && (
                <>
                    <a
                        href={`/api/auth/signout`}
                        onClick={(e) => {
                            e.preventDefault()
                            signOut()
                        }}
                    >
                        <Button
                            className="m-4 rounded-full bg-customLightPink text-black transition-all duration-500 hover:bg-customGray hover:text-white">
                            Sign out World Id: <strong> {session.user.name?.substring(0, 5)}...{session.user.name?.slice(-4)}</strong>
                        </Button>
                    </a>
                </>
            )}
        </>)
}

