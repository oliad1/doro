"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TrendingUp, ArrowUpRightIcon, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LOGIN_PAGE, GITHUB_PAGE } from "@/constants/Routes";
import { PROF_PROFILE } from "@/constants/CourseConstants";
import { getInitials } from "@/utils/helpers";
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/Landing/page-header";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, animate, useMotionValue } from "motion/react";
import { useWindowSize } from '@react-hook/window-size';
import VideoPlayer from "@/components/Landing/VideoPlayer";
import ObjectsAPIClient from "@/APIClients/ObjectsAPIClient";

const quotes = [
  {
    quote: "This is, by far, the best grade tracker for Waterloo students I've ever used.",
    author: "Oliad R",
    desc: "CE '29",
  },
  {
    quote: "If you deployed that right now I would use it ASAP",
    author: "Matias R",
    desc: "CE '29",
  },
  {
    quote: "Knowledge is power. Information is liberating. Education is the premise of progress.",
    author: "Owen C",
    desc: "Mac Student",
  },
  {
    quote: "Assignment tracking has never been so easy!",
    author: "Anonymous",
    desc: "Waterloo Student",
  },
  {
    quote: "This will save my exam anxiety.",
    author: "Anonymous",
    desc: "Waterloo Student",
  }
];

export default function Page() {
  const [url, setUrl] = useState<string>();
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const [marqueeWidth, setMarqueeWidth] = useState(0);
  const x = useMotionValue(0);
  const [windowWidth] = useWindowSize();

  useEffect(() => {
    if (marqueeRef.current) {
      setMarqueeWidth(marqueeRef.current.scrollWidth);
    }
  }, [windowWidth, quotes]);

  useEffect(() => {
    if (!marqueeWidth) return;
    const controls = animate(x, [0, -marqueeWidth / 2 - 8], {
      ease: 'linear',
      duration: marqueeWidth / 100,
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0,
    });
    return controls.stop;
  }, [x, marqueeWidth]);


  useEffect(() => {
    const fetchUrl = async () => {
      const s3Url = await ObjectsAPIClient.getUrl('demo_video');
      setUrl(s3Url);
    };

    fetchUrl();
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center">
      <header className="bg-background sticky top-0 z-50 w-full flex justify-between px-5 pt-3">
	<Button variant="ghost">
	  <TrendingUp/>
	  Doro
	</Button>
	<Button asChild size="sm">
	  <Link href={LOGIN_PAGE}>Get Started</Link>
	</Button>
      </header>
      <PageHeader className="h-[-webkit-fill-content]">
	<Badge asChild variant="secondary" className="rounded-full">
	  <Link href={LOGIN_PAGE}>
	    New Fall '25 Courses <ArrowUpRightIcon /> 
	  </Link>
	</Badge>
	<PageHeaderHeading className="max-w-4xl">Your last grade tracker</PageHeaderHeading>
        <PageHeaderDescription>A waterloo-tailored grade tracker with over 1700 courses with weights, dates, profs, and more.</PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link href={LOGIN_PAGE}>Get Started</Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
	    <div>
	      <Github />
	      <a target="_blank" href={GITHUB_PAGE}>Star us on Github</a>
	    </div>
          </Button>
        </PageActions>
      </PageHeader>
      <VideoPlayer url={url} />
      <div className="w-[100vw] flex flex-row gap-2 overflow-hidden pb-12">
	<motion.div className="flex flex-row gap-2 left-0 h-min" ref={marqueeRef} style={{x}}>
	  {[...quotes, ...quotes].map((testimony, i) => <Card className="min-w-[80vw] md:min-w-[50vw] lg:min-w-[20vw] px-4 flex flex-col justify-between" key={i}>
	    <p className="text-muted-foreground">"{testimony.quote}"</p>
	    <div key={i} className="flex items-center gap-2 px-1 text-left text-sm">
	      <Avatar className="size-8 rounded-lg">
		<AvatarImage
		  draggable={false}
		  src={PROF_PROFILE}
		  alt="personnel image"/>
		<AvatarFallback className="rounded-lg">{getInitials(testimony.author)}</AvatarFallback>
	      </Avatar>
	      <div className="grid flex-1 text-left text-sm leading-tight">
		<span className="truncate font-medium">{testimony.author}</span>
		<span className="text-muted-foreground truncate text-xs">
		  {testimony.desc}
		</span>
	      </div>
	    </div>
	  </Card>
	  )}
	</motion.div>
      </div>
    </div>
  );
};
