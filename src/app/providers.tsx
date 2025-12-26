"use client";
/**
 * Application providers wrapper
 */

import { NextUIProvider } from "@nextui-org/react";
import { QueryProvider } from "@/providers/QueryProvider";
import type { ReactNode } from "react";

type ProvidersPropsType = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersPropsType) {
  return (
    <QueryProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </QueryProvider>
  );
}
