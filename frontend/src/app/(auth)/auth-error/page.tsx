import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LOGIN_PAGE } from "@/constants/Routes";
import { ArrowUpLeftIcon } from "lucide-react";

export default function AuthError() {
  return (
    <div className="flex flex-col items-center py-5 gap-7">
      <div className="flex flex-col items-center gap-3">
        <h1 className="leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
          Auth Error
        </h1>
        <p className="text-muted-foreground">
          An error occured while you tried to sign in. Please try again.
        </p>
      </div>
      <Button asChild size="sm">
        <Link href={LOGIN_PAGE}>
          <ArrowUpLeftIcon />
          Back to Login
        </Link>
      </Button>
    </div>
  );
}
