import { createContext, useContext, useEffect, useState } from "react";
import {
  getUser,
  logoutUser,
  loginWithGoogle,
} from "../appwrite/authentication";
import type { UserType } from "../types/notes.type";
import { useFolder } from "./FolderProvider";
import { createUser, getNotesDB, getUserDB } from "../appwrite/database";

// TODO: Fix this
type AuthenticationContextType = {
  user: any | null;
  googleLogin: () => void;
  logout: () => void;
};

const AuthenticationContext = createContext<AuthenticationContextType>({
  user: null,
  googleLogin: () => {},
  logout: () => {},
});

const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const { resetData, setData } = useFolder();

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const user = await getUser();
    if (user) {
      const userData: UserType = {
        id: user.$id,
        email: user.email,
      };
      const userCreated = await createUser(user.$id, userData);
      console.log("user created", userCreated);
      if (!userCreated) {
        try {
          const notes = await getNotesDB(user.$id);
          setData(notes.notes);
        } catch (error) {
          setData([]);
        }
        try {
          const annotatedUser = await getUserDB(user.$id);
          setUser(annotatedUser);
        } catch (error) {
          setUser(null);
        }
      } else {
        setData([]);
        setUser(userData);
      }
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
    <AuthenticationContext.Provider value={{ user, googleLogin, logout }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthenticationContext);
};

export { AuthenticationProvider, useAuth };
