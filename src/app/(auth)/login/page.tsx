"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { TrendingUp, Loader2, Router } from "lucide-react";
import { useTransition } from "react";
import { Provider } from "@supabase/supabase-js";
import { loginAction } from "@/actions/users";
import { toast } from "@/hooks/use-toast";

export default function LogIn(){
    const [isPending, startTransition] = useTransition();

    const handleLoading = (provider: Provider) => {
        startTransition(async () => {
            const {errorMessage, url} = await loginAction(provider);
            if (!errorMessage && url){
                window.location.href = url;
            } else {
                toast({
                    title: "Auth Error",
                    description: errorMessage,
                });
            }
        });
    }

    return (
        <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="lg:flex flex-col justify-between hidden h-full bg-muted p-10">
                <div className="flex items-center gap-x-3">
                    <TrendingUp />
                    <h3 className="scroll-m-20 text-2xl font-medium tracking-tight">
                        Doro Study
                    </h3>
                </div>
                <div className="relative mt-auto">
                    <blockquote className="space-y-1">
                        <p className="text-lg text-muted-foreground italic">
                            "This is, by far, the best grade tracker for Waterloo students I've ever used"
                        </p>
                        <footer className="text-sm">
                            Oliad Rundassa
                        </footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h3 className="text-3xl font-semibold tracking-tight">
                            Create an account
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Click the link below to create your account
                        </p>
                        <div className="pt-3">
                            <Button variant={"outline"} onClick={()=>handleLoading('google')} disabled={isPending}> 
                                {!isPending?
                                <>
                                    <FcGoogle />
                                    Sign in with Google
                                </>
                                : <Loader2 className="animate-spin"/>}
                            </Button>
                        </div>
                    </div>
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By clicking continue, you agree to our{" "}
                        <Link
                            href="/terms"
                            className="hover:text-brand underline underline-offset-4"
                        > 
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="hover:text-brand underline underline-offset-4"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}