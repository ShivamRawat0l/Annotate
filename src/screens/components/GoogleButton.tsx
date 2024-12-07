import "./GoogleButton.css";
import { memo } from "react";

type GoogleButtonType = {
	onClick: () => void;
};

export const GoogleButton = memo(({ onClick }: GoogleButtonType) => {
	return (
		<button
			type="button"
			className="login-with-google-btn"
			onClick={onClick}
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				fontFamily: "Josefin",
				fontSize: 20,
				fontWeight: "bold",
			}}
		>
			Sign in with Google
		</button>
	);
});
