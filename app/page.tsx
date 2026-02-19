"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";


export default function Home() {
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md text-center">

        {/* Logo / Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Smart Bookmark App
        </h1>

        <p className="text-gray-600 mb-8 text-sm">
          Save, manage and access your bookmarks securely from anywhere.
        </p>

        {/* Google Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 p-3 rounded-md bg-white 
  hover:shadow-md hover:-translate-y-0.5 
  active:scale-95 
  transition-all duration-200 ease-in-out"
        >
          {!loading ? (
            <>
              {/* Google Icon */}
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.3 0 6.3 1.2 8.7 3.2l6.5-6.5C35.5 2.2 30.2 0 24 0 14.6 0 6.6 5.5 2.7 13.6l7.8 6C12.2 13.3 17.7 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.5 2.7-2 5-4.2 6.6l6.5 5c3.8-3.5 7.5-8.7 7.5-15.6z" />
                <path fill="#FBBC05" d="M10.5 28.6c-.5-1.3-.8-2.7-.8-4.1s.3-2.8.8-4.1l-7.8-6C1 17.5 0 20.7 0 24.5s1 7 2.7 10.1l7.8-6z" />
                <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-6.5-5c-2 1.4-4.6 2.3-8.7 2.3-6.3 0-11.8-3.8-13.5-9.1l-7.8 6C6.6 42.5 14.6 48 24 48z" />
              </svg>

              <span className="text-gray-900 font-medium">
                Continue with Google
              </span>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
              <span className="text-gray-700 text-sm">Redirecting...</span>
            </div>
          )}
        </button>


        {/* Footer */}
        <p className="text-xs text-gray-500 mt-8">
          Secure authentication powered by Google OAuth.
        </p>
      </div>
    </div>
  );
}
