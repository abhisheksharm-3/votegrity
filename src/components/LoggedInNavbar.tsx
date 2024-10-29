"use client"
import { getLoggedInUser } from "@/lib/server/appwrite";
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
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
    const [isLoading, setIsLoading] = useState(true);
    const navItems = [
        { label: "Home", href: "/user/home" },
        { label: "Create a Proposal", href: "/user/create-proposal" },
        { label: "Vote", href: "/user/vote" },
        { label: "My Elections", href: "/user/manage-elections" },
    ];

    useEffect(() => {
        async function fetchUserData() {
            try {
                const loggedInUser = await getLoggedInUser();
                setUser(loggedInUser);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUserData();
    }, []);

    const NavbarSkeleton = () => (
        <>
            {/* Desktop Skeleton */}
            <div className="container py-6 lg:flex items-center justify-between hidden">
                <Skeleton className="h-12 w-48" />
                <div className="flex justify-center items-center gap-8">
                    {navItems.map((_, index) => (
                        <Skeleton key={index} className="h-4 w-24" />
                    ))}
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>
            
            {/* Mobile Skeleton */}
            <div className="w-full px-4 py-3 flex items-center justify-between lg:hidden">
                <Skeleton className="h-8 w-8" /> {/* Menu toggle */}
                <Skeleton className="h-10 w-32" /> {/* Logo */}
                <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
            </div>
        </>
    );

    if (isLoading) {
        return <NavbarSkeleton />;
    }
    if (!user) {
        return null;
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
                            className={`font-medium relative group ${!isLandingPage ? "text-white" : ""}`}
                        >
                            {item.label}
                            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-current transition-all group-hover:w-full"></span>
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
                            <DropdownItem key="settings" href="/user/settings">Settings</DropdownItem>
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

export default LoggedInNavbar;