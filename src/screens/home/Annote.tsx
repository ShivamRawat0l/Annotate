import { Excalidraw } from "@excalidraw/excalidraw";
import type { NoteType } from "../../types/notes.type";
import type { Data } from "../../types/notes.type";
import { useFolder } from "@/src/context/FolderProvider";

type Props = {};

const Annote = ({}: Props) => {
  const { data, setData, selectedNote } = useFolder();

  const handleFileDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = "myFile.json";
    document.body.appendChild(element);
    element.click();
  };
  return (
    <div>
      {selectedNote && (
        <div style={{ height: "800px", width: "1500px" }}>
          <Excalidraw
            renderTopRightUI={() => (
              <div>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(JSON.stringify(data))
                  }
                >
                  Copy
                </button>
                <button
                  onClick={() => {
                    handleFileDownload();
                  }}
                >
                  Export Temp
                </button>
                <button onClick={() => setData(data)}>Save</button>
              </div>
            )}
            initialData={{
              elements: selectedNote.excalidrawData,
              appState: {
                theme: "dark",
              },
            }}
            onChange={(excalidrawData) => {
              selectedNote.excalidrawData = [...excalidrawData];
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Annote;
