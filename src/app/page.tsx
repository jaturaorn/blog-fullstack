"use client";

import api from "@/lib/axios";
import Cookies from "js-cookie";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAuth } = useAuthStore()!;

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const res = await api.post("/login", { email, password });
      const { user, token } = res.data;
      setAuth(user, token);
      // 🚩 Keep the JWT keys here.
      Cookies.set("auth-token", token, { expires: 1, path: "/" });

      alert("Login Success!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col gap-4 items-center">
        <h1 className=" text-3xl font-bold">Login</h1>
        <input
          type="text"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-5 py-2.5 bg-[#F8FAFC] rounded-full outline-none placeholder:text-[#64686C] text-[#282E43]"
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-5 py-2.5 bg-[#F8FAFC] rounded-full outline-none placeholder:text-[#64686C] text-[#282E43]"
        />
        <button
          className="btn-gradient-highlight_medium"
          onClick={handleSubmit}
        >
          Login
        </button>
      </div>
    </div>
  );
}
