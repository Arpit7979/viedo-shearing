"use client";

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {useSession, signOut } from 'next-auth/react';

const Header = () => {
  const isAuthenticated = !!useSession().data?.user;
  const router = useRouter();
  return (
    <nav className='bg-slate-800 text-white flex items-center md:justify-around justify-between md:p-4 p-3 h-[4rem] sticky top-0 z-50'>
      <h1 onClick={()=>router.push("/")} className='cursor-pointer font-bold md:text-2xl text-lg'>Video With AI</h1>
      
       <DropdownMenu >
         <DropdownMenuTrigger>
          <div className="cursor-pointer">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' sideOffset={8}>
            
            {isAuthenticated ? (
              <>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/upload-video")} className='cursor-pointer'>Upload Video</DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}><Button className='w-full cursor-pointer text-red-500' variant={'outline'}>Logout</Button></DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={() => router.push("/login")} className='cursor-pointer'>Login</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
    </nav>
  )
}

export default Header