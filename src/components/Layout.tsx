import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import NavbarComponent from "./Navbar";

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
        "min-h-screen w-screen flex flex-col justify-between font-poppins",
        className
      )}
    >
      
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-emerald-50" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_70%)]" />
      <NavbarComponent isLandingPage={true} />
      {children}
    </div>
  );
};

export default Layout;
