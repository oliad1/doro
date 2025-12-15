"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, ArrowUpRightIcon, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GITHUB_PAGE, HOME_PAGE } from "@/constants/Routes";
import { PROF_PROFILE } from "@/constants/CourseConstants";
import { getInitials } from "@/utils/helpers";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/Landing/page-header";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, animate, useMotionValue } from "motion/react";
import { useWindowSize } from "@react-hook/window-size";
import VideoPlayer from "@/components/Landing/VideoPlayer";
import ObjectsAPIClient from "@/APIClients/ObjectsAPIClient";
import CookiesAPIClient from "@/APIClients/CookiesAPIClient";
import NavBar from "@/components/Landing/NavBar";
import { QUOTES } from "@/constants/LandingConstants";

export default function Page() {
  const [url, setUrl] = useState<string>();
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const [marqueeWidth, setMarqueeWidth] = useState(0);
  const x = useMotionValue(0);
  const [windowWidth] = useWindowSize();
  const [user, setUser] = useState<any>();

  useEffect(() => {
    if (marqueeRef.current) {
      setMarqueeWidth(marqueeRef.current.scrollWidth);
    }
  }, [windowWidth, QUOTES]);

  useEffect(() => {
    if (!marqueeWidth) return;
    const controls = animate(x, [0, -marqueeWidth / 2 - 8], {
      ease: "linear",
      duration: marqueeWidth / 100,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 0,
    });
    return controls.stop;
  }, [x, marqueeWidth]);

  useEffect(() => {
    const fetchUrl = async () => {
      const s3Url = await ObjectsAPIClient.getUrl("demo_video");
      setUrl(s3Url);
    };

    const fetchUser = async () => {
      const userMetadata = await CookiesAPIClient.getUser();
      console.log(JSON.parse(userMetadata));
      setUser(JSON.parse(userMetadata));
    };

    fetchUrl();
    fetchUser();
  }, []);

  return (
    <>
      <NavBar />
      <div className="flex flex-1 flex-col items-center w-full overflow-x-hidden">
        <PageHeader className="h-[-webkit-fill-content]">
          <Badge asChild variant="secondary" className="rounded-full">
            <Link href={HOME_PAGE}>
              New Fall '25 Courses <ArrowUpRightIcon />
            </Link>
          </Badge>
          <PageHeaderHeading className="max-w-4xl">
            Your last grade tracker
          </PageHeaderHeading>
          <PageHeaderDescription className="text-center py-2 sm:py-0 mx-3 max-w-4xl">
            A{" "}
            <Button className="inline-flex align-middle mx-2 bg-white border-2 h-[20px] py-4">
              <Image
                className="h-[24px] w-auto select-none"
                src="/waterloo_logo.png"
                alt="Waterloo Logo"
                width={100}
                height={100}
              />
            </Button>
            tailored grade tracker with over 1700 courses with weights, dates,
            profs, and more.
          </PageHeaderDescription>
          <PageActions>
            <Link href={HOME_PAGE}>
              <Button asChild className="py-1 gap-1">
                {user ? (
                  <div className="flex flex-col items-start h-full gap-0 px-0">
                    <p className="text-[10px]">Continue as</p>
                    <div className="flex flex-row gap-1 items-center justify-center">
                      <Avatar className="size-6 rounded-full">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="rounded-lg"></AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left leading-tight">
                        <span className="truncate font-semibold">
                          {user?.user_metadata?.full_name}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>Get Started</p>
                )}
                {/*<p>{JSON.stringify(user)}</p>*/}
              </Button>
            </Link>
            <a target="_blank" href={GITHUB_PAGE}>
              <Button asChild variant="ghost">
                <div>
                  <Github />
                  Star us on Github
                </div>
              </Button>
            </a>
          </PageActions>
        </PageHeader>
        <VideoPlayer url={url} />
        <div className="w-[100vw] flex flex-row gap-2 overflow-hidden pb-12">
          <motion.div
            className="flex flex-row gap-2 left-0 h-min"
            ref={marqueeRef}
            style={{ x }}
          >
            {[...QUOTES, ...QUOTES].map((testimony, i) => (
              <Card
                className="min-w-[80vw] md:min-w-[50vw] lg:min-w-[20vw] px-4 flex flex-col justify-between"
                key={i}
              >
                <p className="text-muted-foreground">"{testimony.quote}"</p>
                <div
                  key={i}
                  className="flex items-center gap-2 px-1 text-left text-sm"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage
                      draggable={false}
                      src={PROF_PROFILE}
                      alt="personnel image"
                    />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(testimony.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {testimony.author}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {testimony.desc}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
