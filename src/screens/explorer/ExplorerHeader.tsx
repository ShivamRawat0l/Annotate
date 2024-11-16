import Logo from "@/assets/icon.png";
import { globalStyles } from "@/src/constants/Styles";

export const ExploerHeader = () => {
  return (
    <div
      style={{
        ...globalStyles.flexRow,
        flexShrink: 0,
        flex: 0,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 12,
        marginBottom: 12,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        Annotate
        <div style={{ fontSize: 12, color: "gray" }}>
          A note taking app for everyone
        </div>
      </div>
      <img
        style={{
          height: 60,
          width: 60,
        }}
        src={Logo}
        alt="Annotate"
        height={60}
        width={60}
      />
    </div>
  );
};
