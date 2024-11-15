"use client"
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";

const NavbarComponent = ({ isLandingPage }: {isLandingPage: boolean}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navItems = [
    { label: "Home", href: "/" },
    { label: "How to Vote", href: "/how-to-vote" },
    { label: "About Us", href: "/about-us" },
  ];

  return (
    <>
    {/* Desktop Navbar */}
    <div className="container py-6 lg:flex items-center justify-between hidden">
      <Link href="/">
        <Image src="/images/logo.png" alt="Logo" width={200} height={200} className=""/>
      </Link>
      <div className="flex justify-center items-center gap-8">
        {navItems.map((item, index) => (
          <Link
            href={item.href}
            key={index}
            className={`font-medium relative group ${!isLandingPage ? "text-white" : ""}`}
          >
            {item.label}
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-current transition-all group-hover:w-full"></span>
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
              className="w-full relative group"
              href={item.href}
            >
              {item.label}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-current transition-all group-hover:w-full"></span>
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