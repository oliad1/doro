"use client";
import { CreateCourseStoreProvider } from "@/providers/create-course-store-provider";

interface CreateProps {
  children: React.ReactNode;
}

export default function CreateLayout({ children }: CreateProps) {
  return <CreateCourseStoreProvider>{children}</CreateCourseStoreProvider>;
}
