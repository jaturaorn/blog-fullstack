"use client";

import Cookies from "js-cookie";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import axios from "axios";

interface Post {
  id: string | number;
  title: string;
  content: string;
  author: {
    name: string;
  };
  authorId: string | number;
}

const DashboardPage = () => {
  const [allDataPosts, setAllDataPosts] = useState<Post[]>();

  const { user, logout, token } = useAuthStore()!;

  const router = useRouter();

  const handleLogout = () => {
    logout();
    Cookies.remove("auth-token");
    router.push("/");
  };

  const editPost = (id: string | number) => {
    router.push(`/dashboard/edit/${id}`);
  };

  const deletePost = async (id: string | number) => {
    // if (!confirm("คุณแน่ใจหรือไม่ที่จะลบโพสต์นี้?")) return;

    try {
      await api.delete(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllDataPosts((perv) => perv?.filter((post) => post.id !== id));

      alert("ลบโพสต์สำเร็จ");
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

  useEffect(() => {
    let ignore = false;

    const getPosts = async () => {
      try {
        const res = await api.get("/posts");
        if (!ignore) {
          setAllDataPosts(res.data);
        }
      } catch (error) {
        if (!ignore) console.error("Error:", error);
      }
    };

    getPosts();

    // Cleanup function to prevent setting state on unmounted component
    return () => {
      ignore = true;
    };
  }, []);

  console.log(allDataPosts);

  return (
    <div className="w-full flex flex-col gap-5 px-8 pt-8 pb-32">
      <h1 className="text-6xl font-bold">Welcome,{user?.name}</h1>{" "}
      <div className="flex gap-3">
        <Link
          className="btn-gradient-highlight_small"
          href={"/dashboard/create"}
        >
          CreatePost
        </Link>
        <button
          className="btn-gradient-highlight_medium"
          onClick={handleLogout}
        >
          logout
        </button>
      </div>
      <div className=" grid grid-cols-4 gap-3">
        {allDataPosts?.length !== 0 ? (
          allDataPosts?.map((post) => (
            <div
              key={post.id}
              className="bg-[#e8e8e8] max-w-sm p-6 border border-default rounded-lg shadow-xs hover:bg-neutral-secondary-medium flex flex-col gap-2 items-center"
            >
              <h3 className=" text-2xl text-[#282E43]">{post.author.name}</h3>
              <h4 className=" text-lg text-[#282E43]">{post.title}</h4>
              <h6 className="text-sm text-[#282E43]">{post.content}</h6>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => editPost(post.id)}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <>No posts found</>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
