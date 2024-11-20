import { Progress } from "@/components/ui/progress";
import { Colors } from "@/src/constants/Colors";
import { getTheme } from "@/components/theme-provider";
import { useMemo, useState } from "react";
import { useAuth } from "@/src/context/AuthenticationProvider";
import { useFolder } from "@/src/context/FolderProvider";

export const Loading = () => {
  const theme = getTheme();
  const { isLoading } = useAuth();
  const { isLoading: isLoadingFolder } = useFolder();

  const progress = useMemo(() => {
    return (isLoading ? 50 : 0) + (isLoadingFolder ? 50 : 0);
  }, [isLoading, isLoadingFolder]);
  console.log(isLoading, isLoadingFolder);

  if (!isLoading && !isLoadingFolder) return null;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: Colors[theme].background,
        gap: 20,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        Downloading your workspace
      </div>
      <Progress value={progress} style={{ width: "200px" }} />
      <p style={{ fontSize: "12px", color: Colors[theme].text }}>
        Made with ❤️ by{" "}
        <a
          href="https://github.com/ShivamRawat0l"
          target="_blank"
          style={{ textDecoration: "underline" }}
        >
          me
        </a>
      </p>
      <p style={{ fontSize: "12px", color: Colors[theme].text }}>
        Contribute to this project on{" "}
        <a
          href="https://github.com/ShivamRawat0l/Annotate"
          target="_blank"
          style={{
            fontSize: "12px",
            color: Colors[theme].text,
            textDecoration: "underline",
          }}
        >
          Open Source
        </a>
      </p>
    </div>
  );
};
