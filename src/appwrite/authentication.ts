import { account, OAuthProvider } from "./client";

const loginWithGoogle = async () => {
  try {
    await account.createOAuth2Session(
      OAuthProvider.Google,
      window.location.href
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

export { loginWithGoogle, logoutUser, getUser };
