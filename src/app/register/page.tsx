"use client";

import api from "@/lib/axios";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/register", { name, email, password });
      alert("Registration Successful! Please login.");
      router.push("/");
    } catch (err) {
      // 2. ตรวจสอบว่า err เป็น Axios Error หรือไม่
      if (axios.isAxiosError(err)) {
        // ตอนนี้เราสามารถเข้าถึง err.response ได้อย่างปลอดภัย
        const errorMessage = err.response?.data?.error || "Registration Failed";
        alert(errorMessage);
      } else {
        // กรณีเป็น Error อื่นๆ ที่ไม่ใช่จาก API (เช่นเน็ตหลุด)
        console.error(err);
        alert("An unexpected error occurred");
      }
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-4 items-center w-full max-w-sm"
      >
        <h1 className="text-3xl font-bold mb-4">Create Account</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-5 py-2.5 bg-[#F8FAFC] rounded-full outline-none placeholder:text-[#64686C] text-[#282E43] border border-gray-200"
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-5 py-2.5 bg-[#F8FAFC] rounded-full outline-none placeholder:text-[#64686C] text-[#282E43] border border-gray-200"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-5 py-2.5 bg-[#F8FAFC] rounded-full outline-none placeholder:text-[#64686C] text-[#282E43] border border-gray-200"
        />

        <button type="submit" className="btn-gradient-highlight_medium w-full">
          Sign Up
        </button>

        <p className="text-sm text-gray-500 mt-2">
          Already have an account?{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
