import "@/src/utils/prototype";
import { BrowserRouter, Route, Routes } from "react-router";
import { Root } from "./home/Root";
import { Settings } from "./settings/Settings";
import { Profile } from "./profile/Profile";
import { Rules } from "./rules/Rules";
import { Error } from "./error/Error";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthenticationProvider } from "../authentication/AuthenticationProvider";
import { StorageProvider } from "../storage/StorageContext";
import { ThemeProvider } from "../theme/ThemeProvider";

export default () => {
	return (
		<ThemeProvider>
			<TooltipProvider>
				<StorageProvider>
					<AuthenticationProvider>
						<BrowserRouter>
							<Routes>
								<Route path="/" element={<Root />} />
								<Route path="/settings" element={<Settings />} />
								<Route path="/profile" element={<Profile />} />
								<Route path="/rules" element={<Rules />} />
								<Route path="/credits" element={<Rules />} />
								<Route path="*" element={<Error />} />
							</Routes>
						</BrowserRouter>
					</AuthenticationProvider>
				</StorageProvider>
			</TooltipProvider>
		</ThemeProvider>
	);
};

