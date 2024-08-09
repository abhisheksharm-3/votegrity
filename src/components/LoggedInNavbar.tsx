"use client"
import { getLoggedInUser } from "@/lib/server/appwrite";
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface User {
    name: string;
    $id: string;
    avatar?: string;
}

interface LoggedInNavbarProps {
    isLandingPage: boolean;
}

const LoggedInNavbar: React.FC<LoggedInNavbarProps> = ({ isLandingPage }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const navItems = [
        { label: "Home", href: "/user/home" },
        { label: "How to Vote", href: "/how-to-vote" },
        { label: "About Us", href: "/about-us" },
    ];

    useEffect(() => {
        async function fetchUserData() {
            try {
                const loggedInUser = await getLoggedInUser();
                setUser(loggedInUser);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                // Handle error (e.g., redirect to login page)
            }
        }
        fetchUserData();
    }, []);

    if (!user) {
        return null; // or a loading spinner
    }

    return (
        <>
            {/* Desktop Navbar */}
            <div className="container py-6 lg:flex items-center justify-between hidden">
                <Link href="/dashboard">
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
                    <Dropdown>
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                color="success"
                                name={user.name}
                                size="sm"
                                src={user.avatar}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="User Actions" variant="flat">
                            <DropdownItem key="profile" href="/profile">My Profile</DropdownItem>
                            <DropdownItem key="settings" href="/settings">Settings</DropdownItem>
                            <DropdownItem key="logout" color="danger" href="/api/logout">
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
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
                        <Link href="/dashboard">
                            <Image src="/images/logo.png" alt="Logo" width={200} height={200} />
                        </Link>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Dropdown>
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform"
                                    color="success"
                                    name={user.name}
                                    size="sm"
                                    src={user.avatar}
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="User Actions" variant="flat">
                                <DropdownItem key="profile" href="/profile">My Profile</DropdownItem>
                                <DropdownItem key="settings" href="/settings">Settings</DropdownItem>
                                <DropdownItem key="logout" color="danger" href="/api/logout">
                                    Log Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
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

export default LoggedInNavbar;