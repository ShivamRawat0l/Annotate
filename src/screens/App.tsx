import "@/src/utils/prototype";
import { BrowserRouter, Route, Routes } from "react-router";
import { Fragment } from "react"
import { Root } from "./home/Root";
import { Settings } from "./settings/Settings";
import { Profile } from "./profile/Profile";
import { Rules } from "./rules/Rules";
import { Error } from "./error/Error";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthenticationProvider } from "../authentication/AuthenticationProvider";
import { StorageProvider } from "../storage/StorageContext";
import { ThemeProvider } from "../theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export default () => {
	return (
		<ThemeProvider>
			<Fragment>
				<TooltipProvider>
					<AuthenticationProvider>
						<StorageProvider>
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
						</StorageProvider>
					</AuthenticationProvider>
				</TooltipProvider>
				<Toaster />
			</Fragment>
		</ThemeProvider >
	);
};

