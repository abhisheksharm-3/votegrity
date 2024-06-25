import { CiLock } from "react-icons/ci";
import { FaFileCircleCheck, FaClock } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="bg-[url('/images/footer.svg')] h-40 relative bg-cover bg-no-repeat bg-center hidden lg:block">
      <div className="flex gap-8 text-[#707070] font-semibold text-xl items-center h-full container">
        <div className="flex gap-3 items-center"><FaFileCircleCheck className="text-white text-6xl" /> Verifiable<br /> Transactions</div>
        <div className="flex gap-3 items-center"><CiLock className="text-white text-6xl" />Secured by 256 bit<br /> Encryption</div>{" "}
        <div className="flex gap-3 items-center"><FaClock className="text-white text-6xl" />Faster Voting<br /> Process</div>
      </div>
    </div>
  );
};

export default Footer;
