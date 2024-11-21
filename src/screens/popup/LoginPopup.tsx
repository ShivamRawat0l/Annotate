import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "./LoginPopup.css";
import { useAuth } from "@/src/context/AuthenticationProvider";
import { useEffect, useState, memo } from "react";
import { GoogleButton } from "../components/GoogleButton";

export const LoginPopup = memo(() => {
  const { user } = useAuth();
  const [open, setIsOpen] = useState(false);
  const { googleLogin } = useAuth();
  var popupTimeout: any;

  useEffect(() => {
    if (user) {
      setIsOpen(false);
      clearTimeout(popupTimeout);
    } else {
      popupTimeout = setTimeout(() => {
        setIsOpen(true);
      }, 4000);
    }
    return () => clearTimeout(popupTimeout);
  }, [user]);

  return (
    <Dialog open={open} defaultOpen={false} modal={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ paddingBottom: 10 }}>
            <div style={{ fontSize: 40 }}>Hello there!</div>
          </DialogTitle>
          <DialogDescription style={{ paddingTop: 15, paddingBottom: 20 }}>
            <span style={{ fontSize: 16 }}>
              Without login all the changes will be stored in the browser and
              can be lost while doing the google login.
              <br />
              <br />
              • Sync your notes with Google account.
              <br />
              • Access your notes from any device.
              <br />
              • Access annote notes here. ( WIP )
              <br />
            </span>
          </DialogDescription>
        </DialogHeader>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <GoogleButton onClick={() => googleLogin()} />
          <div
            className="dismiss"
            onClick={() => {
              setIsOpen(false);
            }}
            style={{
              alignSelf: "center",
              paddingTop: 10,
            }}
          >
            I understand that my data wont be saved.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
