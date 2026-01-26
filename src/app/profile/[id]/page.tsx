"use client"
import { useParams } from "next/navigation"

export default function UserProfile() {
  const params = useParams()

    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <hr></hr>
            <p className="text-4xl">Profile page 
            <span className="p-2 rounded-lg bg-orange-500 text-black">{params.id}
                </span>
            </p>

        </div>
    )
}