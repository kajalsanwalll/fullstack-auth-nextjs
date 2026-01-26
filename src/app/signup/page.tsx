"use client";
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Axios } from 'axios';


export default function SignupPage (){
    const [user, setUser] = React.useState({  //grabbing user info
        email: "",
        password: "",
        username: ""
    })

    const onSignup = async () => {    // after signup

    }
    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Sign up</h1>
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
            className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'
            >Submit!</button>
            <Link href="/login">Visit login page!</Link>


        </div>
    )
}