"use client"
import DashboardSidebar from "@/components/dashboard-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface DashboardProps {
    children: React.ReactNode,
}

export default function DashboardLayout({ children }: DashboardProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [sidebar, setSidebar] = useState<boolean>(true);

    useEffect(() => {
        const fetchSidebar = async () => {
            try {
                const res = await fetch('/api/cookies/sidebar/')
                const { data, error } = await res.json();

                if (error){
                    console.error("ERROR ", error)
                }
                
                console.log("DATA SIDEBAR", data)

                // if (r)
                // const data = await res.json();
                setSidebar(data|| null);
                // const res = await fetch("/api/getUser/")
                // const data = await res.json();
                // setUser(data.data.user || null);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        // Fetching the user data from the API
        const fetchUser = async () => {
            try {
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

        fetchSidebar();
        fetchUser();
    }, []);

    // TODO: Create a READ COOKIES API ENDPOINT FOR SIDEBAR PROVIDER OPEN={} 

    return <div className="flex flex-row">
        <SidebarProvider open={sidebar}>
            <DashboardSidebar user={user} loading={loading} />
            <SidebarTrigger className="-ml-1 mx-2 my-4 px-2" />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    </div>
}