/* eslint-disable react-hooks/set-state-in-effect */
// src/hooks/useAuth.ts
"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  id: number;
  role: "gym" | "member";
  name: string;
  surname?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("auth_token");

    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUser(decoded);
      } catch (e) {
        setUser(null);
      }
    }
    
    setLoading(false);
  }, []);

  return { user, loading };
};