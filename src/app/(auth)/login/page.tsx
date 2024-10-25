import { FC } from 'react';
import LayoutWithImage from "@/components/LayoutWithImage";
import LoginForm from "@/components/LoginForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const Login: FC = () => {
  return (
    <LayoutWithImage>
      <div className="w-full flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-white/70 font-medium text-3xl sm:text-4xl lg:text-5xl font-playfair text-center mb-8 lg:mb-16">
          Login to Your Account
        </h1>
        <Card className="w-full max-w-4xl bg-white/90">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-playfair text-center">
              Good to see you again!
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-8">
            <LoginForm />
            <div className="flex flex-col sm:flex-row items-center justify-around w-full text-center gap-4 sm:gap-8">
              <Link
                href="/register"
                className="text-[#004600] font-semibold text-sm sm:text-base hover:underline"
              >
                Don&apos;t have an account?
              </Link>
              <Link
                href="/forgot-password"
                className="text-[#004600] font-semibold text-sm sm:text-base hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutWithImage>
  );
};

export default Login;