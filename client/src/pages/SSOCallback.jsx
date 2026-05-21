// import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'

// export default function SSOCallback() {
//     return <AuthenticateWithRedirectCallback />
// }

// SSOCallback.jsx
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth, AuthenticateWithRedirectCallback } from "@clerk/clerk-react"
import BASE_URL from "../lib/api.js"

const SSOCallback = () => {
    // const { getToken, isSignedIn } = useAuth()
    // const navigate = useNavigate()

    // useEffect(() => {
    //     if (!isSignedIn) return

    //     const syncBackend = async () => {
    //         try {
    //             const clerkToken = await getToken()
    //             const res = await fetch(`${BASE_URL}/api/auth/login/social`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "Authorization": `Bearer ${clerkToken}`
    //                 },
    //                 body: JSON.stringify({ token: clerkToken })
    //             })

    //             if (!res.ok) throw new Error("Backend auth failed")

    //             const data = await res.json()
    //             localStorage.setItem("token", data.data.accessToken)
    //             navigate("/dashboard")
    //         } catch (err) {
    //             console.error(err)
    //             navigate("/login")
    //         }
    //     }

    //     syncBackend()
    // }, [isSignedIn, getToken, navigate])

    // // This is what was missing — Clerk needs this to complete the OAuth flow
    // if (!isSignedIn) return <AuthenticateWithRedirectCallback />

    return <div>Signing you in…</div>
}

export default SSOCallback