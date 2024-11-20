import { createContext, useContext, useEffect, useState } from "react";
import {
  getUser,
  logoutUser,
  loginWithGoogle,
  getUserData,
} from "../appwrite/authentication";
import type { UserType } from "../types/notes.type";
import { useFolder } from "./FolderProvider";
import { createUser, getDBData, getUserDB } from "../appwrite/database";

type AuthenticationContextType = {
  user: UserType | null;
  googleLogin: () => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthenticationContext = createContext<AuthenticationContextType>({
  user: null,
  googleLogin: () => {},
  logout: () => {},
  isLoading: true,
});

const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { resetData, fetchAppwriteFolders } = useFolder();

  useEffect(() => {
    checkLogin().then(() => {
      setIsLoading(false);
    });
  }, []);

  const checkLogin = async () => {
    try {
      const user = await getUser();
      let userData = await getUserData(user);
      try {
        await createUser(user.$id, userData);
      } catch {
        console.log("User already exists");
      }
      const annotatedUser = await getUserDB(user.$id);
      setUser(annotatedUser);
      await fetchAppwriteFolders(user.$id);
    } catch (error) {
      logout();
    }
  };

  const googleLogin = async () => {
    await loginWithGoogle();
    await checkLogin();
  };

  const logout = async () => {
    await logoutUser();
    resetData();
    setUser(null);
  };

  return (
    <AuthenticationContext.Provider
      value={{ user, googleLogin, logout, isLoading }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthenticationContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthenticationProvider");
  }
  return context;
};

export { AuthenticationProvider, useAuth };
