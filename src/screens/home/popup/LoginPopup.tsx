import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
} from "@/components/ui/dialog";
import "./LoginPopup.css";
import { useAuth } from "@/src/context/AuthenticationProvider";
import { useEffect, useState, memo } from "react";
import { LOGIN_POPUP_TIMEOUT } from "@/src/constants/Constants";
import { GoogleButton } from "../explorer/components/components/GoogleButton";

export const LoginPopup = memo(() => {
	const { user } = useAuth();
	const [open, setIsOpen] = useState(false);
	const { googleLogin } = useAuth();
	var popupTimeout: any;

	useEffect(() => {
		if (user) {
			setIsOpen(false);
			clearTimeout(popupTimeout);
		} else {
			popupTimeout = setTimeout(() => {
				setIsOpen(true);
			}, LOGIN_POPUP_TIMEOUT);
		}
		return () => clearTimeout(popupTimeout);
	}, [user]);

	const renderTitle = () => {
		return (
			<DialogTitle>
				<div
					style={{
						fontSize: 30,
						fontFamily: "Josefin",
						paddingTop: 20,
					}}
				>
					Welcome to annotate
				</div>
			</DialogTitle>
		);
	};

	const renderDescription = () => {
		return (
			<DialogDescription style={{ paddingTop: 15, paddingBottom: 15 }}>
				<span
					style={{
						fontSize: 18,
						fontWeight: 300,
						fontFamily: "Josefin",
						lineHeight: 2,
					}}
				>
					Annotate is a note taking app for notes that are supposed to
					be there for long term.
					<br />
					<br />
					• Keyboard shortcuts for nearly everything
					<br />
					• No ads.
					<br />
					• Search through the notes blazingly fast.
					<br />
					• Sync your notes with Google account.
					<br />
					• Access your notes from any device.
					<br />
				</span>
			</DialogDescription>
		);
	};

	const renderButtons = () => {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 10,
					paddingTop: 20,
				}}
			>
				<GoogleButton onClick={googleLogin} />
				<div
					className="dismiss"
					onClick={() => {
						setIsOpen(false);
					}}
					style={{
						alignSelf: "center",
						paddingTop: 10,
						fontFamily: "Josefin",
					}}
				>
					I understand that my data wont be saved.
				</div>
			</div>
		);
	};

	return (
		<Dialog open={open} defaultOpen={false} modal>
			<DialogOverlay style={{ backdropFilter: "blur(3px)" }} />
			<DialogContent>
				<DialogHeader>
					{renderTitle()}
					{renderDescription()}
				</DialogHeader>
				{renderButtons()}
			</DialogContent>
		</Dialog>
	);
});