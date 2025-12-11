"use client";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type CreateCourseStore,
  createCreateCourseStore,
  initCreateCourseStore,
} from "@/stores/create-course-store";

export type CreateCourseStoreApi = ReturnType<typeof createCreateCourseStore>;

export const CreateCourseStoreContext = createContext<
  CreateCourseStoreApi | undefined
>(undefined);

export interface CreateCourseStoreProviderProps {
  children: ReactNode;
}

export const CreateCourseStoreProvider = ({
  children,
}: CreateCourseStoreProviderProps) => {
  const storeRef = useRef<CreateCourseStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createCreateCourseStore(initCreateCourseStore());
  }

  return (
    <CreateCourseStoreContext.Provider value={storeRef.current}>
      {children}
    </CreateCourseStoreContext.Provider>
  );
};

export const useCreateCourseStore = <T,>(
  selector: (store: CreateCourseStore) => T,
): T => {
  const counterStoreContext = useContext(CreateCourseStoreContext);

  if (!counterStoreContext) {
    throw new Error(
      `useCreateCourseStore must be used within CreateCourseStoreProvider`,
    );
  }

  return useStore(counterStoreContext, selector);
};
