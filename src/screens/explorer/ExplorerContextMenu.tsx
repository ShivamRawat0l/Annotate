import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ContextMenuContent } from "@/components/ui/context-menu";
import { globalStyles } from "@/src/constants/Styles";
import { useFolder } from "@/src/context/FolderProvider";
import { useExplorer } from "@/src/context/ExplorerProvider";

type ExplorerContextMenuType = {
  children: React.ReactNode;
};

export const ExplorerContextMenu = ({ children }: ExplorerContextMenuType) => {
  const {
    selectedFolderPath,
    createNewFolder,
    createNewNote,
    toggleFolderExpand,
  } = useFolder();
  const { setFolderEditing } = useExplorer();

  const renderRightClickMenuOptions = (
    title: string,
    shortcut: string,
    onClick: () => void
  ) => {
    return (
      <ContextMenuItem onClick={onClick}>
        {title}
        <ContextMenuShortcut>{shortcut}</ContextMenuShortcut>
      </ContextMenuItem>
    );
  };

  const RightClickMenu = () => {
    return (
      <ContextMenuContent className="w-64">
        {renderRightClickMenuOptions("Create Folder", "⇧A", () => {
          if (selectedFolderPath) createNewFolder(selectedFolderPath);
        })}
        {renderRightClickMenuOptions("Create Note", "⇧N", () => {
          if (selectedFolderPath) createNewNote(selectedFolderPath);
        })}
        {renderRightClickMenuOptions("Rename", "⇧R", () => {
          if (selectedFolderPath) setFolderEditing(selectedFolderPath.last);
        })}
        {renderRightClickMenuOptions("Delete", "⇧D", () => {
          // TODO: Implement
        })}
        {renderRightClickMenuOptions("Toggle Expand", "⇧T", () => {
          if (selectedFolderPath) toggleFolderExpand(selectedFolderPath.last);
        })}
      </ContextMenuContent>
    );
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger style={globalStyles.flexRow}>
        {children}
      </ContextMenuTrigger>
      <RightClickMenu />
    </ContextMenu>
  );
};
