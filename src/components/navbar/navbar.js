'use client'

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react"
import Link from 'next/link'
import Image from 'next/image'
import SignInButton from "../buttons/signInButton"
import SubmitButton from '../buttons/submitButton'
import GetUserCredentials from '../../app/helpers/credentials';

export default function Navbar() {
    const [userInfo, setUserInfo] = useState(null);
    const { data: session, status } = useSession();

    useEffect(() => {
        async function fetchItems() {
            if (session && session.user) {
                const user = await GetUserCredentials(session.user.email);
                setUserInfo(user);
            }
        }
    
        fetchItems();
    }, [session])

    const handleCreateOrder = async () => {
        try {
            if (userInfo) {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        barista_id: userInfo.id,
                    })
                });
    
                if (!response.ok) {
                    throw new Error('Failed to create order');
                }

                const responseData = await response.json();
                const orderID = responseData.id
                // Redirect to the specific order page using the orderID
                window.location.href = `/orders/${orderID}`;
            }
        } catch (error) {
            // Handle error
            console.error('Error creating order:', error.message);
        }
    };

    return(
    <nav className='flex flex-row items-center align-middle justify-between w-full h-30 font-bold py-4 px-8 border-b-2 shadow-sm'>
        <div className='flex align-middle items-center basis-1/4 justify-start'>
            <Image className='max-w-10 max-h-10 mr-2'
                    src='/MightyBean Logo.svg'
                    key= '1'
                    alt='Logo' 
                    width={100} 
                    height={100}
                    />
            <Link className='align-middle font-extrabold font-[#43766C] items-center' href={"/"}>MightyBean</Link>
        </div>
        <div className='flex basis-2/4 justify-around align-middle items-center pl-10'>
            <SubmitButton 
                text="Create Order" 
                onClick={handleCreateOrder}
                css="bg-[#43766C] text-white text-md rounded-full px-4 py-1"
             />
            <Link className='align-middle items-center' href={"/orders"}>Orders</Link>
            <Link className='align-middle items-center' href={"/menu"}>Menu</Link>
            {/* <Link className='align-middle items-center' href={"/reports"}>Reports</Link> */}
            <SignInButton/>
        </div>
    </nav>
    )
};