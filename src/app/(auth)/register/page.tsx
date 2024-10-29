import LayoutWithImage from "@/components/LayoutWithImage";
import SignUpForm from "@/components/SignUpForm";

const Register = () => {
  return (
    <LayoutWithImage>
      <div className="flex flex-col lg:flex-row w-screen min-h-screen overflow-y-hidden">
        <div className="w-full lg:w-1/3 flex flex-col container px-8 lg:px-32 py-10 lg:py-0 gap-6 lg:gap-3 whitespace-nowrap items-center justify-center lg:items-start">
          <h1 className="text-white/70 font-medium text-4xl lg:text-5xl font-playfair">
            Registration Form
          </h1>
          <span className="text-white/70 text-xs text-center lg:text-left lg:text-base">
            Register to join the leading decentralized E-voting Platform.<br /> Register your voice where it matters to you!
          </span>
          <SignUpForm />
        </div>
        <div className="hidden lg:block lg:w-2/3 bg-[url('/images/register.svg')] bg-right bg-no-repeat bg-cover lg:z-[9999]"></div>
      </div>
    </LayoutWithImage>
  );
};

export default Register;
