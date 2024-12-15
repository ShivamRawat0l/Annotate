import "@/src/utils/prototype";
import type { Style } from "../constants/Styles";
import { BrowserRouter, Route, Routes } from "react-router";
import { Root } from "./home/Root";
import { Settings } from "./settings/Settings";
import { Profile } from "./profile/Profile";
import { Rules } from "./rules/Rules";
import { Error } from "./error/Error";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Root />} />
				<Route path="/setting" element={<Settings />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/rules" element={<Rules />} />
				<Route path="*" element={<Error />} />
			</Routes>
		</BrowserRouter>
	);
};

const styles: Style = Object.freeze({
	sidebarResizer: {
		width: 4,
		backgroundColor: "black",
		height: "100vh",
	},
});

export default App;
