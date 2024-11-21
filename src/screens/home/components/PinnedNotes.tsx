import { globalStyles } from "@/src/constants/Styles";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Colors } from "@/src/constants/Colors";
import { getTheme, useTheme } from "@/components/theme-provider";
import { NotebookPenIcon, Trash2Icon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const PinnedNotes = () => {
  const [popupOpened, setPopupOpened] = useState(false);
  const theme = getTheme();

  useEffect(() => {
    document.addEventListener("keydown", shortcuts);
    return () => {
      document.removeEventListener("keydown", shortcuts);
    };
  }, []);

  const shortcuts = (e: KeyboardEvent) => {
    if (e.key === "p" && e.ctrlKey) {
      setPopupOpened((e) => !e);
    }
  };

  return (
    <Popover open={popupOpened}>
      <PopoverTrigger onClick={() => setPopupOpened((e) => !e)}>
        {popupOpened ? "📌" : "📌"}
      </PopoverTrigger>
      <PopoverContent
        style={{
          backgroundColor: Colors[theme].background,
          marginTop: 30,
        }}
      >
        <div
          style={{
            ...globalStyles.flexRow,
            alignItems: "center",
            backgroundColor: Colors[theme].background,
          }}
        >
          <NotebookPenIcon />
          Javascript
          <Trash2Icon />
        </div>
      </PopoverContent>
    </Popover>
  );
};
