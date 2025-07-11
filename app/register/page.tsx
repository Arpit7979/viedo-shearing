"use client";
import { useRouter } from "next/navigation";
import { useState } from "react"
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
import { set } from "mongoose";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(2, "Password must be at least 2 characters long"),
  confirmPassword: z.string().min(2, "Confirm Password must be at least 2 characters long"),
})

const RegisterPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: "",
        confirmPassword: "",
      },
    })
  
     async function onSubmit(values: z.infer<typeof formSchema>) {
          if(values.password !== values.confirmPassword){
          alert("Passwords do not match");
          return;
        }

        try {
          setLoading(true);
          const res = await fetch("/api/auth/register",{
            method: "POST",
            headers:{
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password
            })
      })

        const data = await res.json();
        if(!res.ok){
          throw new Error( data.error || "Registration failed" );
          setError(data.error || "Registration failed");
        }

        console.log("Registration successful:", data);
        router.push("/login");
        } catch (error) {
          console.error("Registration failed:", error);
          alert("Registration failed. Please try again.");
        } finally {
          setLoading(false);
        }
         
}

  
  return (
    // <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-500">
    //   <h1 className="text-3xl font-bold mb-5">Register</h1>
    //   <form onSubmit={handleSubmit} className="bg-slate-800 p-5 rounded-md shadow-md text-white">
    //     <div>
    //       <label>Email:</label>
    //       <input
    //         className="bg-slate-200 rounded-md p-2 w-full text-black outline-none"
    //         type="email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <div>
    //       <label>Password:</label>
    //       <input
    //         className="bg-slate-200 rounded-md p-2 w-full text-black outline-none"
    //         type="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <div>
    //       <label>Confirm Password:</label>
    //       <input
    //         className="bg-slate-200 rounded-md p-2 w-full text-black outline-none"
    //         type="password"
    //         value={confirmPassword}
    //         onChange={(e) => setConfirmPassword(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <button className="w-full p-2 bg-green-700 rounded-lg mt-4" type="submit">{loading?"...loading":"Register"} </button>
    //   </form>
    //   <p className="mt-4 text-base">Already have an account? <a href="/login" className="text-blue-800">Login</a></p>
    // </div>
    <div className='md:h-screen h-[85vh] w-full flex items-center justify-center'>
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type='password' {...field} className='border border-gray-400' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit" className='w-full'>{loading ? <Loading/> : "Register"}</Button>
      </form>
        <p className='text-center text-sm'> Already have an account? <a href="/login" className='text-blue-600'>Login</a></p>
     </Form>
      </div>
    </div>
  )
}

export default RegisterPage