// jsxDEV
import { jsx } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
import App from "./src/App";

let root = document.getElementById("root") as HTMLElement;
let container = createRoot(root);
container.render(<App />);
