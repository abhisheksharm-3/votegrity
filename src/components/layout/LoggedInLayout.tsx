import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import LoggedInNavbar from "./LoggedInNavbar";

const LoggedInLayout = ({
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
        "w-full min-h-screen flex flex-col font-poppins bg-[#004600] overflow-y-auto relative",
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-800 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-green-800 rounded-full opacity-20 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-green-800 rounded-full opacity-25 translate-y-1/2"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-green-800 rounded-full opacity-15"></div>
      </div>
      <LoggedInNavbar isLandingPage={false} />
      <div className="flex-grow relative z-10">
        {children}
      </div>
    </div>
  );
};

export default LoggedInLayout;