import { useAuth } from "@/src/context/AuthenticationProvider";
import { GoogleButton } from "../components/GoogleButton";
import {
  LogOutIcon,
  PlusSquare,
  RefreshCcwDotIcon,
  RefreshCwIcon,
} from "lucide-react";
import { globalStyles } from "@/src/constants/Styles";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useExplorer } from "@/src/context/ExplorerProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CustomRefreshCcwDotIcon = motion(RefreshCcwDotIcon);

export const ExplorerFooter = () => {
  const { user, googleLogin, logout } = useAuth();
  const { isSyncing, syncNotesOnline } = useExplorer();
  const isAnimating = useRef(false);

  useEffect(() => {
    if (isSyncing) {
      document.body.style.cursor = "wait";
    } else {
      document.body.style.cursor = "default";
    }
  }, [isSyncing]);

  const handleAnimationComplete = () => {
    if (!isSyncing && isAnimating.current) {
      isAnimating.current = false;
    }
  };
  return (
    <>
      {!user ? (
        <div
          style={{
            ...globalStyles.flexRow,
            flex: 0,
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 30,
            paddingBottom: 30,
            paddingLeft: 18,
            paddingRight: 18,
          }}
        >
          <GoogleButton onClick={googleLogin} />
        </div>
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
            <Avatar>
              <AvatarImage src={user.photoUrl} />
              <AvatarFallback>
                {(user.name ?? "4 0 4")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <div style={{ ...globalStyles.flexColumn }}>
            <div style={{ fontSize: 14 }}>Synced 5 minutes ago</div>
            <div style={{ fontSize: 10, color: "gray" }}>
              Press Ctrl + S to save
            </div>
          </div>
          <CustomRefreshCcwDotIcon
            onAnimationStart={() => {
              isAnimating.current = true;
            }}
            onAnimationComplete={handleAnimationComplete}
            initial={{
              rotateZ: 0,
            }}
            animate={{
              rotateZ: isSyncing || isAnimating.current ? 360 : 0,
            }}
            transition={{
              duration: 1,
              ease: "anticipate",
            }}
            onClick={() => {
              syncNotesOnline();
            }}
          />
          <LogOutIcon onClick={() => logout()} />
        </div>
      )}
    </>
  );
};
