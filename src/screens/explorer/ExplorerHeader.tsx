import Logo from "@/assets/icon.png";
import { getTheme } from "@/components/theme-provider";
import { Colors } from "@/src/constants/Colors";
import { globalStyles } from "@/src/constants/Styles";
import { motion } from "framer-motion";

export const ExploerHeader = () => {
  const theme = getTheme();
  return (
    <div
      style={{
        ...globalStyles.flexRow,
        flexShrink: 0,
        flex: 0,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 14,
        marginBottom: 14,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 30,
            fontWeight: "900",
          }}
        >
          Annotate
        </div>
        <motion.div
          style={{ fontSize: 14, color: "gray", fontWeight: "300" }}
          whileHover={{ color: Colors[theme].primary }}
        >
          A note taking app for everyone
        </motion.div>
      </div>
      <img
        style={{
          height: 68,
          width: 68,
        }}
        src={Logo}
        alt="Annotate"
        height={68}
        width={68}
      />
    </div>
  );
};
