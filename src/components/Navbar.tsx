import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";

const Navbar = ({ isLandingPage }: {isLandingPage: boolean}) => {
  const navItems = [
    { label: "How to Vote", href: "/how-to-vote" },
    { label: "About Us", href: "/about-us" },
  ];

  return (
    <div className="container py-6 flex items-center justify-between">
      <Link href="/">
        <Image src="/images/logo.png" alt="Logo" width={200} height={200} />
      </Link>
      <div className="flex justify-center items-center gap-8">
        {navItems.map((item, index) => (
          <Link
            href={item.href}
            key={index}
            className={`font-medium hover:-translate-y-2 ease-in-out duration-400 ${!isLandingPage ? "text-white" : ""}`}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/login">
          <Button className="bg-[#94c358] rounded-md text-white font-bold tracking-wide" variant="shadow">
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  isLandingPage: PropTypes.bool,
};

export default Navbar;
