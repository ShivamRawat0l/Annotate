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
        paddingTop: 140,
        marginLeft: 30,
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 600 }}>
        Recently Accessed Notes
      </div>
      <div></div>
    </motion.div>
  );
}
