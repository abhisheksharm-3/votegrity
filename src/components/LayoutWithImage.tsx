import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Navbar from "./Navbar";


const LayoutWithImage = ({
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
        "w-screen h-screen flex flex-col font-poppins bg-[url('/images/bg-svg.svg')] bg-cover bg-center bg-no-repeat",
        className
      )}
    >
      <Navbar isLandingPage={false} />
      {children}
    </div>
  );
};

export default LayoutWithImage;
