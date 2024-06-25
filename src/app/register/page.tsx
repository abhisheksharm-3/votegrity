import LayoutWithImage from "@/components/LayoutWithImage";
import SignUpForm from "@/components/SignUpForm";

const Register = () => {
  return (
    <LayoutWithImage>
      <div className="flex w-screen h-screen">
        <div className="w-1/3 flex flex-col container pl-32 gap-10 whitespace-nowrap">
          <h1 className="text-white/70 font-medium text-5xl font-playfair">
            Registration Form
          </h1>
          <span className=" text-white/70 text-base">
          Register to join the leading decentralized E-voting Platform.<br /> Register your voice where it matters to you!
          </span>
          <SignUpForm />
        </div>
        <div className="w-2/3 bg-[url('/images/register.svg')] bg-right bg-no-repeat bg-contain bg z-[9999]"></div>
      </div>
    </LayoutWithImage>
  );
};

export default Register;
