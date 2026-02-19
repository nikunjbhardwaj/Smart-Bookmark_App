"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);



  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setBookmarks(data || []);
    }
  };

  useEffect(() => {
    let channel: any;

    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      setUser(user);
      await fetchBookmarks();

      channel = supabase
        .channel("bookmarks-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
          },
          () => {
            fetchBookmarks();
          }
        )
        .subscribe();
    };

    setup();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [router]);


  const handleAddBookmark = async () => {
    if (!title || !url || !user) return;

    setAdding(true);

    const { error } = await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    if (error) {
      setToast({ message: "Failed to add bookmark", type: "error" });
    } else {
      setTitle("");
      setUrl("");
      await fetchBookmarks();

      setToast({ message: "Bookmark added successfully", type: "success" });
    }

    setTimeout(() => setToast(null), 2500);
    setAdding(false);
  };



  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      setToast({ message: "Failed to delete bookmark", type: "error" });
    } else {
      await fetchBookmarks();
      setToast({ message: "Bookmark deleted", type: "success" });
    }

    setTimeout(() => setToast(null), 2500);
  };



  return (
  <div className="min-h-screen bg-gray-100 text-gray-900">

    {/* 🔵 NAVBAR */}
    <div className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      <h1 className="text-xl font-semibold">Smart Bookmark App</h1>

      {/* Profile Circle */}
      <div className="relative group">
        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition">
          {user?.email?.charAt(0).toUpperCase()}
        </div>

        {/* Dropdown */}
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">

          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {user?.user_metadata?.full_name || user?.user_metadata?.name}
            </p>
            <p className="text-xs text-gray-500">
              {user?.email}
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>

    {/* 🔵 MAIN CONTENT */}
    <div className="max-w-2xl mx-auto mt-10 px-6">

      {/* Add Bookmark Card */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Bookmark</h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Bookmark Title"
            className="border border-gray-300 p-3 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="https://example.com"
            className="border border-gray-300 p-3 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={handleAddBookmark}
            disabled={adding}
            className={`p-3 rounded text-white font-medium transition-all duration-200
              ${
                adding
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 cursor-pointer"
              }
            `}
          >
            {!adding ? (
              "Add Bookmark"
            ) : (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Bookmarks List */}
      <div className="space-y-4">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              {bookmark.title}
            </a>

            <button
              onClick={() => handleDelete(bookmark.id)}
              className="text-red-600 text-sm hover:text-red-800 hover:scale-105 transition cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* 🔔 Toast Notification */}
    {toast && (
      <div
        className={`fixed bottom-6 right-6 px-5 py-3 rounded-md shadow-lg text-white transition-all duration-300 transform
          ${toast.type === "success" ? "bg-black" : "bg-red-600"}
          animate-[fadeInUp_0.3s_ease-out]
        `}
      >
        {toast.message}
      </div>
    )}
  </div>
);


}

