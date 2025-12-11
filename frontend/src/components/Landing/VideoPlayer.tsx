"use client";
import { MediaController } from "media-chrome/react";

export interface VideoPlayerProps {
  url: string | undefined;
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
  return (
    <MediaController className="w-[90%] sm:w-[70%] pb-12 bg-transparent pointer-events-none">
      <video
        playsInline
        autoPlay
        loop
        preload="auto"
        muted
        slot="media"
        tabIndex={-1}
        className="mtz-vlc-dkbcc rounded-lg aspect-[829/540] data-[loaded=false]:animate-pulse data-[loaded=false]:bg-primary/10"
        data-loaded={!!url}
        src={url}
      />
    </MediaController>
  );
}
