"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const search1 = query.trim();
    if (!search1) return;

    router.push(`/search?query=${encodeURIComponent(search1)}`);
  };

  return (
    <form onSubmit={search} className="w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="w-full border-separate rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          🔍
        </button>
      </div>
    </form>
  );
}
