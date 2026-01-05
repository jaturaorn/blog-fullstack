"use client";

import Cookies from "js-cookie";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const { user, logout } = useAuthStore()!;

  const router = useRouter();

  const handleLogout = () => {
    logout();
    Cookies.remove("auth-token");
    router.push("/");
  };
  return (
    <div>
      <h1 className="text-6xl font-bold">Welcome,{user?.name}</h1>{" "}
      <button className="btn-gradient-highlight_medium" onClick={handleLogout}>
        logout
      </button>
    </div>
  );
};

export default DashboardPage;
