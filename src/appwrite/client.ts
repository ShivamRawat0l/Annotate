import { Client, Databases } from "appwrite";
import { Account } from "appwrite";
import { OAuthProvider } from "appwrite";

const client = new Client();
client.setProject(process.env.APPWRITE_PROJECT_ID as string);

const account = new Account(client);
const databases = new Databases(client);
export { account, OAuthProvider, databases };
