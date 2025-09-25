"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CPLogo from "../../public/images/cp_logo_colored.png";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="flex items-center gap-4">
        <Image
          src={CPLogo}
          alt="Company Logo"
          width={80}
          height={80}
          priority
        />
        <h1 className="text-4xl font-bold text-gray-800">Helpdesk</h1>
      </div>
      <p className="mt-4 text-gray-500 animate-pulse">
        Redirecting to your dashboard...
      </p>
    </main>
  );
}
