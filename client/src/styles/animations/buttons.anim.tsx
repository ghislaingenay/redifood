import { motion } from "framer-motion";

export const AnimButton = ({ children }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0.5, scale: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ ease: "easeOut", duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};
