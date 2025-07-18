"use client"
import DashboardSidebar from "@/components/DashboardSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

interface DashboardProps {
    children: React.ReactNode,
}

export default function DashboardLayout({ children }: DashboardProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [sidebar, setSidebar] = useState<boolean>();

    useEffect(() => {
        // Fetching the user data from the API
        const fetchUser = async () => {
            try {
                const sidebarRes = await fetch('/api/cookies/sidebar')
                const { data: sidebarData, error: sidebarError } = await sidebarRes.json();
                
                if (sidebarError){
                    console.log(sidebarError.message)
                    return;
                }

                console.log("SIDEBAR DATA: ", sidebarData)
                setSidebar(false as boolean) //TODO: SET SIDEBAR DOES NOT WORK

                const res = await fetch('/api/cookies/user/')
                const { data, error } = await res.json();

                if (error){
                    console.error("ERROR ", error)
                }
                
                if (!data){ //Fetch data for first time
                    const res = await fetch("/api/getUser/")
                    const metadata = await res.json();

                    // GET Request
                    const payload = {
                        value: JSON.stringify(metadata.data.user)
                    }

                    const metaResponse = await fetch('/api/cookies/user/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });

                    const response = await metaResponse.json();

                    console.log(response.message)

                    if (error) {
                        console.error("Error fetching term:", error);
                        return;
                    }

                    console.log("METADATA: ", metadata.data.user)

                    setUser(metadata.data.user || null);
                } else {
                    console.log("DATA EXISTS PULL DATA", data)
                }
                

                // if (r)
                // const data = await res.json();
                const formatted_metadata = JSON.parse(data)
                console.log("COOKIES ", formatted_metadata)
                setUser(formatted_metadata|| null);
                // const res = await fetch("/api/getUser/")
                // const data = await res.json();
                // setUser(data.data.user || null);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // TODO: Create a READ COOKIES API ENDPOINT FOR SIDEBAR PROVIDER OPEN={} 
    return <div className="flex flex-row overflow-x-hidden">
        <SidebarProvider defaultOpen={sidebar}>
            <DashboardSidebar user={user} loading={loading} />
            {/* <SidebarTrigger className="-ml-1 mx-2 my-4 px-2" /> */}
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    </div>
}
