import { LogOutIcon, RefreshCcwDotIcon } from "lucide-react";
import { globalStyles, type Style } from "@/src/constants/styles";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExplorerConstants } from "./constants/ExplorerConstants";
import { GoogleButton } from "../popup/components/GoogleButton";
import { StorageButton } from "../popup/components/StorageButton";
import { useAuth } from "@/src/authentication/AuthenticationProvider";
import { useExplorer } from "./ExplorerProvider";
import { useStorage } from "@/src/storage/StorageContext";

const CustomRefreshCcwDotIcon = motion(RefreshCcwDotIcon);

export const ExplorerFooter = () => {
	const { user, logout, login } = useAuth();
	const { isSyncing, syncNotesOnline } = useExplorer();
	const isAnimating = useRef(false);

	useEffect(() => {
		if (isSyncing) {
			document.body.style.cursor = "wait";
		} else {
			document.body.style.cursor = "default";
		}
	}, [isSyncing]);


	const handleAnimationComplete = () => {
		if (!isSyncing && isAnimating.current) {
			isAnimating.current = false;
		}
	};

	const renderLogin = () => {
		return (
			<div style={styles.loginButton}>
				<StorageButton
					style={{
						marginBottom: 20
					}}
					onClick={() => {
					}} />
				<GoogleButton onClick={login} />
			</div>
		);
	};

	const renderUserAvatar = () => {
		return (
			<div style={{ width: 40, height: 40 }}>
				<Avatar>
					<AvatarImage src={user?.photoUrl} />
					<AvatarFallback>
						{(user?.name ?? "4 0 4")
							.split(" ")
							.map((n) => n[0])
							.join("")}
					</AvatarFallback>
				</Avatar>
			</div>
		);
	};

	const renderSyncStatus = () => {
		return (
			<div style={{ ...globalStyles.flexColumn }}>
				<div style={{ fontSize: 14 }}>Synced 5 minutes ago</div>
				<div style={{ fontSize: 10, color: "gray" }}>
					Press Ctrl + S to save
				</div>
			</div>
		);
	};

	const renderUser = () => {
		return (
			<div style={styles.userFooter}>
				{renderUserAvatar()}
				{renderSyncStatus()}
				<CustomRefreshCcwDotIcon
					onAnimationStart={() => {
						isAnimating.current = true;
					}}
					onAnimationComplete={handleAnimationComplete}
					initial={{
						rotateZ: 0,
					}}
					animate={{
						rotateZ: isSyncing || isAnimating.current ? 360 : 0,
					}}
					transition={{
						duration: 1,
						ease: "anticipate",
					}}
					onClick={() => {
						syncNotesOnline();
					}}
				/>
				<LogOutIcon onClick={() => logout()} />
			</div>
		);
	};

	return <>{!user ? renderLogin() : renderUser()}</>;
};

const styles: Style = Object.freeze({
	loginButton: {
		...globalStyles.flexColumn,
		flex: 0,
		paddingTop: ExplorerConstants.PADDING_TOP_FOOTER,
		paddingBottom: ExplorerConstants.PADDING_BOTTOM_FOOTER,
		paddingLeft: ExplorerConstants.PADDING_LEFT_SIDEBAR,
		paddingRight: ExplorerConstants.PADDING_RIGHT_SIDEBAR,
	},
	userFooter: {
		...globalStyles.flexRow,
		flex: 0,
		alignItems: "center",
		paddingTop: ExplorerConstants.PADDING_TOP_FOOTER,
		paddingBottom: ExplorerConstants.PADDING_BOTTOM_FOOTER,
		paddingLeft: ExplorerConstants.PADDING_LEFT_SIDEBAR,
		paddingRight: ExplorerConstants.PADDING_RIGHT_SIDEBAR,
		justifyContent: "space-between",
		gap: 10,
		borderBottom: "4px solid #e0ffe0",
	},
});
