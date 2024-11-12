import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { globalStyles } from "@/src/constants/Styles";
import { useAuth } from "@/src/context/AuthenticationProvider";
import { useEffect, useState } from "react";
import { GoogleButton } from "../components/GoogleButton";

export const LoginPopup = () => {
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
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Without login all the changes will be lost.
          </DialogDescription>
        </DialogHeader>
        <div>
          <GoogleButton onClick={() => googleLogin()} />
          <div
            onClick={() => {
              setIsOpen(false);
            }}
          >
            I understand that my data wont be saved.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
