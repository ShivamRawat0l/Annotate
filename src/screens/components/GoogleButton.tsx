import "./GoogleButton.css";
type GoogleButtonType = {
  onClick: () => void;
};

export const GoogleButton = ({ onClick }: GoogleButtonType) => {
  return (
    <button
      type="button"
      className="login-with-google-btn"
      onClick={onClick}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Sign in with Google
    </button>
  );
};
