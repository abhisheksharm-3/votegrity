"use client"
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";

const NavbarComponent = ({ isLandingPage }: {isLandingPage: boolean}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navItems = [
    { label: "How to Vote", href: "/how-to-vote" },
    { label: "About Us", href: "/about-us" },
  ];

  return (
    <>
    {/* Desktop Navbar */}
    <div className="container py-6 lg:flex items-center justify-between hidden">
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
    {/* Mobile Navbar */}
    <Navbar onMenuOpenChange={setIsMenuOpen} className="lg:hidden z-50">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
        <Link href="/">
        <Image src="/images/logo.png" alt="Logo" width={200} height={200} />
      </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
        <Link href="/login">
          <Button className="bg-[#94c358] rounded-md text-white font-bold tracking-wide" variant="shadow">
            Login
          </Button>
        </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {navItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              href={item.href}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
    </>
  );
};

NavbarComponent.propTypes = {
  isLandingPage: PropTypes.bool,
};

export default NavbarComponent;
