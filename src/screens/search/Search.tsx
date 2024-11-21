import { motion, MotionValue } from "framer-motion";
import { memo } from "react";

export const Search = memo(
  ({ sidebarWidth }: { sidebarWidth: MotionValue<number> }) => {
    return (
      <motion.div
        style={{
          height: "96vh",
          width: sidebarWidth,
          paddingTop: 40,
          marginLeft: 40,
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 900 }}>
          Recently Accessed Notes
        </div>
        <div></div>
      </motion.div>
    );
  }
);
