import { createRoot } from "react-dom/client";
import App from "./src/screens/App";
import "./index.css";
import "./assets/fonts/Josefin.woff2";
import "./assets/fonts/Mononoki.woff2";
import "./assets/fonts/Recursive.woff2";
import "./assets/fonts/Schoolbell.woff2";
import "./assets/fonts/Work.woff2";

let root = document.getElementById("root") as HTMLElement;
let container = createRoot(root);
container.render(<App />);
