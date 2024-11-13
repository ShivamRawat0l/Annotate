import { globalStyles } from "@/src/constants/Styles";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Colors } from "@/src/constants/Colors";
import { getTheme, useTheme } from "@/components/theme-provider";
import { NotebookPenIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

export const PinnedNotes = () => {
  const [popupOpened, setPopupOpened] = useState(false);
  const theme = getTheme();
  return (
    <Popover open={popupOpened}>
      <PopoverTrigger onClick={() => setPopupOpened((e) => !e)}>
        {popupOpened ? "Close" : "Open"} 📌 Notes
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
