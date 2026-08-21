"use client";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth";
import { supabase } from "@/utils/client";

function toStoreUser(user: SupabaseUser) {
  return {
    id: user.id,
    email: user.email ?? "",
    name: user.user_metadata?.username || user.email || "참여자",
  };
}

export default function AuthSessionSync() {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const markInitialized = useAuthStore((state) => state.markInitialized);

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session?.user) login(toStoreUser(data.session.user));
      else logout();
      markInitialized();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) login(toStoreUser(session.user));
      else logout();
      markInitialized();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [login, logout, markInitialized]);

  return null;
}
