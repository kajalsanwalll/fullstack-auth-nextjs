"use client";
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Axios } from 'axios';


export default function LoginPage (){
    const [user, setUser] = React.useState({  //grabbing user info
        email: "",
        password: "",
       
    })

    const onLogin = async () => {    // after signup

    }
    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Login</h1>
            <hr></hr>
            

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
            onClick={onLogin}
            className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'
            >Submit!</button>
            <Link href="/signup">Visit Signup page!</Link>


        </div>
    )
}