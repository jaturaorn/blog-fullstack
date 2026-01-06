"use client";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { token } = useAuthStore();

  const router = useRouter();

  const publishPost = async () => {
    if (!title || !content) return alert("Please fill in all fields");

    try {
      await api.post(
        "/posts",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Post Published!");
      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // ตอนนี้เราสามารถเข้าถึง err.response ได้อย่างปลอดภัย
        const errorMessage =
          error.response?.data?.error || "Registration Failed";
        alert(errorMessage);
      } else {
        // กรณีเป็น Error อื่นๆ ที่ไม่ใช่จาก API (เช่นเน็ตหลุด)
        console.error(error);
        alert("An unexpected error occurred");
      }
    }
  };
  return (
    <div className="w-full px-8 py-16 flex justify-center">
      <div className="max-w-lg w-full flex flex-col gap-4 items-center">
        <h1 className=" text-6xl font-bold">createpost</h1>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="add Title"
          className="w-full px-5 py-2.5 bg-[#F8FAFC] rounded-xl outline-none placeholder:text-[#64686C] text-[#282E43] border border-gray-200"
        />
        <textarea
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-5 py-2.5 bg-[#F8FAFC] rounded-xl outline-none placeholder:text-[#64686C] text-[#282E43] border border-gray-200"
          placeholder="What's on your mind?"
        ></textarea>
        <button
          className="btn-gradient-highlight_medium w-full"
          onClick={publishPost}
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default CreatePage;
