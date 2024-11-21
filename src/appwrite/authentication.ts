import type { Models } from "appwrite";
import { account, OAuthProvider } from "./client";
import type { UserType } from "../types/notes.type";

export const loginWithGoogle = async () => {
  try {
    await account.createOAuth2Session(
      OAuthProvider.Google,
      window.location.href,
      window.location.href,
      []
    );
  } catch (error) {
    console.error(error);
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error(error);
  }
};

export const getUser = async () => {
  const user = await account.get();
  return user;
};

export const setProfileImage = async () => {
  const session = await account.getSession("current");
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${session.providerAccessToken}`,
    {
      headers: {
        Authorization: `Bearer ${session.providerAccessToken}`,
      },
    }
  );
  const data = await response.json();
  account.updatePrefs({
    photoUrl: data.picture,
  });
  return data.picture;
};

export const getUserData = async (user: Models.User<Models.Preferences>) => {
  let userData: UserType;
  if (!user.prefs.imageUrl) {
    const imageUrl = await setProfileImage();
    userData = {
      id: user.$id,
      email: user.email,
      name: user.name,
      photoUrl: imageUrl,
    };
  } else {
    userData = {
      id: user.$id,
      email: user.email,
      name: user.name,
      photoUrl: user.prefs.imageUrl,
    };
  }
  return userData;
};
