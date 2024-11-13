import { createContext, useContext, useEffect, useState } from "react";
import {
  getUser,
  logoutUser,
  loginWithGoogle,
  setProfileImage,
} from "../appwrite/authentication";
import type { UserType } from "../types/notes.type";
import { useFolder } from "./FolderProvider";
import { createUser, getNotesDB, getUserDB } from "../appwrite/database";

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
  const { resetData, setData } = useFolder();

  useEffect(() => {
    checkLogin().then(() => {
      setIsLoading(false);
    });
  }, []);

  const checkLogin = async () => {
    const user = await getUser();
    if (user) {
      let userData: UserType;
      if (!user.prefs.imageUrl) {
        const imageUrl = await setProfileImage();
        userData = {
          id: user.$id,
          email: user.email,
          photoUrl: imageUrl,
        };
      } else {
        userData = {
          id: user.$id,
          email: user.email,
          photoUrl: user.prefs.imageUrl,
        };
      }
      let userCreated = false;
      try {
        userCreated = await createUser(user.$id, userData);
      } catch (error) {
        console.log("user already created");
      }
      if (!userCreated) {
        try {
          const notes = await getNotesDB(user.$id);
          console.log(notes);
          setData(notes.notes);
        } catch (error) {
          setData([]);
        }
        try {
          const annotatedUser = await getUserDB(user.$id);
          console.log("getting user");
          setUser(annotatedUser);
        } catch (error) {
          console.log("error getting user", error);
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
