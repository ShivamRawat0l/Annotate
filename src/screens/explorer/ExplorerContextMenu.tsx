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
  const { selectedFolder, createNewFolder, createNewNote } = useFolder();
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
          if (selectedFolder) createNewFolder(selectedFolder);
        })}
        {renderRightClickMenuOptions("Create Note", "⇧N", () => {
          createNewNote(selectedFolder);
        })}
        {renderRightClickMenuOptions("Rename", "⇧R", () => {
          setFolderEditing(selectedFolder?.id ?? null);
        })}
        {renderRightClickMenuOptions("Delete", "⇧D", () => {
          // TODO: Implement
        })}
        {renderRightClickMenuOptions("Toggle Expand", "⇧T", () => {
          // TODO: Implement
        })}
        {renderRightClickMenuOptions("Create Folder", "⇧A", () => {
          if (selectedFolder) createNewFolder(selectedFolder);
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
