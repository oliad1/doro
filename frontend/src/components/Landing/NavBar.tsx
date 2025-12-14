import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { LOGIN_PAGE, HOME_PAGE } from "@/constants/Routes";

export default function NavBar({}: {}) {
  return (
    <header className="bg-background sticky top-0 z-50 w-full flex justify-between px-5 py-3">
      <div className="flex flex-row gap-4">
        <Link href="/">
          <Button variant="ghost">
            <TrendingUp />
            Doro
          </Button>
        </Link>
        <div className="">
          <Link href="/blog">
            <Button variant="ghost">Blog</Button>
          </Link>
        </div>
      </div>
      <Button asChild size="sm">
        <Link href={HOME_PAGE}>Get Started</Link>
      </Button>
    </header>
  );
}
