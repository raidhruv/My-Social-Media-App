import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export default function useCurrentUser() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {

    const token = localStorage.getItem("accessToken");

    if (!token) {
        setUser(null);
        setLoading(false);
        return;
    }

    try {
      const { data } = await api.get("/users/me");

      // The backend returns user data in the response

      setUser(data);
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return {
    user,
    loading,
    refreshUser,
    setUser
  };
}