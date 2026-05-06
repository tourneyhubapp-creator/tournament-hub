import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserRole = "athlete" | "coach" | "host" | "staff" | "admin";

export interface TournamentUser {
  id: number;
  name: string | null;
  email: string | null;
  role: UserRole;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
}

interface TournamentContextType {
  user: TournamentUser | null;
  setUser: (user: TournamentUser | null) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  isLoading: boolean;
}

const TournamentContext = createContext<TournamentContextType>({
  user: null,
  setUser: () => {},
  activeRole: "athlete",
  setActiveRole: () => {},
  isLoading: true,
});

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<TournamentUser | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>("athlete");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("activeRole").then((role) => {
      if (role === "athlete" || role === "coach" || role === "host" || role === "staff" || role === "admin") {
        setActiveRole(role);
      }
      setIsLoading(false);
    });
  }, []);

  const handleSetRole = async (role: UserRole) => {
    setActiveRole(role);
    await AsyncStorage.setItem("activeRole", role);
  };

  return (
    <TournamentContext.Provider
      value={{ user, setUser, activeRole, setActiveRole: handleSetRole, isLoading }}
    >
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  return useContext(TournamentContext);
}
