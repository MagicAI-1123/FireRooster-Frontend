"use client";
import MobileNavMenu from "@/components/mobile-nav-menu";
import Navmenu from "@/components/navmenu";
import { usePathname, useRouter } from "next/navigation";
import { detectOS, getLocation, detectBrowser, detectDevice } from "@/components/userlist/detectDevice";
import { useEffect } from "react";
import { userlistService } from "@/services/userlist";
import { useAppSelector } from "@/hooks/store.hooks";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = usePathname();
  const user = useAppSelector(state => state.auth?.user);
  // console.log(router);

  console.log("-----------------------")
  useEffect(() => {
    // Detect device type
    const device = detectDevice(navigator);

    // Detect browser
    const browser = detectBrowser(navigator);

    // Detect OS
    const os = detectOS(navigator);

    const insertUserStatus = async () => {
      const location = await getLocation();      
      userlistService.insertUserStatus({
        "email": user?.email,
        "full_name": user?.first_name + " " + user?.last_name,
        "device": device,
        "browser": browser,
        "os": os,
        "city": location?.city,
        "country": location?.country,
        "region": location?.region,
        "ipaddress": location?.query,
        "countryCode": location?.countryCode
      })
        .then(response => response.data)
        .then(result => {
          console.log(result);
        })
    };

    insertUserStatus();
  }, [user]);

  return (
    <div className="flex-none lg:flex h-screen lg:flex-1">
      <MobileNavMenu />
      <Navmenu />
      <div className="flex flex-1 p-8 overflow-hidden justify-center">
        <div className="max-w-screen-2xl flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
