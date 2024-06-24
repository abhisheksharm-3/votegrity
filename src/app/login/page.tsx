import LayoutWithImage from "@/components/LayoutWithImage";
import LoginForm from "@/components/LoginForm";
import { Button } from "@nextui-org/react";
import Link from "next/link";

const Login = () => {
  return (
    <LayoutWithImage>
      <div className="w-screen flex flex-row container items-center justify-center h-full">
        <div className="w-11/12 flex flex-col gap-8 justify-center">
          <h1 className="text-white/70 font-medium text-5xl font-playfair">
            Login to Your Account
          </h1>
          <div className="w-8/12 flex items-center justify-center">
            <div className="bg-white/90 rounded-2xl w-max px-32 py-10 flex flex-col items-center justify-center gap-8">
              <h1 className="font-semibold font-playfair text-4xl">
                Good to see you again!
              </h1>
              <LoginForm />
              <Link
                href="/register"
                className="text-[#004600] font-semibold text-base"
              >
                Don&apos;t have an account?
              </Link>
            </div>
          </div>
        </div>
        <div className=" flex flex-col items-center justify-center w-2/12 2xl:w-1/12  whitespace-nowrap gap-5">
          <h1 className="text-white/70 text-4xl tracking-wider">New Here?</h1>
          <span className="text-center text-white/70 text-sm">
            Become a member and <br /> voice your opinion!
          </span>
          <Button className="rounded-full bg-[#94C358] px-9 py-1 text-white font-semibold">
            Sign Up
          </Button>
        </div>
      </div>
    </LayoutWithImage>
  );
};

export default Login;