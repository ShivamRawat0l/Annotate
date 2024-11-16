import { motion, MotionValue } from "framer-motion";

export function Search({
  sidebarWidth,
}: {
  sidebarWidth: MotionValue<number>;
}) {
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
