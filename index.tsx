// jsxDEV
import { jsx } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
import App from "./src/screens/App";
import "./index.css";
import "./src/fonts/Josefin.woff2";
import "./src/fonts/Mononoki.woff2";
import "./src/fonts/Recursive.woff2";
import "./src/fonts/Schoolbell.woff2";
import "./src/fonts/Work.woff2";

let root = document.getElementById("root") as HTMLElement;
let container = createRoot(root);
container.render(<App />);
