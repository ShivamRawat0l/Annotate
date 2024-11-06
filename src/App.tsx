import { Excalidraw } from "@excalidraw/excalidraw";
import Home from "./Home/Home";
globalThis["process"] = {
  ...globalThis.process,
  env: {
    NODE_ENV: "development",
    IS_PREACT: "true",
  },
};
const App = () => {
  console.log(process.env.NODE_ENV);
  //console.log(process.env.IS_PREACT);
  return <Home />;
};

export default App;
