"use client";
import { MediaController } from "media-chrome/react";

export default function VideoPlayer () {
  return (
    <MediaController className="hidden sm:block sm:w-[70%] sm:pb-12 bg-transparent">
      <video
	playsInline
	autoPlay
	loop
	preload="auto"
	muted
	slot="media"
	tabIndex={-1}
	className="mtz-vlc-dkbcc sm:rounded-lg"
      >
	<source src="/demo.mp4" type="video/mp4"></source>
      </video>
    </MediaController>
  );
};
