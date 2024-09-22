"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { LayoutDashboard, Star } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation"; // Added useRouter for better navigation control

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const OrgSidebar = () => {
  const searchParams = useSearchParams();
  const router = useRouter(); // Added useRouter for navigation control

  // Get 'favorites' param from URL
  const favorites = searchParams.get("favorites");

  // Handle navigation for Team Boards and Favorites
  const handleNavigation = (path: string, isFavorites: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (isFavorites) {
      params.set("favorites", "true"); // Add or update the 'favorites' parameter
    } else {
      params.delete("favorites"); // Remove the 'favorites' parameter if not needed
    }

    // Navigate to the appropriate URL with updated query params
    router.push(`${path}?${params.toString()}`);
  };

  return (
    <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
      <Link href="/">
        <div className="flex items-center gap-x-2">
          <Image src="/logo.png" alt="logo" height={40} width={40} />
          <span
            style={{ font: "1.5rem Trebuchet MS, sans-serif" }}
            className={cn(font.className)}
          >
            Fusion
          </span>
        </div>
      </Link>

      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            },
            organizationSwitcherTrigger: {
              padding: "6px",
              borderRadius: "8px",
              width: "100%",
              border: "1px solid #E5E7EB",
              justifyContent: "space-between",
              backgroundColor: "white",
            },
          },
        }}
      />

      <div className="space-y-1 w-full">
        <Button
          size="lg"
          variant={!favorites ? "primary" : "ghost"} // Adjust button variant based on 'favorites' state
          className="font-normal justify-start px-2 w-full"
          onClick={() => handleNavigation("/", false)} // Team Boards click
        >
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Team Boards
        </Button>

        <Button
          size="lg"
          variant={favorites ? "primary" : "ghost"} // Adjust button variant based on 'favorites' state
          className="font-normal justify-start px-2 w-full"
          onClick={() => handleNavigation("/", true)} // Favorites Boards click
        >
          <Star className="h-4 w-4 mr-2" />
          Favorites Boards
        </Button>
      </div>
    </div>
  );
};
