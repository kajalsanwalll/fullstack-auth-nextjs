"use client";
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios, { Axios } from 'axios';
import toast from 'react-hot-toast';


export default function SignupPage (){
    const router = useRouter();
    const [user, setUser] = React.useState({  //grabbing user info
        email: "",
        password: "",
        username: ""
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    useEffect(()=>{
           if(user.email.length > 0 && user.password.length > 0 
            && user.username.length > 0){
            setButtonDisabled(false);
           }else{
            setButtonDisabled(true);
           }
    }, [user]);  

    const onSignup = async () => { // after signup  
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("Signup success", response.data);
            router.push("/login");
            
        } catch (error:any) {
            console.log("Signup failed!", error.message);

            toast.error(error.response?.data?.error || "Signup failed");
            
        }finally{
            setLoading(false);
        }
     }  
    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>{loading ? "Processing..." : "Signup!"}</h1>
            <hr></hr>
            <label htmlFor='username'>username</label>
            <input 
            className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'
            id='username' 
            type='text' 
            value={user.username}
            onChange={(e)=> setUser({...user, username: e.target.value})}
            placeholder='Enter your username'
            ></input>

            <label htmlFor='email'>email</label>
            <input 
            className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'
            id='email' 
            type='email' 
            value={user.email}
            onChange={(e)=> setUser({...user, email: e.target.value})}
            placeholder='Enter your email'
            ></input>

            <label htmlFor='password'>password</label>
            <input 
            className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'
            id='password' 
            type='password' 
            value={user.password}
            onChange={(e)=> setUser({...user, password: e.target.value})}
            placeholder='password'
            ></input>

            <button
               onClick={onSignup}
               disabled={buttonDisabled || loading}
               className={`p-2 border border-gray-300 rounded-lg mb-4
              ${buttonDisabled || loading ? "opacity-50 cursor-not-allowed" : ""}`}
               >
               {loading ? "Processing..." : "Signup!"}
              </button>

            <Link href="/login">Visit login page!</Link>


        </div>
    )
}