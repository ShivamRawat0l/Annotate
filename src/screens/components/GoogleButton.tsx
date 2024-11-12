import "./GoogleButton.css";
type GoogleButtonType = {
  onClick: () => void;
};

export const GoogleButton = ({ onClick }: GoogleButtonType) => {
  return (
    <button type="button" className="login-with-google-btn" onClick={onClick}>
      Sign in with Google
    </button>
  );
};
