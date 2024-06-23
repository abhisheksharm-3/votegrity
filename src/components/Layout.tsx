import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Navbar from "./Navbar";


const Layout = ({
  className,
  children,
  active,
}: {
  className?: string;
  children: ReactNode;
  active?: string;
}) => {
  return (
    <div
      className={cn(
        "min-h-screen w-screen flex flex-col justify-between font-poppins bg-main",
        className
      )}
    >
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
