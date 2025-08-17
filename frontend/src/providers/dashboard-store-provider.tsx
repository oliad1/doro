"use client"
import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type DashboardStore,
  createDashboardStore,
  initDashboardStore,
} from "@/stores/dashboard-store";

export type DashboardStoreApi = ReturnType<typeof createDashboardStore>;

export const DashboardStoreContext = createContext<DashboardStoreApi | undefined>(
  undefined
);

export interface DashboardStoreProviderProps {
  children: ReactNode
}

export const DashboardStoreProvider = ({
  children
}: DashboardStoreProviderProps) => {
  const storeRef = useRef<DashboardStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createDashboardStore(initDashboardStore());
  }

  return (
    <DashboardStoreContext.Provider value={storeRef.current}>
      {children}
    </DashboardStoreContext.Provider>
  )
}

export const useDashboardStore = <T,>(
  selector: (store: DashboardStore) => T,
): T => {
  const counterStoreContext = useContext(DashboardStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useDashboardStore must be used within DashboardStoreProvider`);
  }

  return useStore(counterStoreContext, selector)
}
