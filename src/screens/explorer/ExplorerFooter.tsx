import { Button } from "@/components/ui/button";
import { updateNote } from "@/src/appwrite/database";
import { useAuth } from "@/src/context/AuthenticationProvider";
import { useFolder } from "@/src/context/FolderProvider";
import { GoogleButton } from "../components/GoogleButton";
import {
  FolderSyncIcon,
  LogOutIcon,
  PlusSquare,
  RefreshCcwDotIcon,
  RefreshCwIcon,
} from "lucide-react";
import { globalStyles } from "@/src/constants/Styles";

export const ExplorerFooter = () => {
  const { user, googleLogin, logout } = useAuth();
  const { data, setData, setSelectedNote, createNewFolder } = useFolder();

  return (
    <>
      {!user ? (
        <>
          <GoogleButton onClick={googleLogin} />
        </>
      ) : (
        <div
          style={{
            ...globalStyles.flexRow,
            flex: 0,
            alignItems: "center",
            paddingTop: 30,
            paddingBottom: 30,
            paddingLeft: 18,
            paddingRight: 18,
            justifyContent: "space-between",
            gap: 10,
            borderBottom: "4px solid #e0ffe0",
          }}
        >
          <div style={{ width: 40, height: 40 }}>
            <img
              src={user.photoUrl}
              style={{ width: 40, height: 40, borderRadius: 40 }}
              alt="user"
            />
          </div>
          <div style={{ ...globalStyles.flexColumn }}>
            <div style={{ fontSize: 14 }}>Synced 5 minutes ago</div>
            <div style={{ fontSize: 10, color: "gray" }}>
              Press CTRL + S to save
            </div>
          </div>
          <RefreshCcwDotIcon onClick={() => updateNote(user?.id, data)} />
          <LogOutIcon onClick={() => logout()} />
        </div>
      )}
    </>
  );
};
