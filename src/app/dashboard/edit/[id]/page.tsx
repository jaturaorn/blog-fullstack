"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

interface Post {
  id: string | number;
  title: string;
  content: string;
  author: {
    name: string;
  };
}

const EditPostPage = () => {
  const router = useRouter();
  const params = useParams(); // รับค่า id จาก URL
  const { id } = params;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { token } = useAuthStore();

  // 1. ดึงข้อมูลเดิมของ Post นี้มาแสดงใน Form
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts`); // สมมติว่าดึงทั้งหมดแล้วหา หรือถ้ามี API รายตัวให้ใช้ `/posts/${id}`
        const post = res.data.find((p: Post) => p.id.toString() === id);

        if (post) {
          setTitle(post.title);
          setContent(post.content);
        } else {
          alert("ไม่พบโพสต์นี้");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id, router]);

  // 2. ฟังก์ชันส่งข้อมูลที่แก้ไขแล้วไปยัง Backend
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Updating post ID:", id);

    if (!id) {
      alert("ไม่พบ ID ของโพสต์");
      return;
    }

    try {
      await api.put(
        `/posts/${id}`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("อัปเดตโพสต์สำเร็จ!");
      router.push("/dashboard"); // กลับไปหน้า Dashboard
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // ตอนนี้เราสามารถเข้าถึง err.response ได้อย่างปลอดภัย
        const errorMessage = error.response?.data?.error || "ผิดพลาด";
        alert(errorMessage);
      } else {
        // กรณีเป็น Error อื่นๆ ที่ไม่ใช่จาก API (เช่นเน็ตหลุด)
        console.error(error);
        alert("An unexpected error occurred");
      }
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <div>
          <label className="block mb-2 font-medium">Title</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Content</label>
          <textarea
            rows={5}
            className="w-full p-2 border border-gray-300 rounded-md text-white"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
          >
            Update Post
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostPage;
