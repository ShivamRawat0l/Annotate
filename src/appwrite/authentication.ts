import { account, OAuthProvider } from "./client";

const loginWithGoogle = async () => {
  try {
    await account.createOAuth2Session(
      OAuthProvider.Google,
      window.location.href,
      window.location.href,
      [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ]
    );
  } catch (error) {
    console.error(error);
  }
};

const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error(error);
  }
};

const getUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    console.error(error);
  }
};

const setProfileImage = async () => {
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
export { loginWithGoogle, logoutUser, getUser, setProfileImage };
