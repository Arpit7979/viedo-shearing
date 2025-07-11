"use client";

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Loading from '../components/Loading';

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(2, "Password must be at least 2 characters long"),
})



const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

   async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false
        })
        if(result?.error){
          console.error("Login failed: " + result.error);
          setError(result.error);
        }else{
          router.push("/");
        }
        setLoading(false);
   }

  return (
  

    <div className='md:h-screen h-[80vh]  w-full flex items-center justify-center'>
      <div className='bg-gray-200 md:p-5 p-3 rounded-lg shadow-lg md:w-[30%] w-[90%]'>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && <p className='text-red-500 text-center bg-red-100 py-1 rounded-md'>{error}</p>}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field}  className='border border-gray-400' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' {...field} className='border border-gray-400' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit" className='w-full'>{loading ? <Loading/> : "Login"}</Button>
      </form>
        <p className='text-center text-sm'> Don't have an account? <a href="/register" className='text-blue-600'>Register</a></p>
     </Form>
      </div>
    </div>
  )
}

export default LoginPage