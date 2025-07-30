import { Button } from "@/components/ui/button";
import Image from "next/image";
import ChatInputBox from "./_components/ChatInputBox";
import LibraryDisplay from "./_components/LibraryDisplay";

export default function Home() {
  // Debug: Check environment variables
  const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (!isClerkConfigured || !isSupabaseConfigured) {
    return (
      <div className="flex-1 w-full flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Required</h1>
          <p className="text-gray-600 mb-4">Environment variables are not configured.</p>
          <div className="text-sm text-gray-500 space-y-2">
            {!isClerkConfigured && <p>❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY missing</p>}
            {!isSupabaseConfigured && <p>❌ NEXT_PUBLIC_SUPABASE_URL missing</p>}
          </div>
          <p className="text-sm text-gray-400 mt-4">Please check your .env.local file</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full">
      <ChatInputBox />
      <LibraryDisplay />
    </div>
  );
}
