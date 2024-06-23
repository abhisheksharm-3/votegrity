import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const navItems = [
    { label: "How to Vote", href: "/how-to-vote" },
    { label: "About Us", href: "/about-us" },
  ];

  return (
    <div className="container py-6 flex  item-center justify-between">
      <Image src="/images/logo.png" alt="Logo" width={200} height={200} />
      <div className="flex justify-center items-center gap-8">
        {navItems.map((item, index) => (
          <Link href={item.href} key={index} className="font-medium hover:-translate-y-2 ease-in-out duration-400">
            {item.label}
          </Link>
        ))}
        <Button className="bg-[#94c358] rounded-md text-white font-bold tracking-wide" variant="shadow">Login</Button>
      </div>
    </div>
  );
};

export default Navbar;
